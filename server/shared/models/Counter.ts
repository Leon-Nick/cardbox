import { GameObject } from "./GameObject";

export interface CounterInitArgs {
  ID: string;
  vals: number[];
  height: string;
  width: string;
  x: number;
  y: number;
}

export class Counter implements GameObject {
  public ID!: string;
  public vals!: number[];

  public height!: string;
  public width!: string;
  public x!: number;
  public y!: number;
  public rotation: number;

  constructor(args: CounterInitArgs) {
    Object.assign(this, args);
    this.rotation = 0;
  }
}
