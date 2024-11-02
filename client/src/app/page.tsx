"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Socket } from "socket.io-client";

let socket: Socket;

export default function Page() {
    const [message, setMessage] = useState("");
    const [broadMsg, setBroadMsg] = useState(""); 

    const handleClick = () => {
        if (socket) {
            socket.emit("message", message); 
        }
    };

    useEffect(() => {
        socket = io("http://localhost:4000", {
            withCredentials: true,
        })

        socket.on("broadcastMsg", (data: string) => {
            setBroadMsg(data); 
        })
    });

    return (
        <div>
            <input
                type="text"
                value={message}
                onChange={(e) => {
                    setMessage(e.target.value);
                }}
                className="p-5"
            />
            <button type="submit" onClick={handleClick}>send</button>

            <p>{broadMsg}</p>
        </div>
    );
}
