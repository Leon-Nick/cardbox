export enum Event {
  // Socket.io Events
  Connection = "connection",
  Disconnecting = "disconnecting",

  // Out-Of-Game Events
  RoomCreated = "RoomCreated",
  RoomDeleted = "RoomDeleted",
  RoomUnlocked = "RoomUnlocked",
  RoomLocked = "RoomLocked",
  PlayerJoined = "PlayerJoined",
  PlayerLeft = "PlayerLeft",
  HostChanged = "HostChanged",

  // In-Game Events: Card
  CardCreated = "CardCreated",
  CardDeleted = "CardDeleted",
  CardMoved = "CardMoved",
  CardRotated = "CardRotated",

  // In-Game Events: Counter
  CounterCreated = "CounterCreated",
  CounterDeleted = "CounterDeleted",
  CounterValAdded = "CounterValAdded",
  CounterValRemoved = "CounterValRemoved",
  CounterValChanged = "CounterValChanged",
  CounterMoved = "CounterMoved",
  CounterRotated = "CounterRotated",

  // In-Game Events: CardStack
  CardStackCreated = "CardStackCreated",
  CardStackDeleted = "CardStackDeleted",
  CardStackShuffled = "CardStackShuffled",
  CardStackModified = "CardStackModified",
  CardStackMoved = "CardStackMoved",
  CardStackRotated = "CardStackRotated",
}
