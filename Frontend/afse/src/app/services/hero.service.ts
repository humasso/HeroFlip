import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Card } from '../models/card.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class HeroService {
  private http = inject(HttpClient);
  private baseUrl = environment.superheroApi;

  getHero(id: number): Observable<Card> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(hero => ({
        heroId: hero.id,
        name: hero.name,
        image: hero.image?.url,
        publisher: hero.biography?.publisher || 'unknown',
        powerstats: hero.powerstats,
      }))
    );
  }

  getFullHero(id: number): Observable<Card & {
    biography: any;
    appearance: any;
    work: any;
    connections: any;
  }> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(hero => ({
        heroId: hero.id,
        name: hero.name,
        image: hero.image?.url,
        publisher: hero.biography?.publisher || 'unknown',
        powerstats: hero.powerstats,
        biography: hero.biography,
        appearance: hero.appearance,
        work: hero.work,
        connections: hero.connections
      }))
    );
  }
}