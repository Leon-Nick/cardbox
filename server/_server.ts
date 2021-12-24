import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
// common
import { EventNames } from "./shared/events";
import {
  Card,
  CardInitArgs,
  CardStack,
  CardStackInitArgs,
  Counter,
  CounterInitArgs,
  Game,
  GameInitArgs,
  gameStr,
  ScryfallData,
} from "./shared/models";

// map of each room ID to its respective game session
const rooms: Record<string, Game> = {};

// map of each player's IP address to their respective game session
const players: Record<string, string> = {};

const app = express();
app.use(express.static("browser/dist"));

const httpServer = createServer(app);
httpServer.listen(3000);

const io = new Server(httpServer);

io.on(EventNames.Connection, (socket: Socket) => {
  // use this client's IP address as their identifier
  const ipAddress = socket.handshake.address;
  console.log(`player ${ipAddress} connected`);

  // Out-Of-Game and Socket.io Events

  socket.on(EventNames.Disconnecting, () => {
    console.log(`${ipAddress} disconnected`);
    if (ipAddress in players) {
      const roomID = players[ipAddress];
      delete players[ipAddress];
      console.log(`player ${ipAddress} removed from global player list`);

      if (roomID in rooms) {
        const gameState = rooms[roomID];
        gameState.players.delete(ipAddress);
        console.log(`player ${ipAddress} removed from room ${roomID}`);

        if (gameState.players.size === 0) {
          delete rooms[roomID];
          io.in(roomID).disconnectSockets(true);
          console.log(`closed empty room ${roomID}`);
        } else if (gameState.hostID === ipAddress) {
          gameState.hostID = Array.from(gameState.players)[0];
          console.log(
            ` player ${ipAddress} was host; new host is ${gameState.hostID}`
          );

          io.to(roomID).emit(EventNames.PlayerLeft, ipAddress);
          console.log(`told room ${roomID} that player ${ipAddress} left`);
          console.log(`current game state: `, gameStr(gameState));
        }
      }
    }
  });

  socket.on(EventNames.PlayerJoined, (roomID: string) => {
    console.log(`player ${ipAddress} tried to join room ${roomID}`);

    if (ipAddress in players && players[ipAddress] !== roomID) {
      const oldRoomID = players[ipAddress];
      const oldRoom = rooms[oldRoomID];
      oldRoom.players.delete(ipAddress);
      socket.leave(oldRoomID);
      console.log(`player ${ipAddress} removed from room ${oldRoomID}`);
    }

    players[ipAddress] = roomID;
    socket.join(roomID);

    if (roomID in rooms) {
      rooms[roomID].players.add(ipAddress);
      io.to(roomID).emit(EventNames.PlayerJoined, ipAddress);

      console.log(`player ${ipAddress} joined room ${roomID}`);
    } else {
      const args: GameInitArgs = { roomID, hostID: ipAddress };
      rooms[roomID] = new Game(args);
      io.to(roomID).emit(EventNames.RoomCreated, args);

      console.log(
        `created new room ${roomID} with player ${ipAddress} as host`
      );
    }
    console.log(`current game state: `, gameStr(rooms[roomID]));
  });

  // In-Game Events: Card

  socket.on(EventNames.CardCreated, (args: CardInitArgs) => {
    const roomID = players[ipAddress];
    const room = rooms[roomID];

    console.log(`in room ${roomID}:`);
    if (args.ID in room.cards) {
      const card = room.cards[args.ID];
      console.log(`card with ID ${card.ID} already exists: ${card.data.name}`);
    } else {
      const card = new Card(args);
      room.cards[card.ID] = card;
      io.to(roomID).emit(EventNames.CardCreated, args);
      console.log(`created card ${card.data.name} with ID ${card.ID}`);
    }
  });

  socket.on(EventNames.CardDeleted, (cardID: string) => {
    const roomID = players[ipAddress];
    const room = rooms[roomID];

    console.log(`in room ${roomID}:`);
    if (cardID in room.cards) {
      const cardName = room.cards[cardID].data.name;
      delete room.cards[cardID];
      io.to(roomID).emit(EventNames.CardDeleted, cardID);
      console.log(`deleted card ${cardName} with ID ${cardID}`);
    } else {
      console.log(`cannot delete card with ID ${cardID}; does not exist`);
    }
  });

  socket.on(EventNames.CardMoved, (cardID: string, x: number, y: number) => {
    const roomID = players[ipAddress];
    const room = rooms[roomID];

    console.log(`in room ${roomID}:`);
    if (cardID in room.cards) {
      const card = room.cards[cardID];
      const oldX = card.x;
      const oldY = card.y;
      card.x = x;
      card.y = y;
      io.to(roomID).emit(EventNames.CardMoved, cardID, x, y);
      console.log(
        `card ${card.data.name} moved from [${oldX},${oldY}] to [${x}, ${y}]`
      );
    } else {
      console.log(`cannot move card with ID ${cardID}; does not exist`);
    }
  });

  socket.on(EventNames.CardRotated, (cardID: string, rotation: number) => {
    const roomID = players[ipAddress];
    const room = rooms[roomID];

    console.log(`in room ${roomID}:`);
    if (cardID in room.cards) {
      const card = room.cards[cardID];
      const oldRotation = card.rotation;
      card.rotation = rotation;
      io.to(roomID).emit(EventNames.CardRotated, cardID, rotation);
      console.log(
        `changed rotation of card ${card.data.name} from ${oldRotation} to ${rotation}`
      );
    } else {
      console.log(`cannot rotate card with ID ${cardID}; does not exist`);
    }
  });

  // In-Game Events: Counter

  socket.on(EventNames.CounterCreated, (args: CounterInitArgs) => {
    const roomID = players[ipAddress];
    const room = rooms[roomID];

    console.log(`in room ${roomID}:`);
    if (args.ID in room.counters) {
      const counter = room.counters[args.ID];
      console.log(`counter with ID ${counter.ID} already exists`);
    } else {
      const counter = new Counter(args);
      room.counters[counter.ID] = counter;
      io.to(roomID).emit(EventNames.CounterCreated, args);
      console.log(`created counter with ID ${counter.ID}`);
    }
  });

  socket.on(EventNames.CounterDeleted, (counterID: string) => {
    const roomID = players[ipAddress];
    const room = rooms[roomID];

    console.log(`in room ${roomID}:`);
    if (counterID in room.counters) {
      delete room.counters[counterID];
      io.to(roomID).emit(EventNames.CounterDeleted, counterID);
      console.log(`deleted counter ${counterID}`);
    } else {
      console.log(`cannot delete counter ${counterID}; does not exist`);
    }
  });

  socket.on(
    EventNames.CounterValsChanged,
    (counterID: string, vals: number[]) => {
      const roomID = players[ipAddress];
      const room = rooms[roomID];

      console.log(`in room ${roomID}:`);
      if (counterID in room.counters) {
        const counter = room.counters[counterID];
        const oldVals = counter.vals;
        counter.vals = vals;
        io.to(roomID).emit(EventNames.CounterValsChanged, counterID, vals);
        console.log(
          `changed vals of counter ${counterID} from [${oldVals}] to [${vals}]`
        );
      } else {
        console.log(
          `cannot change vals of counter ${counterID}; does not exist`
        );
      }
    }
  );

  socket.on(
    EventNames.CounterMoved,
    (counterID: string, x: number, y: number) => {
      const roomID = players[ipAddress];
      const room = rooms[roomID];

      console.log(`in room ${roomID}:`);
      if (counterID in room.counters) {
        const counter = room.counters[counterID];
        const oldX = counter.x;
        const oldY = counter.y;
        counter.x = x;
        counter.y = y;
        io.to(roomID).emit(EventNames.CounterMoved, counterID, x, y);
        console.log(
          `counter ${counterID} moved from [${oldX}, ${oldY}] to [${x}, ${y}]`
        );
      } else {
        console.log(`cannot move counter ${counterID}; does not exist`);
      }
    }
  );

  socket.on(
    EventNames.CounterRotated,
    (counterID: string, rotation: number) => {
      const roomID = players[ipAddress];
      const room = rooms[roomID];

      console.log(`in room ${roomID}:`);
      if (counterID in room.counters) {
        const counter = room.counters[counterID];
        const oldRotation = counter.rotation;
        counter.rotation = rotation;
        io.to(roomID).emit(EventNames.CounterRotated, counterID, rotation);
        console.log(
          `changed rotation of counter ${counterID} from ${oldRotation} to ${rotation}`
        );
      } else {
        console.log(
          `cannot rotate counter with ID ${counterID}; does not exist`
        );
      }
    }
  );

  // In-Game Events: CardStack

  socket.on(EventNames.CardStackCreated, (args: CardStackInitArgs) => {
    const roomID = players[ipAddress];
    const room = rooms[roomID];

    console.log(`in room ${roomID}:`);
    if (args.ID in room.cardStacks) {
      const cardStack = room.cardStacks[args.ID];
      console.log(`cardStack with ID ${cardStack.ID} already exists`);
    } else {
      const cardStack = new CardStack(args);
      room.cardStacks[cardStack.ID] = cardStack;
      io.to(roomID).emit(EventNames.CardStackCreated, args);
      console.log(`created cardStack with ID ${cardStack.ID}`);
    }
  });

  socket.on(EventNames.CardStackDeleted, (cardStackID: string) => {
    const roomID = players[ipAddress];
    const room = rooms[roomID];

    console.log(`in room ${roomID}:`);
    if (cardStackID in room.cardStacks) {
      delete room.cardStacks[cardStackID];
      io.to(roomID).emit(EventNames.CardStackDeleted, cardStackID);
      console.log(`deleted cardStack ${cardStackID}`);
    } else {
      console.log(`cannot delete cardStack ${cardStackID}; does not exist`);
    }
  });

  socket.on(
    EventNames.CardStackShuffled,
    (cardStackID: string, cards: ScryfallData[]) => {
      const roomID = players[ipAddress];
      const room = rooms[roomID];

      console.log(`in room ${roomID}:`);
      if (cardStackID in room.cardStacks) {
        const cardStack = room.cardStacks[cardStackID];
        cardStack.cards = cards;
        io.to(roomID).emit(EventNames.CardStackShuffled);
        console.log(`shuffled cardStack ${cardStackID}`);
      } else {
        console.log(`cannot shuffle cardStack ${cardStackID}; does not exist`);
      }
    }
  );

  socket.on(
    EventNames.CardStackModified,
    (cardStackID: string, cards: ScryfallData[]) => {
      const roomID = players[ipAddress];
      const room = rooms[roomID];

      console.log(`in room ${roomID}:`);
      if (cardStackID in room.cardStacks) {
        const cardStack = room.cardStacks[cardStackID];
        cardStack.cards = cards;
        io.to(roomID).emit(EventNames.CardStackModified);
        console.log(`modified cardStack ${cardStackID}`);
      } else {
        console.log(`cannot modify cardStack ${cardStackID}; does not exist`);
      }
    }
  );

  socket.on(
    EventNames.CardStackMoved,
    (cardStackID: string, x: number, y: number) => {
      const roomID = players[ipAddress];
      const room = rooms[roomID];

      console.log(`in room ${roomID}:`);
      if (cardStackID in room.cardStacks) {
        const cardStack = room.cardStacks[cardStackID];
        const oldX = cardStack.x;
        const oldY = cardStack.y;
        cardStack.x = x;
        cardStack.y = y;
        io.to(roomID).emit(EventNames.CardStackMoved, cardStackID, x, y);
        console.log(
          `cardStack ${cardStackID} moved from [${oldX}, ${oldY}] to [${x}, ${y}]`
        );
      } else {
        console.log(`cannot move cardStack ${cardStackID}; does not exist`);
      }
    }
  );

  socket.on(
    EventNames.CardStackRotated,
    (cardStackID: string, rotation: number) => {
      const roomID = players[ipAddress];
      const room = rooms[roomID];

      console.log(`in room ${roomID}:`);
      if (cardStackID in room.cardStacks) {
        const cardStack = room.cardStacks[cardStackID];
        const oldRotation = cardStack.rotation;
        cardStack.rotation = rotation;
        io.to(roomID).emit(EventNames.CardStackRotated, cardStackID, rotation);
        console.log(
          `changed rotation of cardStack ${cardStackID} from ${oldRotation} to ${rotation}`
        );
      } else {
        console.log(
          `cannot rotate cardStack with ID ${cardStackID}; does not exist`
        );
      }
    }
  );
});
