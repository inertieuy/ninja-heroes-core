export interface IWriteJutsuToNinja {
  jutsu: string;
}
export interface IRollJutsu {
  writeSkillToNinjaUser(): Promise<void>;
}
