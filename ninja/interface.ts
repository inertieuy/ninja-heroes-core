export interface IWriteNinja {
  tag: string;
  name: string | undefined;
  jutsu: ILvlJutsu[];
}
export interface ILvlJutsu {
  name: string;
  level: string;
}
export interface INinja {
  writeNinjaToUser(): Promise<void>;
}
