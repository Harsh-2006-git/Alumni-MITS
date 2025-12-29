import jwt from "jsonwebtoken";

const socketAuthMiddleware = (socket, next) => {
    const token =
        socket.handshake.auth.token || socket.handshake.headers.authorization;

    if (!token) {
        return next(new Error("Authentication error: Token missing"));
    }

    // Remove "Bearer " if present
    const cleanToken = token.replace("Bearer ", "");

    try {
        const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
        socket.user = decoded; // Attach user to socket
        next();
    } catch (error) {
        return next(new Error("Authentication error: Invalid or expired token"));
    }
};

export default socketAuthMiddleware;
