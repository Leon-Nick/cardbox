export class Room {
  id: string;
  passwordHash: string;
  players: Player[];
  cards: Record<string, Card | Deck>;
  counters: Record<string, Counter>;

  constructor(
    id: string,
    passwordHash: string,
    players: Player[],
    cards: Record<string, Card | Deck>,
    counters: Record<string, Counter>
  ) {
    this.id = id;
    this.passwordHash = passwordHash;
    this.players = players;
    this.cards = cards;
    this.counters = counters;
  }

  setPlayerCount(count: number): boolean {
    return false;
  }
  update(event: GameEvent): boolean {
    return false;
  }
}

export class Player {
  id: string;
  color: string;

  constructor(id: string, color: string) {
    this.id = id;
    this.color = color;
  }
}

export class Deck {
  id: string;
  controllers: Player[];
  coordinates: [number, number];
  isFacedown: boolean;
  cards: Card[];

  constructor(
    id: string,
    controllers: Player[],
    coordinates: [number, number],
    isFacedown: boolean,
    cards: Card[]
  ) {
    this.id = id;
    this.controllers = controllers;
    this.coordinates = coordinates;
    this.isFacedown = isFacedown;
    this.cards = cards;
  }
}

export class Card {
  id: string;
  controllers: Player[] | string;
  coordinates: [number, number] | string;
  isFacedown: boolean | string;
  isFrontFace: boolean;
  isRotated: boolean;
  // all the scryfall card data

  constructor(
    id: string,
    controllers: Player[] | string,
    coordinates: [number, number] | string,
    isFacedown: boolean | string,
    isFrontFace: boolean,
    isRotated: boolean
  ) {
    this.id = id;
    this.controllers = controllers;
    this.coordinates = coordinates;
    this.isFacedown = isFacedown;
    this.isFrontFace = isFrontFace;
    this.isRotated = isRotated;
  }
}

export class Counter {
  id: string;
  controllers: Player[];
  val: number;

  constructor(id: string, controllers: Player[], val: number) {
    this.id = id;
    this.controllers = controllers;
    this.val = val;
  }
}

export class GameEvent {
  type: EventType;
  id: string;

  constructor(type: EventType, id: string) {
    this.type = type;
    this.id = id;
  }
}

export enum EventType {
  CARD,
  COUNTER,
  PLAYER,
  PLAYER_JOINED,
  PLAYER_LEFT,
}
