import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
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
                        auth: { token }, // Send token for middleware auth
                        transports: ["websocket", "polling"], // Try websocket first
                        reconnection: true,
                        reconnectionAttempts: 10,
                        reconnectionDelay: 1000,
                    });

                    newSocket.on("connect", () => {
                        console.log("Socket connected:", newSocket.id);
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
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
