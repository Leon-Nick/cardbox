import { randomUUID } from "crypto";
import { Physical } from "./Physical";
import { ScryfallData } from "./Scryfall";

export class Card implements Physical {
  public ID: string;
  public data: ScryfallData;

  public height: string;
  public width: string;
  public x: number | null;
  public y: number | null;
  public rotation: number | null;

  constructor(
    data: ScryfallData,
    height: string,
    width: string,
    x: number,
    y: number
  ) {
    this.ID = randomUUID();
    this.data = data;

    this.height = height;
    this.width = width;
    this.x = x;
    this.y = y;
    this.rotation = 0;
  }
}
