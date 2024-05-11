const express = require("express");
const app = express();
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
const io = require("socket.io")(server, {
  cors: {
    origin: '*'
  }
});

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect(`/new?room=${uuidv4()}`);
});

app.get("/new", (req, res) => {
  if (req.query.room) {
    res.sendFile(__dirname + "/public/room.html");
  } else {
    res.redirect("/");
  }
  
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId, userName) => {
    socket.join(roomId);
    setTimeout(()=>{
      socket.broadcast.to(roomId).emit("user-connected", userId);
    }, 1000)
    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message, userName);
    });
  });
});

server.listen(process.env.PORT || 3030);
