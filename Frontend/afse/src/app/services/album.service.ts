import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Card } from '../models/card.model';

export interface Album {
  user: string;
  cards: Card[];
}

@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  private http = inject(HttpClient);
  private albumUrl = 'http://localhost:3000/album';

  getAlbum(userId: string): Observable<Album> {
    return this.http.get<Album>(`${this.albumUrl}/${userId}`);
  }
}