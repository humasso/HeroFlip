import { Card } from './card.model';

export interface TradeHistory {
  _id?: string;
  owner: string | { _id: string; username: string };
  proposer: string | { _id: string; username: string };
  description?: string;
  offerCards: Card[];
  wantCards: Card[];
  creditsOffered: number;
  creditsWanted: number;
  proposerOfferCards: Card[];
  proposerCreditsOffered: number;
  createdAt?: string;
  completedAt?: string;
}