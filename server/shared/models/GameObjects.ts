import { randomUUID } from "crypto";
import { Container, InteractionEvent, Sprite } from "pixi.js";
import { ScryfallData } from "./ScryfallData";
import { assets } from "../assets/manifest";

export type GameObjectSubtype = "Card" | "Deck" | "Counter";

export interface InitArgs<T> {
  type: GameObjectSubtype;
  ID?: string;
  data: T;
  imageURL: string;
  x: number;
  y: number;
}

export class GameObject<T> {
  type: GameObjectSubtype;
  ID: string;
  data: T;

  sprite: Sprite;
  event?: InteractionEvent;

  constructor(args: InitArgs<T>) {
    this.type = args.type;
    this.ID = args.ID ?? randomUUID();
    this.data = args.data;
    this.sprite = Sprite.from(args.imageURL);
    this.sprite.x = args.x;
    this.sprite.y = args.y;
  }

  initSprite(stage: Container) {
    this.sprite.scale.set(0.3);
    this.sprite.anchor.set(0.5);
    this.sprite.interactive = true;
    this.sprite
      .on("pointerdown", (event: InteractionEvent) => {
        this.event = event;
      })
      .on("pointermove", () => {
        if (this.event?.data) {
          const { x, y } = this.event.data.getLocalPosition(stage);
          this.sprite.x = x;
          this.sprite.y = y;
        }
      })
      .on("pointerup", () => {
        this.event = undefined;
      })
      .on("pointerupoutside", () => {
        this.event = undefined;
      });
  }
}

export class Card extends GameObject<ScryfallData> {}
export interface CardInitArgs extends InitArgs<ScryfallData> {}

export class Deck extends GameObject<ScryfallData[]> {}
export interface DeckInitArgs extends InitArgs<ScryfallData[]> {}

export class Counter extends GameObject<number> {}
export interface CounterInitArgs extends InitArgs<number> {}
