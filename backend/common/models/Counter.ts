import { randomUUID } from "crypto";
import { Physical } from "../Physical";

export class Counter implements Physical {
  public ID: string;
  public vals: number[];

  public height: string;
  public width: string;
  public x: number | null;
  public y: number | null;
  public rotated: boolean | null;

  constructor(
    vals: number[] = [0],
    height: string,
    width: string,
    x: number,
    y: number
  ) {
    this.ID = randomUUID();
    this.vals = vals;

    this.height = height;
    this.width = width;
    this.x = x;
    this.y = y;
    this.rotated = false;
  }
}
