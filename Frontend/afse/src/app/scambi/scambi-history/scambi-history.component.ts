import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TradeService } from '../../services/trade.service';
import { TradeHistory } from '../../models/trade-history.model';

@Component({
  selector: 'app-scambi-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scambi-history.component.html',
  styleUrl: './scambi-history.component.css'
})
export class ScambiHistoryComponent implements OnInit {
  history: TradeHistory[] = [];
  private userId: string | null = localStorage.getItem('userId');

  constructor(private tradeService: TradeService) {}

  ngOnInit(): void {
    if (this.userId) {
      this.tradeService.getHistory(this.userId).subscribe(h => this.history = h);
    }
  }

  getOwnerUsername(h: TradeHistory): string {
    return typeof h.owner === 'object' ? (h.owner as any).username : '';
  }

  getProposerUsername(h: TradeHistory): string {
    return typeof h.proposer === 'object' ? (h.proposer as any).username : '';
  }
}