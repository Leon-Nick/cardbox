import { Card } from "./Card";
import { Counter } from "./Counter";
import { CardStack } from "./CardStack";

export class Game {
  public ID: string;
  public players: Set<string>;
  public hostID: string;

  public cards: Record<string, Card>;
  public counters: Record<string, Counter>;
  public cardStacks: Record<string, CardStack>;

  constructor(roomID: string, hostID: string) {
    this.ID = roomID;
    this.players = new Set();
    this.hostID = hostID;
    this.cards = {};
    this.counters = {};
    this.cardStacks = {};
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
