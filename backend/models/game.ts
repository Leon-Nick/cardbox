export class Game {
  public ID: string;
  public players: Set<string>;
  public hostID: string;
  public meme: boolean;

  constructor(roomID: string, hostID: string) {
    this.ID = roomID;
    this.players = new Set();
    this.hostID = hostID;
    this.meme = false;
  }
}
