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
        // Get token from local storage
        const authData = localStorage.getItem("auth");

        if (authData) {
            try {
                const parsedAuth = JSON.parse(authData);
                const token = parsedAuth.accessToken;

                if (token) {
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
                    });

                    setSocket(newSocket);

                    return () => {
                        console.log("Closing socket connection...");
                        newSocket.close();
                    };
                }
            } catch (error) {
                console.error("Error parsing auth for socket:", error);
            }
        }
    }, [BASE_URL]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};
