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
  requested: (Card & { owned: number })[] = [];
  offer: Card[] = [];
  creditsOffered = 0;
  userCredits = 0;
  showForm = false;
  showToast = false;
  toastMessage: string | null = null;
  toastType: 'success' | 'danger' = 'success';
  tradeCompleted = false;
  private ownedCardMap: Record<string, number> = {};
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
      this.tradeService.getTrade(id).subscribe(tr => {
        this.trade = tr;
        this.creditsOffered = tr.creditsWanted;
        this.updateRequestedCards();
        this.tradeCompleted = tr.proposals?.some(p => p.status === 'accepted') || false;
      });
    }
    if (this.userId) {
      this.albumService.getAlbum(this.userId).subscribe(a => {
        const cards = a.cards || [];
        this.ownedCardMap = {};
        cards.forEach(c => this.ownedCardMap[c.heroId] = c.quantity || 0);
        this.updateRequestedCards();
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

  creditInputLocked(): boolean {
    if (!this.trade) { return true; }
    return this.trade.creditsWanted > 0 || this.trade.wantCards.length > 0;
  }

  isOwner(): boolean {
    if (!this.trade) { return false; }
    const id = typeof this.trade.user === 'object' ? (this.trade.user as any)._id : this.trade.user;
    return id === this.userId;
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

  private offerCount(heroId: string): number {
    return this.offer.filter(o => o.heroId === heroId).length;
  }

  addRequested(card: Card) {
    if (!this.trade) { return; }
    const owned = this.ownedCardMap[card.heroId] || 0;
    const offered = this.offerCount(card.heroId);
    const required = this.trade.wantCards.find(w => w.heroId === card.heroId)?.quantity || 1;
    if (offered >= owned || offered >= required) { return; }
    this.offer.push({ ...card, quantity: 1 });
  }

  proposalComplete(): boolean {
    if (!this.trade) { return false; }
    const cardsOk = this.trade.wantCards.every(w => {
      const required = w.quantity || 1;
      return this.offerCount(w.heroId) >= required;
    });
    const requiredCredits = this.creditInputLocked() ? this.trade.creditsWanted : this.creditsOffered;
    const creditsOk = requiredCredits <= this.userCredits;
    return cardsOk && creditsOk;
  }

  hasPendingProposal(): boolean {
    if (!this.trade || !this.userId) { return false; }
    return this.trade.proposals?.some(p => {
      const uid = typeof p.user === 'object' ? (p.user as any)._id : p.user;
      return uid === this.userId && p.status === 'pending';
    }) || false;
  }

  rejectProposal(proposalId: string) {
    if (!this.trade) { return; }
    this.tradeService
      .rejectProposal(this.trade._id, proposalId)
      .subscribe(tr => {
        this.trade = tr;
        this.toastType = 'danger';
        this.toastMessage = 'Proposta rifiutata';
        this.showToast = true;
        // Aggiorna crediti e album dell'utente dopo l'accettazione
        this.userService.getUser(this.userId!).subscribe(u => this.userCredits = u.credits);
        this.albumService.getAlbum(this.userId!).subscribe(a => {
          const cards = a.cards || [];
          this.ownedCardMap = {};
          cards.forEach(c => this.ownedCardMap[c.heroId] = c.quantity || 0);
          this.updateRequestedCards();
        });
        setTimeout(() => this.showToast = false, 3000);
      });
  }

  acceptProposal(proposalId: string) {
    if (!this.trade || !this.userId) { return; }
    this.tradeService
      .acceptProposal(this.trade._id, proposalId)
      .subscribe(tr => {
        this.trade = tr;
        this.tradeCompleted = true;
        this.toastType = 'success';
        this.toastMessage = 'Scambio completato!';
        this.showToast = true;
        setTimeout(() => this.showToast = false, 3000);
      });
  }

  deleteTrade() {
    if (!this.trade) { return; }
    this.tradeService.deleteTrade(this.trade._id).subscribe(() => {
      this.toastType = 'success';
      this.toastMessage = 'Annuncio eliminato';
      this.showToast = true;
      setTimeout(() => this.showToast = false, 3000);
      this.location.back();
    });
  }
  
  getPendingProposals(): TradeProposal[] {
    return this.trade?.proposals?.filter(p => p.status === 'pending') || [];
  }


  private updateRequestedCards() {
    if (!this.trade) { return; }
    this.requested = this.trade.wantCards.map(c => ({
      ...c,
      owned: this.ownedCardMap[c.heroId] || 0
    }));
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