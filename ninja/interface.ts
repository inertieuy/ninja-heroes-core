import { ILvlJutsu } from '../interface';

export interface IWriteNinja {
  tag: string;
  name: string | undefined;
  jutsu: ILvlJutsu[];
}

export interface INinja {
  writeNinjaToUser(): Promise<void>;
}
