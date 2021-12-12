import express from "express";
import { Game } from "./models/game";

const server = express();

const sessions: Record<string, Game> = {};

server.get("/games/:id", (req, res) => {
  const { id } = req.params;
  if (!(id in sessions)) {
    sessions[id] = {
      meme: false,
    };
  }
  res.send(sessions[id]);
});

server.listen(5000);
