import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserPack } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class PacchettiService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/shop';
  private albumUrl = 'http://localhost:3000/album';
  private heroUrl = 'http://localhost:3000/hero';

  constructor() {}

  buyPacks(userId: string, packType: string, qty: number, cost: number): Observable<{message: string; credits: number; packs: UserPack[]}> {
    return this.http.post<{message: string; credits: number; packs: UserPack[]}>(
      `${this.apiUrl}/packs/${userId}`,
      { packType, qty, cost }
    );
  }
  openPack(userId: string, packType: string): Observable<{ids: number[]; packs: UserPack[]}> {
    return this.http.post<{ids: number[]; packs: UserPack[]}>(
      `${this.heroUrl}/open/${userId}`,
      { packType }
    );
  }

  addCardsToAlbum(userId: string, cards: any[]): Observable<any> {
    return this.http.post(`${this.albumUrl}/add/${userId}`, { cards });
  }
}
