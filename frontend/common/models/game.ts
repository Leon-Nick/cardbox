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

    this.players.toString = () => Array.from(this.players).toString();
  }
}

export function gameStr(game: Game): string {
  return (
    "{\n\t" +
    Object.entries(game)
      .map(
        ([key, val]) => `${key}: ${key === "players" ? Array.from(val) : val}`
      )
      .join("\n\t") +
    "\n}"
  );
}
