import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Card } from '../models/card.model';
import { environment } from '../../environments/environment';

export interface Album {
  user: string;
  cards: Card[];
}

@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  private http = inject(HttpClient);
  private albumUrl = `${environment.backendApi}/album`;

  getAlbum(userId: string): Observable<Album> {
    return this.http.get<Album>(`${this.albumUrl}/${userId}`);
  }

  addCards(userId: string, cards: Card[]): Observable<Album> {
    return this.http.post<Album>(`${this.albumUrl}/add/${userId}`, { cards });
  }
}