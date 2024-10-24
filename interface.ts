export interface Char {
    id: string
    name: string
    class: 'S' | 'A' | 'B' | 'C' | 'D'
    element: 'water' | 'lightning' | 'fire' | 'earth' | 'wind'
    attribut: Attribut[]
    jutsu: string[]
}
export interface Attribut {
    damage: number
    defense: number
    agility: number
    health: number
}
export interface Jutsu {
    id: string;
    name: string;
    type: 'damage' | 'defense' | 'heal';
    element: 'wind' | 'fire' | 'lightning' | 'water' | 'earth' | null,
    value: number;
    class: 'S' | 'A' | 'B' | 'C' | 'D';
}

export interface WriteNinja {
    tag: string
    name: string
    jutsu: string[]
}
export interface WriteJutsuToNinja {
    jutsu: string
}