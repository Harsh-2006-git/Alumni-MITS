import Message from "../models/Message.js";
import User from "../models/user.js";

// Store online users: userId -> socketId
// For scaling, use Redis. For single instance, this Map is fine.
const onlineUsers = new Map();

export const socketHandler = (io) => {
    return (socket) => {
        const user = socket.user;
        console.log(`User connected: ${user.id} (${user.userType})`);

        // 1. Add user to online map
        onlineUsers.set(user.id, socket.id);

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

                // Populate for client
                const populatedMsg = await Message.findById(newMessage._id)
                    .populate("replyTo", "text senderId")
                    .lean();

                // Add sender/receiver info manually or via another populate if User model supports it
                // For now, client usually has sender info (themselves). 
                // We'll append basic sender info just in case
                populatedMsg.sender = { id: user.id, userType: user.userType };

                // Emit to Receiver if online
                const receiverSocketId = onlineUsers.get(receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("receive_message", populatedMsg);
                }

                // Emit back to Sender (so they have the real DB ID and timestamp)
                // Or simply acknowledge with the data
                callback && callback({ success: true, data: populatedMsg });

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

                // Notify Receiver
                const receiverSocketId = onlineUsers.get(message.receiverId.toString());
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("message_updated", updatedMsg);
                }

                // Notify Sender (sync)
                socket.emit("message_updated", updatedMsg);

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

                // Notify Receiver
                const receiverSocketId = onlineUsers.get(message.receiverId.toString());
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("message_deleted", { messageId });
                }

                callback && callback({ success: true, messageId });

            } catch (error) {
                console.error("Socket delete_message error:", error);
                callback && callback({ success: false, error: "Server error" });
            }
        });

        // 5. Typing Indicators
        socket.on("typing", (data) => {
            const { receiverId } = data;
            const receiverSocketId = onlineUsers.get(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("user_typing", { userId: user.id });
            }
        });

        socket.on("stop_typing", (data) => {
            const { receiverId } = data;
            const receiverSocketId = onlineUsers.get(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("user_stop_typing", { userId: user.id });
            }
        });

        // 6. Disconnect
        socket.on("disconnect", () => {
            console.log(`User disconnected: ${user.id}`);
            onlineUsers.delete(user.id);
        });
    };
};
