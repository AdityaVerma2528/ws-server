
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

interface Rooms {
    [roomId: string]: string[];
}

const rooms: Rooms = {}; 

io.on("connection", (socket) => {
    // Creates room
    socket.on("createRoom", (roomId: string) => {
        if (!rooms[roomId]) {
            rooms[roomId] = []; 
            rooms[roomId].push(socket.id); 
            socket.join(roomId);
            console.log("user created room : ", roomId); 
        } else {
            socket.emit("error", `Room ${roomId} already exists`);
        }
    });

    // Joins in the existing room
    socket.on("joinRoom", (roomId: string) => {
        if (rooms[roomId]) {
            rooms[roomId].push(socket.id);
            socket.join(roomId);
            console.log("user joined room : ", roomId);
        } else {
            socket.emit("error", `Room ${roomId} does not exist`);
        }
    });

    // Disconnects the users from the room
    socket.on("disconnect", (reason: string) => {
        for(const roomId in rooms) {
            const index: number = rooms[roomId].indexOf(socket.id); 
            if (index !== -1) {
                rooms[roomId].splice(index, 1);
                if (rooms[roomId].length === 0) {
                    delete rooms[roomId]; 
                }

                console.log("User left the room"); 
                break;
            }
        }
    });
});

const PORT = 4000;

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
