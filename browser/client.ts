import { Application as PixiApp, InteractionEvent, Sprite } from "pixi.js";
import { assets } from "../server/shared/assets/manifest";

export const sandbox = new PixiApp({
  view: document.querySelector("canvas") as HTMLCanvasElement,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
  width: 1920,
  height: 1080,
  backgroundColor: 0x0,
});

const { stage } = sandbox;

// add FPS readout below canvas
// const stats = addStats(document, app);
// app.ticker.add(stats.update, stats, UPDATE_PRIORITY.UTILITY);

const island = Sprite.from(assets.island);
island.scale.set(0.3);
stage.addChild(island);

// Interaction stuff begins here

stage.interactive = true;
island.interactive = true;

stage.hitArea = sandbox.renderer.screen;

let eventTracker: InteractionEvent;

island
  .on("pointerdown", (event: InteractionEvent) => {
    eventTracker = event;
  })
  .on("pointermove", () => {
    if (eventTracker?.data) {
      const { x, y } = eventTracker.data.getLocalPosition(stage);
      island.x = x;
      island.y = y;
    }
  })
  .on("pointerup", () => {
    eventTracker = null;
  })
  .on("pointerupoutside", () => {
    eventTracker = null;
  });
