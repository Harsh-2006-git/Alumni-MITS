import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

    useEffect(() => {
        const initializeSocket = () => {
            // Get token from local storage
            const authData = localStorage.getItem("auth");

            if (authData) {
                try {
                    const parsedAuth = JSON.parse(authData);
                    const token = parsedAuth.accessToken;

                    if (token) {
                        // Avoid reconnecting if token hasn't changed (basic check)
                        if (socket && socket.auth.token === token && socket.connected) return;

                        if (socket) socket.close();

                        console.log("Initializing Socket.IO connection...");

                        const newSocket = io(BASE_URL, {
                            auth: { token },
                            transports: ["websocket", "polling"],
                            reconnection: true,
                            reconnectionAttempts: 10,
                            reconnectionDelay: 1000,
                        });

                        newSocket.on("connect", () => {
                            console.log("Socket connected:", newSocket.id);
                        });

                        newSocket.on("online_users", (users) => {
                            console.log("Initial online users:", users);
                            setOnlineUsers(users);
                        });

                        newSocket.on("user_online", ({ userId }) => {
                            console.log("User online:", userId);
                            setOnlineUsers((prev) => [...new Set([...prev, userId])]);
                        });

                        newSocket.on("user_offline", ({ userId }) => {
                            console.log("User offline:", userId);
                            setOnlineUsers((prev) => prev.filter((id) => id !== userId));
                        });

                        newSocket.on("connect_error", (err) => {
                            console.error("Socket connect error:", err.message);
                            // Prevent infinite retries on auth failure
                            if (err.message.includes("Authentication error") || err.message.includes("Invalid")) {
                                newSocket.close();
                            }
                        });

                        setSocket(newSocket);
                    }
                } catch (error) {
                    console.error("Error parsing auth for socket:", error);
                }
            } else {
                // No auth data, close socket if open
                if (socket) {
                    console.log("No auth token found, closing socket...");
                    socket.close();
                    setSocket(null);
                }
            }
        };

        initializeSocket();

        const handleAuthChange = () => {
            console.log("Auth changed, re-initializing socket...");
            initializeSocket();
        };

        window.addEventListener("auth-change", handleAuthChange);
        window.addEventListener("storage", handleAuthChange);

        return () => {
            window.removeEventListener("auth-change", handleAuthChange);
            window.removeEventListener("storage", handleAuthChange);
            if (socket) {
                console.log("Closing socket connection...");
                socket.close();
            }
        };
    }, [BASE_URL]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};
