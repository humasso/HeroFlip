import { Component, OnInit } from '@angular/core';
import { Card } from '../models/card.model';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import heroesData from '../../../public/assets/heroes.json';

interface PackInfo {
  name: string;
  image: string;
  description: string;
  publisher?: string;
}

@Component({
  selector: 'app-dettagli-pacchetti',
  imports: [CommonModule],
  templateUrl: './dettagli-pacchetti.component.html',
  styleUrl: './dettagli-pacchetti.component.css'
})
export class DettagliPacchettiComponent implements OnInit {
  pack!: PackInfo;
  heroes: Card[] = [];
  searchTerm = '';
  totalHeroes = 0;

  packs: Record<string, PackInfo> = {
    'Pacchetto Base': { name: 'Pacchetto Base', image: 'assets/pacchetto.png', description: 'Pacchetto con eroi misti.' },
    'Pacchetto Marvel': { name: 'Pacchetto Marvel', image: 'assets/pacchetto marvel.png', description: 'Solo eroi Marvel.', publisher: 'Marvel Comics' },
    'Pacchetto DC': { name: 'Pacchetto DC', image: 'assets/pacchetto dc.png', description: 'Solo eroi DC.', publisher: 'DC Comics' }
  };

  ngOnInit(): void {
    const name = this.route.snapshot.paramMap.get('name');
    if (name && this.packs[name]) {
      this.pack = this.packs[name];
      this.loadHeroes();
    }
  }

  constructor(private route: ActivatedRoute) {}

  loadHeroes() {
    const all = (heroesData as any[]).map(h => ({ heroId: h.id, name: h.name, image: h.image, publisher: h.publisher }));
    this.heroes = all.filter(h => !this.pack.publisher || h.publisher === this.pack.publisher);
    this.totalHeroes = this.heroes.length;
  }

  get filteredHeroes(): Card[] {
    if (!this.searchTerm.trim()) { return this.heroes; }
    const term = this.searchTerm.toLowerCase();
    return this.heroes.filter(h => h.name.toLowerCase().includes(term));
  }
}
