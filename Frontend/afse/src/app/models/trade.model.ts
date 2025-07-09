import { Card } from './card.model';

export interface Trade {
  _id: string;
  user: string | { _id: string; username: string };
  username?: string;
  description?: string;
  offerCards: Card[];
  wantCards: Card[];
  creditsOffered: number;
  creditsWanted: number;
}