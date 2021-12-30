import { randomUUID } from "crypto";
import { Container, InteractionEvent, Sprite } from "pixi.js";
import { ScryfallData } from "./ScryfallData";
import { assets } from "../assets/manifest";

export type GameObjectSubtype = "Card" | "CardStack" | "Counter";

export interface GameObjectInitArgs {
  ID?: string;
  type: GameObjectSubtype;
  imageURL: string;
}

export class GameObject {
  type: GameObjectSubtype;
  ID: string;

  sprite: Sprite;
  event?: InteractionEvent;

  constructor(args: GameObjectInitArgs) {
    this.ID = args.ID ?? randomUUID();
    this.type = args.type;
    this.sprite = Sprite.from(args.imageURL);
  }

  initSprite(stage: Container) {
    const { sprite } = this;
    sprite.scale.set(0.3);
    sprite.anchor.set(0.5);
    sprite.interactive = true;
    sprite
      .on("pointerdown", (event: InteractionEvent) => {
        this.event = event;
      })
      .on("pointermove", () => {
        if (this.event?.data) {
          const { x, y } = this.event.data.getLocalPosition(stage);
          sprite.x = x;
          sprite.y = y;
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
  // in-game info (name, image URL, oracle text, etc)
  data: ScryfallData;

  constructor(data: ScryfallData, ID?: string) {
    super({
      imageURL: data.image_uris?.normal ?? assets.island,
      type: "Card",
      ID,
    });

    // TODO: impl. card data import from scryfall
    this.data = data;
  }
}

export class CardStack extends GameObject {
  // in-game info (names, image URLs, oracle text, etc)
  cards: ScryfallData[];

  constructor(cards: ScryfallData[], ID?: string) {
    super({
      imageURL: cards[0].image_uris?.normal ?? assets.island,
      type: "CardStack",
      ID,
    });

    this.cards = cards;
  }
}

export class Counter extends GameObject {
  constructor(ID?: string) {
    super({
      imageURL: assets.burgeoning,
      type: "Counter",
      ID,
    });
  }

  get val() {
    return 0;
  }

  set val(n: number) {
    // TODO: impl. set val by modifying this.sprite
    n = n;
  }
}
