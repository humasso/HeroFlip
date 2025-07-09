import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { PacchettiService } from '../services/pacchetti.service';
import { HeroService } from '../services/hero.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
//import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { UserPack } from '../models/user.model';
import { Card, Powerstats } from '../models/card.model';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-pacchetti',
  imports: [CommonModule, FormsModule],
  templateUrl: './pacchetti.component.html',
  styleUrl: './pacchetti.component.css'
})

export class PacchettiComponent implements OnInit {
  packs: UserPack[] = [];
  cardTransforms: string[] = [];
  openedCards: Card[] = [];
  openedCardTransforms: string[] = [];
  revealed: boolean[] = [];
  selectedQuantities: number[] = [];
  remainingToOpen = 0;
  currentPackType: string | null = null;
  statKeys: (keyof Powerstats)[] = ['intelligence','strength','speed','durability','power','combat'];
  //selectedQty = 1;
  opening = false;
  openingIndex: number | null = null;
  albumOpening = false;
  //carouselInterval = 2000;

  packImages: Record<string, string> = {
    'Pacchetto Base': 'assets/pacchetto.png',
    'Pacchetto Marvel': 'assets/pacchetto marvel.png',
    'Pacchetto DC': 'assets/pacchetto dc.png'
  };


  @ViewChild('openedModal') openedModal!: TemplateRef<any>;
  modalRef: NgbModalRef | null = null;

  Math = Math;


  private userId = localStorage.getItem('userId');

  constructor(private userService: UserService,
              private packService: PacchettiService,
              private heroService: HeroService,
              private modalService: NgbModal,
              private router: Router) {}

  ngOnInit(): void {
    if (this.userId) {
      this.userService.getUser(this.userId).subscribe({
        next: user => {
          this.packs = (user.packs ?? []).filter(p => p.quantity > 0);
          this.cardTransforms = new Array(this.packs.length).fill('perspective(600px)');
          this.selectedQuantities = this.packs.map(() => 1);
        },
        error: () => {
          this.packs = [];
          this.cardTransforms = [];
          this.selectedQuantities = this.packs.map(() => 1);
        }
      });
    }
  }

  openPack(index = 0) {
    if (!this.userId || this.packs.length === 0) { return; }
    const pack = this.packs[index];
    const qty = Math.min(this.selectedQuantities[index] || 1, pack.quantity);
    if (qty < 1) { return; }
    this.currentPackType = pack.packType;
    this.remainingToOpen = qty;
    this.openingIndex = index;
    pack.quantity -= qty;
    this.cardTransforms = new Array(this.packs.length).fill('perspective(600px)');
    this.selectedQuantities = this.packs.map(() => 1);
    this.openNextPack();
  }

  private openNextPack() {
    if (!this.userId || !this.currentPackType || this.remainingToOpen <= 0) { return; }
    this.opening = true;
    this.openedCards = [];
    this.packService.openPack(this.userId, this.currentPackType).subscribe({
      next: res => {
        forkJoin(res.ids.map(id => this.heroService.getHero(id))).subscribe(cards => {
          this.openedCards = cards;
          this.revealed = new Array(cards.length).fill(false);
          this.openedCardTransforms = new Array(cards.length).fill('perspective(600px)');
          this.opening = false;
          this.modalRef = this.modalService.open(this.openedModal, { size: 'xl', centered: true });
          this.remainingToOpen--;
          if (this.remainingToOpen <= 0) {
            this.packs = (res.packs ?? []).filter(p => p.quantity > 0);
            this.cardTransforms = new Array(this.packs.length).fill('perspective(600px)');
            this.selectedQuantities = this.packs.map(() => 1);
            this.openingIndex = null;
            this.currentPackType = null;
          }
        });
      },
      error: () => {
        this.opening = false;
        this.openingIndex = null;
        this.remainingToOpen = 0;
        this.currentPackType = null;
      }
    });
  }

  insertIntoAlbum() {
    this.modalRef?.close();
    this.openedCards = [];
    if (this.remainingToOpen > 0) {
      this.openNextPack();
    }
  }

  stopOpening() {
    this.remainingToOpen = 0;
    this.currentPackType = null;
    this.openedCards = [];
    this.openingIndex = null;
    this.modalRef?.close();
  }

  getPackImage(type: string): string {
    return this.packImages[type] || 'assets/pacchetto.png';
  }

  onMouseEnter(i: number) {
    this.cardTransforms[i] = 'perspective(600px) scale(1.05)';
  }

  onMouseMove(event: MouseEvent, i: number) {
    const card = event.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateX = -((y - rect.height / 2) / rect.height) * 10;
    const rotateY = ((x - rect.width / 2) / rect.width) * 10;
    this.cardTransforms[i] = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  }

  onMouseLeave(i: number) {
    this.cardTransforms[i] = 'perspective(600px)';
  }

  
  flipCard(i: number) {
    this.revealed[i] = true;
  }

  openHero(i: number) {
    const card = this.openedCards[i];
    if (card) {
      this.modalRef?.close();
      this.router.navigate(['/album/hero', card.heroId]);
    }
  }

  onCardClick(i: number) {
    if (!this.revealed[i]) {
      this.flipCard(i);
    } else {
      this.openHero(i);
    }
  }

  onOpenedMouseEnter(i: number) {
    this.openedCardTransforms[i] = 'perspective(600px) scale(1.05)';
  }

  onOpenedMouseMove(event: MouseEvent, i: number) {
    const card = event.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateX = -((y - rect.height / 2) / rect.height) * 10;
    const rotateY = ((x - rect.width / 2) / rect.width) * 10;
    this.openedCardTransforms[i] = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  }

  onOpenedMouseLeave(i: number) {
    this.openedCardTransforms[i] = 'perspective(600px)';
  }
  
  statValue(value: string): number | null {
    const num = parseInt(value, 10);
    return isNaN(num) ? null : num;
  }

  statColor(stat: keyof Powerstats): string {
    const colors: Record<keyof Powerstats, string> = {
      intelligence: '#0d6efd', // blue
      strength: '#dc3545',     // red
      speed: '#ffc107',        // yellow
      durability: '#fd7e14',   // orange
      power: '#6f42c1',        // purple
      combat: '#198754'        // green
    };
    return colors[stat];
  }

    openAlbum() {
    this.albumOpening = true;
    setTimeout(() => {
      this.router.navigate(['/album']);
    }, 600);
  }
}
