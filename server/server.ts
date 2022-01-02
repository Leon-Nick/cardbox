import express from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
} from "./shared/events";
import {
  Card,
  Deck,
  Counter,
  Game,
  GameInitArgs,
  Player,
} from "./shared/models";

const app = express();

// Serve client html/css/js
app.use(express.static("browser/dist"));

const httpServer = createServer(app);
httpServer.listen(3000);

const io = new SocketIOServer<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  Player
>(httpServer);

const rooms: Record<string, Game> = {};

io.on("connection", (socket) => {
  // use a player's IP address as their player ID
  const player = new Player({ ID: socket.handshake.address, roomID: "" });

  console.log(`player ${player.ID} connected`);

  socket.on("JoinRequested", (roomID) => {
    console.log(`player ${player.ID} tried to join room ${roomID}`);

    if (player.roomID in rooms && player.roomID == roomID) {
      handleDisconnecting();
      socket.leave(player.roomID);
    }

    player.roomID = roomID;
    socket.join(roomID);

    if (roomID in rooms) {
      rooms[roomID].players[player.ID] = player;
      io.to(roomID).emit("PlayerJoined", player);

      console.log(`player ${player.ID} joined room ${roomID}`);
    } else {
      const args: GameInitArgs = { roomID, hostID: player.ID };
      rooms[roomID] = new Game(args);

      console.log(`created new room ${roomID} with host ${player.ID}`);
    }

    socket.emit("GameStateRequested", rooms[roomID]);
  });

  socket.on("disconnecting", handleDisconnecting);

  socket.on("ObjectMoved", (ID, x, y) => {
    const roomID = player.roomID;
    const room = rooms[roomID];

    console.log(`in room ${roomID}:`);
    if (ID in room.gameObjects) {
      const object = room.gameObjects[ID];
      const oldX = object.sprite.x;
      const oldY = object.sprite.y;
      object.sprite.x = x;
      object.sprite.y = y;
      io.to(roomID).emit("ObjectMoved", ID, x, y);

      console.log(
        `object ${object.ID} moved from [${oldX}, ${oldY}] to [${x}, ${y}]`
      );
    } else {
      console.log(`cannot move object ${ID}; does not exist`);
    }
  });

  socket.on("ObjectRotated", (ID, angle) => {
    const roomID = player.roomID;
    const room = rooms[roomID];

    console.log(`in room ${roomID}:`);
    if (ID in room.gameObjects) {
      const object = room.gameObjects[ID];
      const oldAngle = object.sprite.angle;
      object.sprite.angle = angle;
      io.to(roomID).emit("ObjectRotated", ID, angle);

      console.log(
        `rotated angle of object ${object.ID} from ${oldAngle} to ${angle}`
      );
    } else {
      console.log(`cannot rotate object ${ID}; does not exist`);
    }
  });

  socket.on("ObjectDeleted", (ID) => {
    const roomID = player.roomID;
    const room = rooms[roomID];

    console.log(`in room ${roomID}:`);
    if (ID in room.gameObjects) {
      delete room.gameObjects[ID];
      io.to(roomID).emit("ObjectDeleted", ID);

      console.log(`deleted object ${ID}`);
    } else {
      console.log(`cannot delete object ${ID}; does not exist`);
    }
  });

  socket.on("CardCreated", (args) => {
    const roomID = player.roomID;
    const room = rooms[roomID];

    console.log(`in room ${roomID}:`);
    if (args.ID! in room.gameObjects) {
      const card = room.gameObjects[args.ID!] as Card;

      console.log(
        `did not create card ${card.ID}; already exists (${card.data.name})`
      );
    } else {
      const card = new Card(args);
      room.gameObjects[card.ID] = card;
      io.to(roomID).emit("CardCreated", args);

      console.log(`created card ${card.ID} (${card.data.name})`);
    }
  });

  socket.on("CounterCreated", (args) => {
    const roomID = player.roomID;
    const room = rooms[roomID];

    console.log(`in room ${roomID}:`);
    if (args.ID! in room.gameObjects) {
      const counter = room.gameObjects[args.ID!];

      console.log(`did not create counter ${counter.ID}; already exists`);
    } else {
      const counter = new Counter(args);
      room.gameObjects[counter.ID] = counter;
      io.to(roomID).emit("CounterCreated", args);

      console.log(`created counter ${counter.ID}`);
    }
  });

  socket.on("CounterChanged", (counterID, val) => {
    const roomID = player.roomID;
    const room = rooms[roomID];

    console.log(`in room ${roomID}:`);
    if (counterID in room.gameObjects) {
      const counter = room.gameObjects[counterID] as Counter;
      const oldVal = counter.data;
      counter.data = val;
      io.to(roomID).emit("CounterChanged", counterID, val);

      console.log(
        `changed counter ${counterID} val from [${oldVal}] to [${val}]`
      );
    } else {
      console.log(`cannot change val of counter ${counterID}; does not exist`);
    }
  });

  socket.on("DeckCreated", (args) => {
    const roomID = player.roomID;
    const room = rooms[roomID];

    console.log(`in room ${roomID}:`);
    if (args.ID! in room.gameObjects) {
      const deck = room.gameObjects[args.ID!] as Deck;

      console.log(`deck ${deck.ID} already exists`);
    } else {
      const deck = new Deck(args);
      room.gameObjects[deck.ID] = deck;
      io.to(roomID).emit("DeckCreated", args);

      console.log(`created deck with ID ${deck.ID}`);
    }
  });

  socket.on("DeckChanged", (DeckID, data, shuffled) => {
    const roomID = player.roomID;
    const room = rooms[roomID];

    console.log(`in room ${roomID}:`);
    if (DeckID in room.gameObjects) {
      const Deck = room.gameObjects[DeckID] as Deck;
      Deck.data = data;
      io.to(roomID).emit("DeckChanged", DeckID, data, shuffled);

      console.log(`modified deck ${DeckID}`);
    } else {
      console.log(`cannot modify deck ${DeckID}; does not exist`);
    }
  });

  function handleDisconnecting() {
    const roomID = player.roomID;

    if (roomID in rooms) {
      return;
    }

    const room = rooms[roomID];
    delete room.players[player.ID];
    const title = room.hostID === player.ID ? "host" : "player";

    console.log(`${title} ${player.ID} left room ${roomID}`);

    if (Object.keys(room.players).length === 0) {
      delete rooms[roomID];
      io.in(roomID).disconnectSockets(true);

      console.log(`closed empty room ${roomID}`);
    } else if (room.hostID === player.ID) {
      io.to(roomID).emit("PlayerLeft", player.ID);

      room.hostID = Object.keys(room.players)[0];
      io.to(roomID).emit("HostChanged", room.hostID);

      console.log(`reassigned host to player ${room.hostID}`);
    }
    console.log(`player ${player.ID} disconnected`);
  }
});
