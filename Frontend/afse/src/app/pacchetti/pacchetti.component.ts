import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { PacchettiService } from '../services/pacchetti.service';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { HeroService } from '../services/hero.service';
import { UserPack } from '../models/user.model';
import { Card } from '../models/card.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-pacchetti',
  imports: [CommonModule, FormsModule, NgbCarouselModule],
  templateUrl: './pacchetti.component.html',
  styleUrl: './pacchetti.component.css'
})
export class PacchettiComponent implements OnInit {
  packs: UserPack[] = [];
  cardTransforms: string[] = [];
  openedCards: Card[] = [];
  //selectedQty = 1;
  opening = false;

  private userId = localStorage.getItem('userid')?.split('"')[3];

  constructor(private userService: UserService,
              private packService: PacchettiService,
              private heroService: HeroService) {}

  ngOnInit(): void {
    if (this.userId) {
      this.userService.getUser(this.userId).subscribe({
        next: user => {
          this.packs = user.packs ?? [];
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
    this.opening = true;
    this.packService.openPack(this.userId, packType).subscribe({
      next: res => {
        this.packs = res.packs;
        this.cardTransforms = new Array(this.packs.length).fill('perspective(600px)');
        const requests = res.ids.map(id => firstValueFrom(this.heroService.getHero(id)));
        Promise.all(requests).then(cards => {
          this.openedCards = cards;
          this.opening = false;
        });
      },
      error: () => this.opening = false
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
}
