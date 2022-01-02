import { Game, Player, ScryfallData } from "./models";
import { InitArgs } from "./models";

export interface Events {
  // Out-Of-Game Events
  GameStateRequested: (gameState: Game) => void;
  JoinRequested: (roomID: string) => void;
  PlayerJoined: (player: Player) => void;
  PlayerLeft: (ID: string) => void;
  HostChanged: (newHostID: string) => void;

  // In-Game Events: GameObject
  ObjectMoved: (ID: string, x: number, y: number) => void;
  ObjectRotated: (ID: string, angle: number) => void;
  ObjectDeleted: (ID: string) => void;

  // In-Game Events: Card
  CardCreated: (args: InitArgs<ScryfallData>) => void;

  // In-Game Events: Deck
  DeckCreated: (args: InitArgs<ScryfallData[]>) => void;
  DeckChanged: (ID: string, data: ScryfallData[], shuffled: boolean) => void;

  // In-Game Events: Counter
  CounterCreated: (args: InitArgs<number>) => void;
  CounterChanged: (ID: string, val: number) => void;
}

export interface ServerToClientEvents extends Events {}

export interface ClientToServerEvents extends Events {}

export interface InterServerEvents extends Events {}
