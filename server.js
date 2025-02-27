const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const codeToSocketMap = {}; // 연결 코드 -> 소켓 ID 매핑

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("register-code", ({ code }) => {
    codeToSocketMap[code] = socket.id; // 연결 코드와 소켓 ID 저장
  });

  socket.on("join-with-code", ({ code }) => {
    const targetSocketId = codeToSocketMap[code]; // 상대 소켓 ID 가져오기
    if (targetSocketId) {
      socket.emit("connect-to-peer", { targetSocketId });
    }
  });

  // SDP Offer/Answer 전달
  socket.on("offer", (data) => {
    console.log("Offer received:", data);
    socket.broadcast.emit("offer", data);
  });

  socket.on("answer", (data) => {
    console.log("Answer received:", data);
    socket.broadcast.emit("answer", data);
  });

  // ICE Candidate 전달
  socket.on("ice-candidate", (candidate) => {
    console.log("ICE Candidate received:", candidate);
    socket.broadcast.emit("ice-candidate", candidate);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    // 배열에서 socket.id를 찾아 삭제
    const index = codeToSocketMap.findIndex((code) => code === socket.id);
    if (index !== -1) {
      codeToSocketMap.splice(index, 1); // 해당 index에서 1개 요소를 삭제
    }
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Signal server is running on port 3000");
});
