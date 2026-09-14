import { getSocket } from "../socket.js";

export function initChatSocket() {
    const socket = getSocket();

    socket.on("message", (data) => {
        if (!data) {
            console.log("Recived empty data!");
            return;
        }
        const sender = data.sender;
        const message = data.message;

        console.log(`${sender}: ${message}`);
        // Implement chat message creation
    });
    socket.on("connected", (data) => {
        // Connected with user
    });
    socket.on("left", (data) => {
        // User left the chat
    });

    const start = () => {
        socket.emit("start");
        console.log("Started chat successfully");
    }
    const send = (message) => {
        socket.emit("message", { message });
        console.log("Message sended successfully");
    }
    const leave = () => {
        socket.emit("leave");
        console.log("Left the chat successfully");
    }

    return { start, send, leave };
}