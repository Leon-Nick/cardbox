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
  console.log(`${ipAddress} connected`);

  socket.on("roomID", (roomID: string) => {
    console.log(`${ipAddress} tried to join room ${roomID}`);
    if (ipAddress in players && players[ipAddress] !== roomID) {
      const oldRoomID = players[ipAddress];
      const oldRoom = rooms[oldRoomID];
      oldRoom.players.delete(ipAddress);
      console.log(`${ipAddress} removed from room ${oldRoomID}`);
    }

    if (!(roomID in rooms)) {
      rooms[roomID] = new Game(roomID, ipAddress);
      console.log(`room ${roomID} did not exist; created new room.`);
      console.log(`${ipAddress} set as 'host' of room ${roomID}`);
    }

    players[ipAddress] = roomID;
    const gameState = rooms[roomID];
    gameState.players.add(ipAddress);
    socket.join(roomID);
    console.log(`${ipAddress} added to room ${roomID}`);

    io.to(roomID).emit("gameState", gameState);
    console.log(`sent game state update to room ${roomID}`);
    console.log(`updated game state: ${gameState}`);
  });

  socket.on("gameState", (gameState) => {
    const roomID = players[ipAddress];
    rooms[roomID] = gameState;
    console.log(`received game state update from ${ipAddress}`);

    io.to(roomID).emit("gameState", gameState);
    console.log(`sent game state update to room ${roomID}`);
    console.log(`updated game state: ${gameState}`);
  });

  socket.on("disconnecting", () => {
    console.log(`${ipAddress} disconnected`);
    if (ipAddress in players) {
      const roomID = players[ipAddress];
      delete players[ipAddress];
      console.log(`${ipAddress} removed from global player list`);

      if (roomID in rooms) {
        const gameState = rooms[roomID];
        gameState.players.delete(ipAddress);
        console.log(`${ipAddress} removed from room ${roomID}`);

        if (gameState.players.size === 0) {
          delete rooms[roomID];
          io.in(roomID).disconnectSockets(true);
          console.log(`closed empty room ${roomID}`);
        } else if (gameState.hostID === ipAddress) {
          gameState.hostID = Array.from(gameState.players)[0];
          console.log(`${ipAddress} was host; new host is ${gameState.hostID}`);

          io.to(roomID).emit("gameState", gameState);
          console.log(`sent game state update to room ${roomID}`);
          console.log(`updated game state: ${gameState}`);
        }
      }
    }
  });
});

httpServer.listen(8080);
