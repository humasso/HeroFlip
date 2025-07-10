import { Component, OnInit } from '@angular/core';
import { Card } from '../models/card.model';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  ngOnInit(): void {
    
  }

  constructor(private route: ActivatedRoute) {}


  get filteredHeroes(): Card[] {
    if (!this.searchTerm.trim()) { return this.heroes; }
    const term = this.searchTerm.toLowerCase();
    return this.heroes.filter(h => h.name.toLowerCase().includes(term));
  }
}
