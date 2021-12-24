const URL_CHARS =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const randomUrlChar = (): string =>
  URL_CHARS[Math.floor(Math.random() * URL_CHARS.length)];

export function randomRoomID(): string {
  return Array(6).fill(null).map(randomUrlChar).join("");
}

export function shuffle<T>(array: T[]): void {
  let rand: number;
  for (let i = 0; i < array.length; i++) {
    rand = Math.floor(Math.random() * array.length);
    [array[i], array[rand]] = [array[rand], array[i]];
  }
}
