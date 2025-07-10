import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TradeService } from '../../services/trade.service';
import { Trade } from '../../models/trade.model';


@Component({
  selector: 'app-scambio-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scambio-detail.component.html',
  styleUrl: './scambio-detail.component.css'
})
export class ScambioDetailComponent implements OnInit {
  trade?: Trade;

  constructor(
    private route: ActivatedRoute,
    private tradeService: TradeService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.tradeService.getTrade(id).subscribe(tr => this.trade = tr);
    }
  }

  getUsername(): string {
    if (!this.trade) { return ''; }
    const t = this.trade;
    return typeof t.user === 'object' ? (t.user as any).username : t.username || '';
  }

   goBack() {
    this.location.back();
  }
}