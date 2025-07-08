import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HeroService } from '../services/hero.service';
import { AlbumService } from '../services/album.service';
import { Card, Powerstats } from '../models/card.model';

@Component({
  selector: 'app-dettagli-eroe',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dettagli-eroe.component.html',
  styleUrl: './dettagli-eroe.component.css'
})
export class DettagliEroeComponent {
  heroId!: number;
  card!: Card & {
    biography?: any;
    appearance?: any;
    work?: any;
    connections?: any;
    quantity: number;
  };
  loading = true;
  statKeys: (keyof Powerstats)[] = ['intelligence','strength','speed','durability','power','combat'];

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private albumService: AlbumService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.heroId = +(this.route.snapshot.paramMap.get('id') || 0);
    this.loadHero();
  }

  loadHero() {
    const userId = localStorage.getItem('userId');
    if (!userId) { return; }
    this.heroService.getFullHero(this.heroId).subscribe(hero => {
      this.albumService.getAlbum(userId).subscribe(album => {
        const owned = album.cards.find(c => +c.heroId === this.heroId)?.quantity || 0;
        this.card = { ...hero, quantity: owned } as any;
        this.loading = false;
      });
    });
  }

  statValue(value: string): number | null {
    const num = parseInt(value, 10);
    return isNaN(num) ? null : num;
  }

  statColor(stat: keyof Powerstats): string {
    const colors: Record<keyof Powerstats, string> = {
      intelligence: '#0d6efd',
      strength: '#dc3545',
      speed: '#ffc107',
      durability: '#fd7e14',
      power: '#6f42c1',
      combat: '#198754'
    };
    return colors[stat];
  }

  filteredEntries(section: any): { key: string; value: string }[] {
    if (!section) { return []; }

    return Object.entries(section)
      .map(([key, value]) => {
        const val = Array.isArray(value) ? value.join(', ') : String(value).trim();
        return { key, value: val };
      })
      .filter(({ value }) => {
        if (!value) { return false; }
        const lower = value.toLowerCase();
        return lower !== '-' && lower !== 'unknown' && lower !== 'null' && lower !== '0';
      });
  }


  goBack() {
    this.location.back();
  }
}
