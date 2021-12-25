export interface PlayerInitArgs {
  playerID: string;
  roomID: string;
}
export class Player {
  public playerID!: string;
  public roomID!: string;

  constructor(args: PlayerInitArgs) {
    Object.assign(this, args);
  }
}
