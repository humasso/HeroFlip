import { Card } from './card.model';

export interface TradeProposal {
  user: string | { _id: string; username: string };
  offerCards: Card[];
  creditsOffered: number;
  status?: 'pending' | 'accepted' | 'rejected';
  _id?: string;
}

export interface Trade {
  _id: string;
  user: string | { _id: string; username: string };
  username?: string;
  description?: string;
  offerCards: Card[];
  wantCards: Card[];
  creditsOffered: number;
  creditsWanted: number;
  proposals?: TradeProposal[];
}