import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Card } from '../../models/card.model';
import { AlbumService } from '../../services/album.service';
import { TradeService } from '../../services/trade.service';
import { HeroService } from '../../services/hero.service';
import { UserService } from '../../services/user.service';


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
  heroResults: { id: number; name: string; quantity: number }[] = [];
  offerSearchTerm = '';
  offerHeroResults: { id: number; name: string; quantity: number }[] = [];

  userCredits = 0;
  cardQuantityMap: Record<string, number> = {};
  errorMsg: string | null = null;

  constructor(
    private albumService: AlbumService,
    private tradeService: TradeService,
    private heroService: HeroService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) { return; }
    this.albumService.getAlbum(userId).subscribe(album => {
      const cards = album.cards || [];
      this.duplicates = cards.filter(c => (c.quantity || 0) > 1);
      cards.forEach(c => this.cardQuantityMap[c.heroId] = c.quantity || 0);
    });
    this.userService.getUser(userId).subscribe(user => this.userCredits = user.credits);
  }

  addOffer(card: Card) {
    this.offer.push({ ...card, quantity: 1 });
  }

  addOfferById(id: number) {
    this.heroService.getHero(id).subscribe(card => {
      this.offer.push({ ...card, quantity: 1 });
      this.offerSearchTerm = '';
      this.offerHeroResults = [];
    });
  }

  removeOffer(index: number) {
    this.offer.splice(index, 1);
  }

  ensureValidOffer() {
    if (this.creditsOffered > this.userCredits) {
      this.creditsOffered = this.userCredits;
    }
    if (this.creditsOffered < 0) {
      this.creditsOffered = 0;
    }
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
    this.heroService.searchHeroes(this.searchTerm).subscribe(res => {
      this.heroResults = res.map(h => ({
        ...h,
        quantity: this.cardQuantityMap[h.id] || 0
      }));
    });
  }

   searchOfferHero() {
    if (!this.offerSearchTerm.trim()) {
      this.offerHeroResults = [];
      return;
    }
    this.heroService.searchHeroes(this.offerSearchTerm).subscribe(res => {
      this.offerHeroResults = res.map(h => ({
        ...h,
        quantity: this.cardQuantityMap[h.id] || 0
      }));
    });
  }

  create() {
    const userId = localStorage.getItem('userId');
    if (!userId) { return; }
    this.ensureValidOffer();
    if (this.offer.length === 0 && (this.creditsOffered <= 0 || this.want.length === 0)) {
      this.errorMsg = 'Inserisci almeno una carta in "Offri" oppure dei crediti e le carte richieste.';
      return;
    }
    this.tradeService.createTrade({
      user: userId,
      description: this.description,
      offerCards: this.offer,
      wantCards: this.want,
      creditsWanted: this.creditsWanted,
      creditsOffered: this.creditsOffered
    }).subscribe({
      next: tr => {
        this.router.navigate(['/scambi', tr._id]);
      },
      error: err => {
        this.errorMsg = err.error?.message || 'Errore durante la creazione.';
      }
    });
  }
}