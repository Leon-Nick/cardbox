import { randomUUID } from "crypto";
import { Physical } from "./Physical";
import { Card } from "./Card";
import { ScryfallData } from "./ScryfallData";

export class CardStack implements Physical {
  public ID: string;
  public cards: ScryfallData[];

  public height: string;
  public width: string;
  public x: number;
  public y: number;
  public rotation: number;

  constructor(
    cards: ScryfallData[],
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
