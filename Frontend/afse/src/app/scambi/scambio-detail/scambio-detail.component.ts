import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TradeService } from '../../services/trade.service';
import { Trade, TradeProposal } from '../../models/trade.model';
import { FormsModule } from '@angular/forms';
import { Card } from '../../models/card.model';
import { AlbumService } from '../../services/album.service';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-scambio-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './scambio-detail.component.html',
  styleUrl: './scambio-detail.component.css'
})
export class ScambioDetailComponent implements OnInit {
  trade?: Trade;
  duplicates: Card[] = [];
  offer: Card[] = [];
  creditsOffered = 0;
  userCredits = 0;
  showForm = false;
  showToast = false;
  toastMessage: string | null = null;
  toastType: 'success' | 'danger' = 'success';
  private userId: string | null = localStorage.getItem('userId');

  constructor(
    private route: ActivatedRoute,
    private tradeService: TradeService,
    private albumService: AlbumService,
    private userService: UserService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.tradeService.getTrade(id).subscribe(tr => this.trade = tr);
    }
    if (this.userId) {
      this.albumService.getAlbum(this.userId).subscribe(a => {
        const cards = a.cards || [];
        this.duplicates = cards.filter(c => (c.quantity || 0) > 1);
      });
      this.userService.getUser(this.userId).subscribe(u => this.userCredits = u.credits);
    }
  }

  getUsername(): string {
    if (!this.trade) { return ''; }
    const t = this.trade;
    return typeof t.user === 'object' ? (t.user as any).username : t.username || '';
  }

  getProposalUsername(p: TradeProposal): string {
    return typeof p.user === 'object' ? (p.user as any).username : '';
  }

  isOwner(): boolean {
    if (!this.trade) { return false; }
    const id = typeof this.trade.user === 'object' ? (this.trade.user as any)._id : this.trade.user;
    return id === this.userId;
  }

  addOffer(card: Card) {
    this.offer.push({ ...card, quantity: 1 });
  }

  removeOffer(index: number) {
    this.offer.splice(index, 1);
  }

  ensureValidOffer() {
    if (this.creditsOffered > this.userCredits) { this.creditsOffered = this.userCredits; }
    if (this.creditsOffered < 0) { this.creditsOffered = 0; }
  }

  sendProposal() {
    if (!this.trade || !this.userId) { return; }
    this.ensureValidOffer();
    this.tradeService.respondToTrade(this.trade._id, {
      user: this.userId,
      offerCards: this.offer,
      creditsOffered: this.creditsOffered
    }).subscribe(tr => {
      this.trade = tr;
      this.offer = [];
      this.creditsOffered = 0;
      this.showForm = false;
      this.toastType = 'success';
      this.toastMessage = 'Proposta inviata!';
      this.showToast = true;
      setTimeout(() => this.showToast = false, 3000);
    });
  }

  goBack() {
    this.location.back();
  }
}