import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TradeService } from '../../services/trade.service';
import { Trade } from '../../models/trade.model';

@Component({
  selector: 'app-scambi-board',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './scambi-board.component.html',
  styleUrl: './scambi-board.component.css'
})
export class ScambiBoardComponent implements OnInit {
  trades: Trade[] = [];

  constructor(private tradeService: TradeService) {}

  ngOnInit(): void {
    this.tradeService.getTrades().subscribe(trades => this.trades = trades);
  }

  getUsername(t: Trade): string {
    return typeof t.user === 'object' ? (t.user as any).username : t.username || '';
  }
}