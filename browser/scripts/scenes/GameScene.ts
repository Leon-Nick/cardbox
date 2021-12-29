import { Container, InteractionEvent, Sprite } from "pixi.js";
import { Scene, Manager } from "../Manager";

export class GameScene extends Container implements Scene {
  private card: Sprite;
  private cardVelocity: number;
  private dragging: boolean;
  constructor() {
    super();

    // Inside assets.ts we have a line that says `{ name: "Clampy from assets.ts!", url: "./clampy.png" }`
    this.card = Sprite.from("island");

    this.card.anchor.set(0.5);
    this.card.scale.set(0.3);
    this.card.x = Manager.width / 2;
    this.card.y = Manager.height / 2;
    this.addChild(this.card);

    this.cardVelocity = 0;
    this.card.interactive = true;

    this.dragging = false;

    this.card.on("pointerdown", () => (this.dragging = true));
    this.card.on(
      "pointermove",
      (event: InteractionEvent) => {
        if (this.dragging) {
          const { x, y } = event.data.getLocalPosition(this.parent);
          this.card.x = x;
          this.card.y = y;
        }
      },
      this
    );
    this.card.on("pointerup", () => (this.dragging = false));
    this.card.on("pointerupoutside", () => (this.dragging = false));
  }

  public update(framesPassed: number): void {
    // Lets move clampy!
    this.card.x += this.cardVelocity * framesPassed;

    if (this.card.x > Manager.width) {
      this.card.x = Manager.width;
      this.cardVelocity = -this.cardVelocity;
    }

    if (this.card.x < 0) {
      this.card.x = 0;
      this.cardVelocity = -this.cardVelocity;
    }
  }
}
