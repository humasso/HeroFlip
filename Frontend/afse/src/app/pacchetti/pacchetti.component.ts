import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { PacchettiService } from '../services/pacchetti.service';
import { HeroService } from '../services/hero.service';
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
  statKeys: (keyof Powerstats)[] = ['intelligence','strength','speed','durability','power','combat'];
  //selectedQty = 1;
  opening = false;
  openingIndex: number | null = null;
  albumOpening = false;
  //carouselInterval = 2000;

  private userId = localStorage.getItem('userId');

  constructor(private userService: UserService,
              private packService: PacchettiService,
              private heroService: HeroService,
              private router: Router) {}

  ngOnInit(): void {
    if (this.userId) {
      this.userService.getUser(this.userId).subscribe({
        next: user => {
          this.packs = (user.packs ?? []).filter(p => p.quantity > 0);
          this.cardTransforms = new Array(this.packs.length).fill('perspective(600px)');
        },
        error: () => {
          this.packs = [];
          this.cardTransforms = [];
        }
      });
    }
  }

  openPack(index = 0) {
    if (!this.userId || this.packs.length === 0) { return; }
    const packType = this.packs[index].packType;
    this.openingIndex = index;
    this.opening = true;
    this.openedCards = [];
    this.packService.openPack(this.userId, packType).subscribe({
      next: res => {
        this.packs = (res.packs ?? []).filter(p => p.quantity > 0);
        this.cardTransforms = new Array(this.packs.length).fill('perspective(600px)');
        forkJoin(res.ids.map(id => this.heroService.getHero(id))).subscribe(cards => {
          this.openedCards = cards;
          this.opening = false;
          this.openingIndex = null;
        });
      },
      error: () => {
        this.opening = false;
        this.openingIndex = null;
      }
    });
  }

  insertIntoAlbum() {
    if (!this.userId || this.openedCards.length === 0) { return; }
    this.packService.addCardsToAlbum(this.userId, this.openedCards).subscribe({
      next: () => {
        this.openedCards = [];
        alert('Carte inserite nel album');
      }
    });
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
