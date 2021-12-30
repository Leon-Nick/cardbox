import { GameObject } from "./GameObject";
import { ScryfallData } from "./ScryfallData";

export interface CardStackInitArgs {
  ID: string;
  cards: ScryfallData[];
  height: string;
  width: string;
  x: number;
  y: number;
}

export class CardStack implements GameObject {
  public ID!: string;
  public cards!: ScryfallData[];

  public height!: string;
  public width!: string;
  public x!: number;
  public y!: number;
  public rotation: number;

  constructor(args: CardStackInitArgs) {
    Object.assign(this, args);
    this.rotation = 0;
  }
}
