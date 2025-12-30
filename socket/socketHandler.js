import Message from "../models/Message.js";
import User from "../models/user.js";

// Store online users: userId -> socketId
// For scaling, use Redis. For single instance, this Map is fine.
const onlineUsers = new Map();

export const socketHandler = (io) => {
    return (socket) => {
        const user = socket.user;
        // 1. Join user-specific room for multi-device/tab support
        socket.join(user.id);
        onlineUsers.set(user.id, socket.id); // Keep the map for fast online checks if needed

        // Notify everyone that this user is online
        io.emit("user_online", { userId: user.id });

        // Send the list of current online users to the connected user
        socket.emit("online_users", Array.from(onlineUsers.keys()));

        console.log(`User connected: ${user.id} (${user.userType})`);

        // 2. Handle Send Message
        socket.on("send_message", async (data, callback) => {
            try {
                const { receiverId, text, replyTo } = data;

                if (!receiverId || !text) {
                    return callback && callback({ success: false, error: "Missing fields" });
                }

                // Fetch receiver to get userType
                const receiver = await User.findById(receiverId);
                if (!receiver) {
                    return callback && callback({ success: false, error: "Receiver not found" });
                }

                // Create Message
                const tempMsg = {
                    senderId: user.id,
                    senderType: user.userType,
                    receiverId: receiverId,
                    receiverType: receiver.userType,
                    text: text,
                    replyTo: replyTo || null,
                    createdAt: new Date(),
                };

                const newMessage = await Message.create(tempMsg);

                // Populate for client efficiently
                await newMessage.populate([
                    { path: "replyTo", select: "text senderId" },
                    { path: "senderId", select: "name userType phone email" },
                    { path: "receiverId", select: "name userType phone email" }
                ]);

                const populatedMsg = newMessage.toObject();
                // Format to match frontend expectations
                const formattedMsg = {
                    ...populatedMsg,
                    id: populatedMsg._id.toString(),
                    sender: populatedMsg.senderId ? { ...populatedMsg.senderId, id: populatedMsg.senderId._id.toString() } : { id: user.id, userType: user.userType },
                    receiver: populatedMsg.receiverId ? { ...populatedMsg.receiverId, id: populatedMsg.receiverId._id.toString() } : { id: receiverId },
                };

                // Emit to Receiver and all Sender sessions (except the current one if preferred, but simpler to just emit to all)
                io.to(receiverId).emit("receive_message", formattedMsg);
                socket.to(user.id).emit("receive_message", formattedMsg); // Notify other tabs of same user

                callback && callback({ success: true, data: formattedMsg });

            } catch (error) {
                console.error("Socket send_message error:", error);
                callback && callback({ success: false, error: "Server error" });
            }
        });

        // 3. Handle Edit Message
        socket.on("edit_message", async (data, callback) => {
            try {
                const { messageId, newText } = data;

                const message = await Message.findById(messageId);
                if (!message) {
                    return callback && callback({ success: false, error: "Message not found" });
                }

                // Authorization check
                if (message.senderId.toString() !== user.id) {
                    return callback && callback({ success: false, error: "Unauthorized" });
                }

                message.text = newText;
                message.isEdited = true;
                await message.save();

                const updatedMsg = await Message.findById(messageId).populate("replyTo", "text").lean();

                // Notify Receiver and all Sender sessions
                io.to(message.receiverId.toString()).emit("message_updated", updatedMsg);
                io.to(user.id).emit("message_updated", updatedMsg);

                callback && callback({ success: true, data: updatedMsg });

            } catch (error) {
                console.error("Socket edit_message error:", error);
                callback && callback({ success: false, error: "Server error" });
            }
        });

        // 4. Handle Delete Message (Soft Delete)
        socket.on("delete_message", async (data, callback) => {
            try {
                const { messageId } = data;

                const message = await Message.findById(messageId);
                if (!message) return callback && callback({ success: false, error: "Not found" });

                if (message.senderId.toString() !== user.id) {
                    return callback && callback({ success: false, error: "Unauthorized" });
                }

                message.isDeleted = true;
                message.text = "This message was deleted"; // Optional: Clear text
                await message.save();

                // Notify Receiver and all Sender sessions
                io.to(message.receiverId.toString()).emit("message_deleted", { messageId });
                io.to(user.id).emit("message_deleted", { messageId });

                callback && callback({ success: true, messageId });

            } catch (error) {
                console.error("Socket delete_message error:", error);
                callback && callback({ success: false, error: "Server error" });
            }
        });

        // 5. Typing Indicators
        socket.on("typing", (data) => {
            const { receiverId } = data;
            io.to(receiverId).emit("user_typing", { userId: user.id });
        });

        socket.on("stop_typing", (data) => {
            const { receiverId } = data;
            io.to(receiverId).emit("user_stop_typing", { userId: user.id });
        });

        // 6. Disconnect
        socket.on("disconnect", () => {
            console.log(`User disconnected: ${user.id}`);
            onlineUsers.delete(user.id);
            // Notify everyone that this user is offline
            io.emit("user_offline", { userId: user.id });
        });
    };
};
