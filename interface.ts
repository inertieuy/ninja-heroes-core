export interface IChar {
  id: string;
  name: string;
  class: 'S' | 'A' | 'B' | 'C' | 'D';
  element: 'water' | 'lightning' | 'fire' | 'earth' | 'wind';
  attribut: IAttribut[];
  jutsu: ILvlJutsu[];
}
export interface ILvlJutsu {
  name: string;
  level: string;
}
export interface IAttribut {
  damage: number;
  defense: number;
  agility: number;
  health: number;
}
export interface IJutsu {
  id: string;
  name: string;
  type: 'damage' | 'defense' | 'heal';
  element: 'wind' | 'fire' | 'lightning' | 'water' | 'earth' | null;
  value: number;
  class: 'S' | 'A' | 'B' | 'C' | 'D';
}
