import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeroService } from '../services/hero.service';
import { AlbumService } from '../services/album.service';
import { Card } from '../models/card.model';

@Component({
  selector: 'app-dettagli-eroe',
  imports: [],
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

  goBack() {
    this.location.back();
  }
}
