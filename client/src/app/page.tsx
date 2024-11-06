"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket = io("http://localhost:4000", {
    withCredentials: true,
})

export default function Page() {

    return (
        
    );
}
