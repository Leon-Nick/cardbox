import express from "express";
import bodyParser from "body-parser";
import { Game } from "./models/game";

const server = express();

server.use(bodyParser.json());

const sessions: Record<string, Game> = {};

type ReqQuery = { id: string };
type ReqBody = {
  meme: boolean;
};

server.get("/session", (req, res) => {
  const { id } = req.query as ReqQuery;
  if (!(id in sessions)) {
    sessions[id] = {
      meme: false,
    };
  }
  res.send(sessions[id]);
  console.log(sessions);
});

server.post("/session", (req, res) => {
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

server.listen(5000);
