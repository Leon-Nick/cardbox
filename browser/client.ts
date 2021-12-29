import { Manager } from "./scripts/Manager";
import { LoaderScene } from "./scripts/scenes";

Manager.initialize(1920, 1080, 0x6495ed);
Manager.changeScene(new LoaderScene());
