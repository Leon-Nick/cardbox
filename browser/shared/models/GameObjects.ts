import { randomUUID } from "crypto";
import { Container, InteractionEvent, Sprite } from "pixi.js";
import { ScryfallData } from "./ScryfallData";
import { assets } from "../assets/manifest";

export type GameObjectSubtype = "Card" | "Deck" | "Counter";

export interface InitArgs<T> {
  data: T;

  ID?: string;
  x: number;
  y: number;
}

export class GameObject {
  type: GameObjectSubtype;
  ID: string;

  sprite: Sprite;
  event?: InteractionEvent;

  constructor(type: GameObjectSubtype, args: InitArgs<string>) {
    this.ID = args.ID ?? randomUUID();
    this.type = type;
    this.sprite = Sprite.from(args.data);
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

export class Card extends GameObject {
  data: ScryfallData;

  constructor(args: InitArgs<ScryfallData>) {
    const imageURL = args.data.image_uris?.normal ?? assets.island;
    super("Card", { ...args, data: imageURL });
    this.data = args.data;
  }
}

export class Deck extends GameObject {
  data: ScryfallData[];

  constructor(args: InitArgs<ScryfallData[]>) {
    const imageURL = args.data[0].image_uris?.normal ?? assets.island;
    super("Deck", { ...args, data: imageURL });
    this.data = args.data;
  }
}

export class Counter extends GameObject {
  data: number;

  constructor(args: InitArgs<number>) {
    const imageURL = assets.burgeoning;
    super("Counter", { ...args, data: imageURL });
    this.data = args.data;
  }
}
