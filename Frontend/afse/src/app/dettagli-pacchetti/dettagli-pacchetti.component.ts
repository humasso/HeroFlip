import { Component, OnInit } from '@angular/core';
import { Card } from '../models/card.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface PackInfo {
  name: string;
  image: string;
  description: string;
  publisher?: string;
}

@Component({
  selector: 'app-dettagli-pacchetti',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dettagli-pacchetti.component.html',
  styleUrl: './dettagli-pacchetti.component.css'
})
export class DettagliPacchettiComponent implements OnInit {
  pack!: PackInfo;
  heroes: Card[] = [];
  searchTerm = '';
  totalHeroes = 0;
  private readonly PACKS: Record<string, PackInfo> = {
    'Pacchetto Base': {
      name: 'Pacchetto Base',
      image: 'assets/pacchetto.png',
      description: 'Pacchetto base con carte di tutti gli eroi'
    },
    'Pacchetto Marvel': {
      name: 'Pacchetto Marvel',
      image: 'assets/pacchetto marvel.png',
      description: 'Pacchetto dedicato agli eroi Marvel',
      publisher: 'Marvel Comics'
    },
    'Pacchetto DC': {
      name: 'Pacchetto DC',
      image: 'assets/pacchetto dc.png',
      description: 'Pacchetto dedicato agli eroi DC',
      publisher: 'DC Comics'
    }
  };

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const name = this.route.snapshot.paramMap.get('name') || '';
    this.pack = this.PACKS[name] || { name, image: '', description: '' };
    this.loadHeroes();
  }

  private loadHeroes() {
    this.http.get<any[]>('assets/heroes.json').subscribe(data => {
      const filtered = data.filter(h => !this.pack.publisher || h.publisher === this.pack.publisher);
      this.heroes = filtered.map(h => ({
        heroId: h.id,
        name: h.name,
        image: h.image,
        publisher: h.publisher,
        powerstats: {} as any
      }));
      this.totalHeroes = this.heroes.length;
    });
  }


  get filteredHeroes(): Card[] {
    if (!this.searchTerm.trim()) { return this.heroes; }
    const term = this.searchTerm.toLowerCase();
    return this.heroes.filter(h => h.name.toLowerCase().includes(term));
  }
}