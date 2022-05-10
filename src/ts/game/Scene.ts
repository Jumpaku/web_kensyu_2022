import { Input } from "./Input";

export interface Scene {
  update(time: number, input: Input): Scene;
  draw(): void;
}
