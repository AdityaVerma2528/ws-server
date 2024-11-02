// index.ts
import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", 
        methods: ["GET", "POST"],
        credentials: true,
    },
});

app.get("/", (req: Request, res: Response) => {
    res.send("WebSocket server is running");
});

io.on("connection", (socket) => {
    console.log("The new user is connected", socket.id); 

    socket.on("message", (data: string) => {
        console.log(data); 
        io.emit("broadcastMsg", data); 
    })

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id); 
    })
})

const PORT = 4000;

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
