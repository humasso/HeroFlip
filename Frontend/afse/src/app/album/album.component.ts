import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AlbumService } from '../services/album.service';
import { Card } from '../models/card.model';

@Component({
  selector: 'app-album',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './album.component.html',
  styleUrl: './album.component.css'
})
export class AlbumComponent implements OnInit {
  Math = Math;
  cards: Card[] = [];
  searchTerm = '';
  page = 1;
  readonly pageSize = 20;
  view: 'owned' | 'full' = 'owned';
  pageInput = 1;
  readonly totalCards = 732;
  private cardMap = new Map<number, Card>();
  ownedCardsCount = 0;
  uniqueCardsCount = 0;

  constructor(private albumService: AlbumService) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) { return; }
    this.page = +(localStorage.getItem('albumPage') || '1');
    this.albumService.getAlbum(userId).subscribe({
      next: album => {
        this.cards = album.cards || [];
        this.cardMap = new Map(this.cards.map(c => [+c.heroId, c]));
        this.ownedCardsCount = this.cards.reduce((sum, c) => sum + (c.quantity || 0), 0);
         this.uniqueCardsCount = this.cards.length;
        this.pageInput = this.page;
        setTimeout(() => {
          const scroll = +(localStorage.getItem('albumScroll') || '0');
          window.scrollTo({ top: scroll });
        });
      },
      error: () => {
        this.cards = [];
        this.cardMap.clear();
        this.ownedCardsCount = 0;
        this.uniqueCardsCount = 0;
      }
    });
  }

  get filteredCards(): Card[] {
    if (!this.searchTerm.trim()) {
      return this.cards;
    }
    const term = this.searchTerm.toLowerCase();
    return this.cards.filter(c => c.name.toLowerCase().includes(term));
  }

  get totalPages(): number {
    return this.view === 'owned'
      ? Math.ceil(this.filteredCards.length / this.pageSize) || 1
      : Math.ceil(this.totalCards / this.pageSize);
  }

  get pagedSlots(): { card?: Card; id: number }[] {
    if (this.view === 'owned') {
      const start = (this.page - 1) * this.pageSize;
      return this.filteredCards.slice(start, start + this.pageSize)
        .map(c => ({ card: c, id: +c.heroId }));
    }
    const slots: { card?: Card; id: number }[] = [];
    const startId = (this.page - 1) * this.pageSize + 1;
    const endId = Math.min(startId + this.pageSize - 1, this.totalCards);
    for (let id = startId; id <= endId; id++) {
      slots.push({ card: this.cardMap.get(id), id });
    }
    return slots;
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.pageInput = this.page;
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.pageInput = this.page;
    }
  }

  goToPage() {
    if (this.pageInput >= 1 && this.pageInput <= this.totalPages) {
      this.page = this.pageInput;
    }
  }

  setView(mode: 'owned' | 'full') {
    this.view = mode;
    this.page = 1;
    this.pageInput = 1;
    this.searchTerm = '';
  }

  formatId(id: number): string {
    return id.toString().padStart(3, '0');
  }

  savePosition() {
    localStorage.setItem('albumPage', this.page.toString());
    localStorage.setItem('albumScroll', window.scrollY.toString());
  }
}