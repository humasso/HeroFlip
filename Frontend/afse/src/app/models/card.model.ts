export interface Powerstats {
  intelligence: string;
  strength: string;
  speed: string;
  durability: string;
  power: string;
  combat: string;
}

export interface Card {
  heroId: string;
  name: string;
  image: string;
  publisher?: string;
  powerstats?: Powerstats;
  quantity?: number;
  biography?: any;
  appearance?: any;
  work?: any;
  connections?: any;
}