import { ILvlJutsu } from '../interface';

export interface IWriteJutsuToNinja {
  tag: string;
  jutsu: ILvlJutsu[];
}

export interface IRollJutsu {
  writeSkillToNinjaUser(): Promise<void>;
}
