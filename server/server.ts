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
  CardStack,
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
  // use each player's IP address as their player ID
  socket.data = new Player({
    playerID: socket.handshake.address,
    roomID: "",
  });
  const playerID = socket.data.playerID!;
  console.log(`player ${playerID} connected`);

  socket.on("JoinRequested", (roomID) => {
    console.log(`player ${playerID} tried to join room ${roomID}`);

    if (socket.data.roomID! in rooms && socket.data.roomID !== roomID) {
      handleLeaveRoom();
      socket.leave(socket.data.roomID!);
    }

    socket.data.roomID = roomID;
    socket.join(roomID);

    if (roomID in rooms) {
      rooms[roomID].players.add(playerID);
      io.to(roomID).emit("PlayerJoined", playerID);
      console.log(`player ${playerID} joined room ${roomID}`);
    } else {
      const args: GameInitArgs = { roomID, hostID: playerID };
      rooms[roomID] = new Game(args);
      console.log(`created new room ${roomID} with host ${playerID}`);
    }

    socket.emit("GameUpdated", JSON.stringify(rooms[roomID]));
  });

  socket.on("disconnecting", () => {
    handleLeaveRoom();
    console.log(`player ${playerID} disconnected`);
  });

  socket.on("CardCreated", (args) => {
    const roomID = socket.data.roomID!;
    const room = rooms[roomID];

    console.log(`in room ${roomID}:`);
    if (args.ID in room.cards) {
      const card = room.cards[args.ID];
      console.log(`card with ID ${card.ID} already exists: ${card.data.name}`);
    } else {
      const card = new Card(args);
      room.cards[card.ID] = card;
      io.to(roomID).emit("CardCreated", args);
      console.log(`created card ${card.data.name} with ID ${card.ID}`);
    }
  });

  socket.on("CardDeleted", (cardID) => {
    const roomID = socket.data.roomID!;
    const room = rooms[roomID];

    console.log(`in room ${roomID}:`);
    if (cardID in room.cards) {
      const cardName = room.cards[cardID].data.name;
      delete room.cards[cardID];
      io.to(roomID).emit("CardDeleted", cardID);
      console.log(`deleted card ${cardName} with ID ${cardID}`);
    } else {
      console.log(`cannot delete card with ID ${cardID}; does not exist`);
    }
  });

  socket.on("CardMoved", (cardID, x, y) => {
    const roomID = socket.data.roomID!;
    const room = rooms[roomID];

    console.log(`in room ${roomID}:`);
    if (cardID in room.cards) {
      const card = room.cards[cardID];
      const oldX = card.x;
      const oldY = card.y;
      card.x = x;
      card.y = y;
      io.to(roomID).emit("CardMoved", cardID, x, y);
      console.log(
        `card ${card.data.name} moved from [${oldX},${oldY}] to [${x}, ${y}]`
      );
    } else {
      console.log(`cannot move card with ID ${cardID}; does not exist`);
    }
  });

  socket.on("CardRotated", (cardID, rotation) => {
    const roomID = socket.data.roomID!;
    const room = rooms[roomID];

    console.log(`in room ${roomID}:`);
    if (cardID in room.cards) {
      const card = room.cards[cardID];
      const oldRotation = card.rotation;
      card.rotation = rotation;
      io.to(roomID).emit("CardRotated", cardID, rotation);
      console.log(
        `changed rotation of card ${card.data.name} from ${oldRotation} to ${rotation}`
      );
    } else {
      console.log(`cannot rotate card with ID ${cardID}; does not exist`);
    }
  });

  socket.on("CounterCreated", (args) => {
    const roomID = socket.data.roomID!;
    const room = rooms[roomID];

    console.log(`in room ${roomID}:`);
    if (args.ID in room.counters) {
      const counter = room.counters[args.ID];
      console.log(`counter with ID ${counter.ID} already exists`);
    } else {
      const counter = new Counter(args);
      room.counters[counter.ID] = counter;
      io.to(roomID).emit("CounterCreated", args);
      console.log(`created counter with ID ${counter.ID}`);
    }
  });

  socket.on("CounterDeleted", (counterID) => {
    const roomID = socket.data.roomID!;
    const room = rooms[roomID];

    console.log(`in room ${roomID}:`);
    if (counterID in room.counters) {
      delete room.counters[counterID];
      io.to(roomID).emit("CounterDeleted", counterID);
      console.log(`deleted counter ${counterID}`);
    } else {
      console.log(`cannot delete counter ${counterID}; does not exist`);
    }
  });

  socket.on("CounterValsChanged", (counterID, vals) => {
    const roomID = socket.data.roomID!;
    const room = rooms[roomID];

    console.log(`in room ${roomID}:`);
    if (counterID in room.counters) {
      const counter = room.counters[counterID];
      const oldVals = counter.vals;
      counter.vals = vals;
      io.to(roomID).emit("CounterValsChanged", counterID, vals);
      console.log(
        `changed vals of counter ${counterID} from [${oldVals}] to [${vals}]`
      );
    } else {
      console.log(`cannot change vals of counter ${counterID}; does not exist`);
    }
  });

  socket.on("CounterMoved", (counterID, x, y) => {
    const roomID = socket.data.roomID!;
    const room = rooms[roomID];

    console.log(`in room ${roomID}:`);
    if (counterID in room.counters) {
      const counter = room.counters[counterID];
      const oldX = counter.x;
      const oldY = counter.y;
      counter.x = x;
      counter.y = y;
      io.to(roomID).emit("CounterMoved", counterID, x, y);
      console.log(
        `counter ${counterID} moved from [${oldX}, ${oldY}] to [${x}, ${y}]`
      );
    } else {
      console.log(`cannot move counter ${counterID}; does not exist`);
    }
  });

  socket.on("CounterRotated", (counterID, rotation) => {
    const roomID = socket.data.roomID!;
    const room = rooms[roomID];

    console.log(`in room ${roomID}:`);
    if (counterID in room.counters) {
      const counter = room.counters[counterID];
      const oldRotation = counter.rotation;
      counter.rotation = rotation;
      io.to(roomID).emit("CounterRotated", counterID, rotation);
      console.log(
        `changed rotation of counter ${counterID} from ${oldRotation} to ${rotation}`
      );
    } else {
      console.log(`cannot rotate counter with ID ${counterID}; does not exist`);
    }
  });

  socket.on("CardStackCreated", (args) => {
    const roomID = socket.data.roomID!;
    const room = rooms[roomID];

    console.log(`in room ${roomID}:`);
    if (args.ID in room.cardStacks) {
      const cardStack = room.cardStacks[args.ID];
      console.log(`cardStack with ID ${cardStack.ID} already exists`);
    } else {
      const cardStack = new CardStack(args);
      room.cardStacks[cardStack.ID] = cardStack;
      io.to(roomID).emit("CardStackCreated", args);
      console.log(`created cardStack with ID ${cardStack.ID}`);
    }
  });

  socket.on("CardStackDeleted", (cardStackID) => {
    const roomID = socket.data.roomID!;
    const room = rooms[roomID];

    console.log(`in room ${roomID}:`);
    if (cardStackID in room.cardStacks) {
      delete room.cardStacks[cardStackID];
      io.to(roomID).emit("CardStackDeleted", cardStackID);
      console.log(`deleted cardStack ${cardStackID}`);
    } else {
      console.log(`cannot delete cardStack ${cardStackID}; does not exist`);
    }
  });

  socket.on("CardStackShuffled", (cardStackID, cards) => {
    const roomID = socket.data.roomID!;
    const room = rooms[roomID];

    console.log(`in room ${roomID}:`);
    if (cardStackID in room.cardStacks) {
      const cardStack = room.cardStacks[cardStackID];
      cardStack.cards = cards;
      io.to(roomID).emit("CardStackShuffled", cardStackID, cards);
      console.log(`shuffled cardStack ${cardStackID}`);
    } else {
      console.log(`cannot shuffle cardStack ${cardStackID}; does not exist`);
    }
  });

  socket.on("CardStackModified", (cardStackID, cards) => {
    const roomID = socket.data.roomID!;
    const room = rooms[roomID];

    console.log(`in room ${roomID}:`);
    if (cardStackID in room.cardStacks) {
      const cardStack = room.cardStacks[cardStackID];
      cardStack.cards = cards;
      io.to(roomID).emit("CardStackModified", cardStackID, cards);
      console.log(`modified cardStack ${cardStackID}`);
    } else {
      console.log(`cannot modify cardStack ${cardStackID}; does not exist`);
    }
  });

  socket.on("CardStackMoved", (cardStackID, x, y) => {
    const roomID = socket.data.roomID!;
    const room = rooms[roomID];

    console.log(`in room ${roomID}:`);
    if (cardStackID in room.cardStacks) {
      const cardStack = room.cardStacks[cardStackID];
      const oldX = cardStack.x;
      const oldY = cardStack.y;
      cardStack.x = x;
      cardStack.y = y;
      io.to(roomID).emit("CardStackMoved", cardStackID, x, y);
      console.log(
        `cardStack ${cardStackID} moved from [${oldX}, ${oldY}] to [${x}, ${y}]`
      );
    } else {
      console.log(`cannot move cardStack ${cardStackID}; does not exist`);
    }
  });

  socket.on("CardStackRotated", (cardStackID, rotation) => {
    const roomID = socket.data.roomID!;
    const room = rooms[roomID];

    console.log(`in room ${roomID}:`);
    if (cardStackID in room.cardStacks) {
      const cardStack = room.cardStacks[cardStackID];
      const oldRotation = cardStack.rotation;
      cardStack.rotation = rotation;
      io.to(roomID).emit("CardStackRotated", cardStackID, rotation);
      console.log(
        `changed rotation of cardStack ${cardStackID} from ${oldRotation} to ${rotation}`
      );
    } else {
      console.log(
        `cannot rotate cardStack with ID ${cardStackID}; does not exist`
      );
    }
  });

  const handleLeaveRoom = () => {
    const roomID = socket.data.roomID!;

    if (!(roomID in rooms)) {
      return;
    }

    const room = rooms[roomID];
    room.players.delete(playerID);
    const title = room.hostID === playerID ? "host" : "player";
    console.log(`${title} ${playerID} left room ${roomID}`);

    if (room.players.size === 0) {
      delete rooms[roomID];
      io.in(roomID).disconnectSockets(true);
      console.log(`closed empty room ${roomID}`);
    } else if (room.hostID === playerID) {
      io.to(roomID).emit("PlayerLeft", playerID);

      room.hostID = Array.from(room.players)[0];
      io.to(roomID).emit("HostChanged", room.hostID);
      console.log(`reassigned host to player ${room.hostID}`);
    }
  };
});
