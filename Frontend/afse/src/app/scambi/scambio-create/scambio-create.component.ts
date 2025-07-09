import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Card } from '../../models/card.model';
import { AlbumService } from '../../services/album.service';
import { TradeService } from '../../services/trade.service';
import { HeroService } from '../../services/hero.service';


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
  creditsOffered = 0;
  searchTerm = '';
  heroResults: { id: number; name: string }[] = [];

  constructor(
    private albumService: AlbumService,
    private tradeService: TradeService,
    private heroService: HeroService,
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

  removeOffer(index: number) {
    this.offer.splice(index, 1);
  }

  addWant(id: number) {
    this.heroService.getHero(id).subscribe(card => {
      this.want.push({ ...card, quantity: 1 });
      this.searchTerm = '';
      this.heroResults = [];
    });
  }

  removeWant(index: number) {
    this.want.splice(index, 1);
  }

  searchHero() {
    if (!this.searchTerm.trim()) {
      this.heroResults = [];
      return;
    }
    this.heroService.searchHeroes(this.searchTerm).subscribe(res => this.heroResults = res);
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
      creditsOffered: this.creditsOffered
    }).subscribe(tr => {
      this.router.navigate(['/scambi', tr._id]);
    });
  }
}