const URL_CHARS =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const randomUrlChar = (): string =>
  URL_CHARS[Math.floor(Math.random() * URL_CHARS.length)];

export function randomRoomID(): string {
  return Array(6).fill(null).map(randomUrlChar).join("");
}
