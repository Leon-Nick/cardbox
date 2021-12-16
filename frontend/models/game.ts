export class Game {
  public ID: string;
  public players: Set<string>;
  public hostID: string;
  public meme: boolean;

  constructor(roomID: string, hostID: string) {
    this.ID = roomID;
    this.hostID = hostID;
    this.players = new Set(hostID);
    this.meme = false;
  }
}
