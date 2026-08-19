"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function SocketTest() {
  const [socket, setSocket] = useState(null);
  const [room, setRoom] = useState("");
  const [joinedRoom, setJoinedRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("user") || "unknown";

    const newSocket = io("http://localhost:3001", {
      auth: {
        userId,
      },
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected:", newSocket.id);
    });

    newSocket.on("message", ({ message, sender }) => {
      setMessages((previous) => [
        ...previous,
        {
          message,
          sender,
        },
      ]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  function joinRoom() {
    if (!room.trim() || !socket) return;

    socket.emit("join-room", room);
    setJoinedRoom(room);
    setMessages([]);
  }

  function sendMessage() {
    if (!message.trim() || !joinedRoom || !socket) return;

    socket.emit("send-message", {
      room: joinedRoom,
      message,
    });

    setMessage("");
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>
      <h1>Socket.IO Chat</h1>

      <p>
        Connected Socket: <strong>{socket?.id || "Connecting..."}</strong>
      </p>

      <p>
        Current Room: <strong>{joinedRoom || "Not joined"}</strong>
      </p>

      <input
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        placeholder="Enter room e.g. hr"
      />

      <button onClick={joinRoom}>Join Room</button>

      <hr />

      <div
        style={{
          border: "1px solid #ccc",
          minHeight: "200px",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          messages.map((item, index) => (
            <p key={index}>
              <strong>{item.sender}:</strong> {item.message}
            </p>
          ))
        )}
      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message..."
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
