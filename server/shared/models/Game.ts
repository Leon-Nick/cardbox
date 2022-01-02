import { Player } from ".";
import { GameObject } from "./GameObjects";

export interface GameInitArgs {
  roomID: string;
  hostID: string;
}

export class Game {
  public ID: string;
  public hostID: string;

  public players: Record<string, Player>;
  public gameObjects: Record<string, GameObject>;

  constructor(args: GameInitArgs) {
    const { roomID, hostID } = args;
    this.ID = roomID;
    this.hostID = hostID;
    const host = new Player({ roomID, ID: hostID });
    this.players = { hostID: host };
    this.gameObjects = {};
  }
}
