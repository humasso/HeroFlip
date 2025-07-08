import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AlbumService } from '../services/album.service';
import { Card } from '../models/card.model';

@Component({
  selector: 'app-album',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './album.component.html',
  styleUrl: './album.component.css'
})
export class AlbumComponent implements OnInit {
  Math = Math;
  cards: Card[] = [];
  page = 1;
  readonly pageSize = 20;

  constructor(private albumService: AlbumService) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) { return; }
    this.page = +(localStorage.getItem('albumPage') || '1');
    this.albumService.getAlbum(userId).subscribe({
      next: album => {
        this.cards = album.cards || [];
        setTimeout(() => {
          const scroll = +(localStorage.getItem('albumScroll') || '0');
          window.scrollTo({ top: scroll });
        });
      },
      error: () => this.cards = []
    });
  }

  get pagedCards(): Card[] {
    const start = (this.page - 1) * this.pageSize;
    return this.cards.slice(start, start + this.pageSize);
  }

  nextPage() {
    if (this.page * this.pageSize < this.cards.length) {
      this.page++;
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
    }
  }

  savePosition() {
    localStorage.setItem('albumPage', this.page.toString());
    localStorage.setItem('albumScroll', window.scrollY.toString());
  }
}