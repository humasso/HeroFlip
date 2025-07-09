import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Card } from '../../models/card.model';
import { AlbumService } from '../../services/album.service';
import { TradeService } from '../../services/trade.service';


@Component({
  selector: 'app-scambio-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './scambio-create.component.html',
  styleUrl: './scambio-create.component.css'
})
export class ScambioCreateComponent implements OnInit {
  duplicates: Card[] = [];
  offer: Card[] = [];
  want: Card[] = [];
  description = '';
  creditsWanted = 0;

  constructor(
    private albumService: AlbumService,
    private tradeService: TradeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) { return; }
    this.albumService.getAlbum(userId).subscribe(album => {
      this.duplicates = (album.cards || []).filter(c => (c.quantity || 0) > 1);
    });
  }

  addOffer(card: Card) {
    this.offer.push({ ...card, quantity: 1 });
  }

  create() {
    const userId = localStorage.getItem('userId');
    if (!userId) { return; }
    this.tradeService.createTrade({
      user: userId,
      description: this.description,
      offerCards: this.offer,
      wantCards: this.want,
      creditsWanted: this.creditsWanted,
      creditsOffered: 0
    }).subscribe(tr => {
      this.router.navigate(['/scambi', tr._id]);
    });
  }
}