const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// 클라이언트가 연결할 때마다 실행
io.on("connection", (socket) => {
  console.log("a user connected");

  // 메시지 받기
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  // 메시지 보내기
  socket.emit("message", "Hello from server!");

  // 클라이언트로부터 메시지 받기
  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
  });
});

// 서버가 실행될 포트 설정
server.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port " + (process.env.PORT || 3000));
});
