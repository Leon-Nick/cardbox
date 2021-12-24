import { Physical } from "./Physical";
import { ScryfallData } from "./ScryfallData";

export interface CardInitArgs {
  ID: string;
  data: ScryfallData;
  height: string;
  width: string;
  x: number;
  y: number;
}

export class Card implements Physical {
  public ID!: string;
  public data!: ScryfallData;

  public height!: string;
  public width!: string;
  public x!: number;
  public y!: number;
  public rotation: number;

  constructor(args: CardInitArgs) {
    Object.assign(this, args);
    this.rotation = 0;
  }
}
