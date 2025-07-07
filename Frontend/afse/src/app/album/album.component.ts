+37
-3

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlbumService } from '../services/album.service';
import { Card } from '../models/card.model';

@Component({
  selector: 'app-album',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './album.component.html',
  styleUrl: './album.component.css'
})
export class AlbumComponent implements OnInit {
  cards: Card[] = [];
  page = 1;
  readonly pageSize = 20;

  constructor(private albumService: AlbumService) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) { return; }
    this.albumService.getAlbum(userId).subscribe({
      next: album => this.cards = album.cards || [],
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
}