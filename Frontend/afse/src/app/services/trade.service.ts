import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Trade, TradeProposal } from '../models/trade.model';

@Injectable({ providedIn: 'root' })
export class TradeService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.backendApi}/trade`;

  getTrades(): Observable<Trade[]> {
    return this.http.get<Trade[]>(this.baseUrl);
  }

  getTrade(id: string): Observable<Trade> {
    return this.http.get<Trade>(`${this.baseUrl}/${id}`);
  }

  createTrade(trade: Partial<Trade>): Observable<Trade> {
    return this.http.post<Trade>(this.baseUrl, trade);
  }

  getTradesByUser(userId: string): Observable<Trade[]> {
    return this.http.get<Trade[]>(`${this.baseUrl}/user/${userId}`);
  }

  respondToTrade(id: string, proposal: Partial<TradeProposal>): Observable<Trade> {
    return this.http.post<Trade>(`${this.baseUrl}/${id}/respond`, proposal);
  }

  acceptProposal(tradeId: string, proposalId: string): Observable<Trade> {
    return this.http.patch<Trade>(`${this.baseUrl}/${tradeId}/proposal/${proposalId}/accept`, {});
  }

  rejectProposal(tradeId: string, proposalId: string): Observable<Trade> {
    return this.http.patch<Trade>(`${this.baseUrl}/${tradeId}/proposal/${proposalId}/reject`, {});
  }
}