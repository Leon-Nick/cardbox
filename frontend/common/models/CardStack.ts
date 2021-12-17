import { randomUUID } from "crypto";
import { Physical } from "./Physical";
import { Card } from "./Card";

export class CardStack implements Physical {
  public ID: string;
  public cards: Record<string, Card>;

  public height: string;
  public width: string;
  public x: number | null;
  public y: number | null;
  public rotation: number | null;

  constructor(
    cards: Record<string, Card>,
    height: string,
    width: string,
    x: number,
    y: number
  ) {
    this.ID = randomUUID();
    this.cards = cards;

    this.height = height;
    this.width = width;
    this.x = x;
    this.y = y;
    this.rotation = 0;
  }
}
