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

  constructor() {}

  buyPacks(userId: string, packType: string, qty: number, cost: number): Observable<{message: string; credits: number; packs: UserPack[]}> {
    return this.http.post<{message: string; credits: number; packs: UserPack[]}>(
      `${this.apiUrl}/packs/${userId}`,
      { packType, qty, cost }
    );
  }
   openPacks(userId: string, packType: string, qty: number): Observable<{message: string; packs: UserPack[]}> {
    return this.http.post<{message: string; packs: UserPack[]}>(
      `${this.apiUrl}/open/${userId}`,
      { packType, qty }
    );
  }

  addCardsToAlbum(userId: string, cards: any[]): Observable<any> {
    return this.http.post(`${this.albumUrl}/add/${userId}`, { cards });
  }
}
