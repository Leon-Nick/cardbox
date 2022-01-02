export interface PlayerInitArgs {
  ID: string;
  roomID: string;
}
export class Player {
  public ID!: string;
  public roomID!: string;

  constructor(args: PlayerInitArgs) {
    Object.assign(this, args);
  }
}
