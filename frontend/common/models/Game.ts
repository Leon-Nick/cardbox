import { Card } from "./Card";
import { Counter } from "./Counter";
import { CardStack } from "./CardStack";

export class Game {
  public ID: string;
  public players: Set<string>;
  public hostID: string;
  public locked: boolean;

  public cards: Record<string, Card>;
  public cardStacks: Record<string, CardStack>;
  public counters: Record<string, Counter>;

  constructor(roomID: string, hostID: string) {
    this.ID = roomID;
    this.players = new Set();
    this.hostID = hostID;
    this.locked = false;

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
