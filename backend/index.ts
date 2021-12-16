import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { Game } from "./common/models/game";

const rooms: Record<string, Game> = {};
const players: Record<string, string> = {};

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

io.on("connection", (socket) => {
  const ipAddress = socket.handshake.address;

  socket.on("roomID", (roomID: string) => {
    if (ipAddress in players && players[ipAddress] !== roomID) {
      const oldRoomID = players[ipAddress];
      const oldRoom = rooms[oldRoomID];
      oldRoom.players.delete(ipAddress);
    }

    if (!(roomID in rooms)) {
      rooms[roomID] = new Game(roomID, ipAddress);
    }

    const game = rooms[roomID];
    socket.join(roomID);
    game.players.add(ipAddress);
    players[ipAddress] = roomID;

    io.to(roomID).emit("gameState", game);
  });

  socket.on("gameState", (gameState) => {
    const roomID = players[ipAddress];
    rooms[roomID] = gameState;

    io.to(roomID).emit("gameState", gameState);
  });

  socket.on("disconnecting", () => {
    if (ipAddress in players) {
      const roomID = players[ipAddress];
      delete players[ipAddress];

      if (roomID in rooms) {
        const game = rooms[roomID];
        game.players.delete(ipAddress);

        if (game.players.size === 0) {
          delete rooms[roomID];
        } else if (game.hostID === ipAddress) {
          game.hostID = Array.from(game.players)[0];

          io.to(roomID).emit("gameState", game);
        }
      }
    }
  });
});

httpServer.listen(8080);
