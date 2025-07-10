import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgbOffcanvas, NgbOffcanvasModule } from '@ng-bootstrap/ng-bootstrap';
import { TradeService } from '../../services/trade.service';
import { Trade } from '../../models/trade.model';
import { TradeHistory } from '../../models/trade-history.model';
import { ScambiHistoryComponent } from '../scambi-history/scambi-history.component';

@Component({
  selector: 'app-scambi-board',
  standalone: true,
  imports: [CommonModule, RouterLink, NgbOffcanvasModule, ScambiHistoryComponent],
  templateUrl: './scambi-board.component.html',
  styleUrl: './scambi-board.component.css'
})
export class ScambiBoardComponent implements OnInit {
  trades: Trade[] = [];
  myTrades: Trade[] = [];
  respondedTrades: Trade[] = [];
  history: TradeHistory[] = [];

  @ViewChild('myTradesCanvas') myTradesCanvas!: TemplateRef<any>;
  @ViewChild('historyCanvas') historyCanvas!: TemplateRef<any>;
  private userId: string | null = localStorage.getItem('userId');

  constructor(private tradeService: TradeService, private offcanvas: NgbOffcanvas) {}

  ngOnInit(): void {
    this.tradeService.getTrades().subscribe(trades => {
      if (this.userId) {
        this.respondedTrades = trades.filter(t =>
          t.proposals?.some(p => this.getProposalUserId(p) === this.userId && p.status === 'pending')
        );
      }
      this.trades = trades.filter(t =>
        this.getUserId(t) !== this.userId &&
        !(this.userId && t.proposals?.some(p => this.getProposalUserId(p) === this.userId && p.status === 'pending'))
      );
    });
    if (this.userId) {
      this.tradeService.getTradesByUser(this.userId).subscribe(trades => this.myTrades = trades);
      this.tradeService.getHistory(this.userId).subscribe(h => this.history = h);
    }
  }

  getUsername(t: Trade): string {
    return typeof t.user === 'object' ? (t.user as any).username : t.username || '';
  }

  private getUserId(t: Trade): string | null {
    return typeof t.user === 'object' ? (t.user as any)._id : t.user || null;
  }

  private getProposalUserId(p: any): string | null {
    return typeof p.user === 'object' ? (p.user as any)._id : p.user || null;
  }

  openMyTrades() {
    if (this.myTradesCanvas) {
      this.offcanvas.open(this.myTradesCanvas, { position: 'end' });
    }
  }

  proposalCount(t: Trade): number {
    return t.proposals ? t.proposals.length : 0;
  }

  totalProposals(): number {
    return this.myTrades.reduce((sum, t) => sum + this.proposalCount(t), 0);
  }

  openHistory() {
    if (this.historyCanvas) {
      this.offcanvas.open(this.historyCanvas, { position: 'end' });
    }
  }

}