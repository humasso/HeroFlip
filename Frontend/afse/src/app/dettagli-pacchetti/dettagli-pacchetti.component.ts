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

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const name = this.route.snapshot.paramMap.get('name') || '';
  }
}