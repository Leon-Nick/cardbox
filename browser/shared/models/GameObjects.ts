import { randomUUID } from "crypto";
import { Sprite } from "pixi.js";
import { ScryfallData } from "./ScryfallData";
import { assets } from "../assets/manifest";

export interface GameObject {
  type: "Card" | "CardStack" | "Counter";
  ID: string;
  sprite: Sprite;
}

export class Card implements GameObject {
  type: "Card" = "Card";
  ID: string;

  // in-game info (name, image URL, oracle text, etc)
  data: ScryfallData;

  // display info (position, rotation, scale, etc)
  sprite: Sprite;

  constructor(data: ScryfallData, ID?: string) {
    this.ID = ID ?? randomUUID();
    // TODO: impl. card data import from scryfall
    this.data = data;
    this.sprite = Sprite.from(data.image_uris?.normal ?? assets.island);
  }
}

export class CardStack implements GameObject {
  type: "CardStack" = "CardStack";
  ID: string;

  // in-game info (names, image URLs, oracle text, etc)
  cards: ScryfallData[];

  // display info (position, rotation, scale, etc)
  sprite: Sprite;

  constructor(cards: ScryfallData[], ID?: string) {
    this.ID = ID ?? randomUUID();
    this.cards = cards;
    this.sprite = Sprite.from(cards[0].image_uris?.normal ?? assets.island);
  }
}

export class Counter implements GameObject {
  type: "Counter" = "Counter";
  ID: string;

  // display info (position, rotation, scale, etc)
  sprite: Sprite;

  constructor(ID?: string) {
    this.ID = ID ?? randomUUID();
    this.sprite = Sprite.from(assets.burgeoning);
  }

  get val() {
    return 0;
  }

  set val(n: number) {
    // TODO: impl. set val by modifying this.sprite
  }
}
