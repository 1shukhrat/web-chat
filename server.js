require('dotenv').config();
const express = require("express");
const app = express();
const db = require("./db");
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
const io = require("socket.io")(server, {
  cors: {
    origin: '*'
  }
});
db.sequelize.authenticate().then(() => {
  const models = require("./models/models");
});
const router = require("./routes/mainRouter");


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api', router);
app.use('/admin', express.static('public/admin.html'))
app.use('/main', express.static('public/main.html'))
app.use('/login', express.static('public/login.html'))
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

server.listen(process.env.SERVER_PORT || 3030);

process.on("SIGINT", () => {
  db.Mongoose.disconnect();
  db.sequelize.close();
  process.exit();
})
