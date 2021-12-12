import express from "express";
import bodyParser from "body-parser";
import { Server } from "socket.io";
import { Game } from "./models/game";
import { createServer } from "http";

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(bodyParser.json());

const sessions: Record<string, Game> = {};

type ReqQuery = { id: string };
type ReqBody = {
  meme: boolean;
};

app.get("/session", (req, res) => {
  const { id } = req.query as ReqQuery;
  if (!(id in sessions)) {
    sessions[id] = {
      meme: false,
    };
  }
  res.send(sessions[id]);
  console.log(sessions);
});

app.post("/session", (req, res) => {
  const { id } = req.query as ReqQuery;
  const { meme } = req.body as ReqBody;
  if (id in sessions) {
    sessions[id].meme = meme;
    res.send(true);
  } else {
    res.send(false);
  }
  console.log(sessions);
});

io.on("connection", (socket) => {
  console.log("bepis");

  socket.on("message", (event) => {
    console.log(event);
    io.emit("message", `user ${socket.id} ${event}`);
  });
});

server.listen(8080);
