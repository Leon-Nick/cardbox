import {
  CardInitArgs,
  CardStackInitArgs,
  CounterInitArgs,
  Game,
  ScryfallData,
} from "./models";

export interface Events {
  // Out-Of-Game Events
  GameUpdated: (gameJSON: string) => void;
  JoinRequested: (roomID: string) => void;
  PlayerJoined: (playerID: string) => void;
  PlayerLeft: (playerID: string) => void;
  HostChanged: (newHostID: string) => void;

  // In-Game Events: Card
  CardCreated: (args: CardInitArgs) => void;
  CardDeleted: (cardID: string) => void;
  CardMoved: (cardID: string, x: number, y: number) => void;
  CardRotated: (cardID: string, rotation: number) => void;

  // In-Game Events: Counter
  CounterCreated: (args: CounterInitArgs) => void;
  CounterDeleted: (counterID: string) => void;
  CounterValsChanged: (counterID: string, vals: number[]) => void;
  CounterMoved: (counterID: string, x: number, y: number) => void;
  CounterRotated: (counterID: string, rotation: number) => void;

  // In-Game Events: CardStack
  CardStackCreated: (args: CardStackInitArgs) => void;
  CardStackDeleted: (cardStackID: string) => void;
  CardStackShuffled: (cardStackID: string, cards: ScryfallData[]) => void;
  CardStackModified: (cardStackID: string, cards: ScryfallData[]) => void;
  CardStackMoved: (cardStackID: string, x: number, y: number) => void;
  CardStackRotated: (cardStackID: string, rotation: number) => void;
}

export interface ServerToClientEvents extends Events {}

export interface ClientToServerEvents extends Events {}

export interface InterServerEvents extends Events {}
