import {
  Application as PixiApp,
  DisplayObject,
  InteractionData,
  InteractionEvent,
  Sprite,
} from "pixi.js";
import { assets } from "../server/shared/assets/manifest";

export const sandbox = new PixiApp({
  view: document.querySelector("canvas") as HTMLCanvasElement,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
  width: 1920,
  height: 1080,
  backgroundColor: 0x0,
});

let data: InteractionData;
let currentTarget: DisplayObject;

const { stage } = sandbox;

// add FPS readout below canvas
// const stats = addStats(document, app);
// app.ticker.add(stats.update, stats, UPDATE_PRIORITY.UTILITY);

const island = Sprite.from(assets.island);
stage.addChild(island);

island.scale.set(0.3);
island.interactive = true;

island
  .on("pointerdown", (event: InteractionEvent) => {
    ({ data } = event);
  })
  .on("pointermove", () => {
    if (data) {
      const { x, y } = data.getLocalPosition(stage);
      island.x = x;
      island.y = y;
    }
  })
  .on("pointerup", () => (data = null))
  .on("pointerupoutside", () => (data = null));
