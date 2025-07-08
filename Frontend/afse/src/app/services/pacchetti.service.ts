import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserPack } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PacchettiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.backendApi}/shop`;
  private albumUrl = `${environment.backendApi}/album`;
  private heroUrl = `${environment.backendApi}/hero`;

  constructor() {}

  buyPacks(userId: string, packType: string, qty: number, cost: number): Observable<{message: string; credits: number; packs: UserPack[]}> {
    return this.http.post<{message: string; credits: number; packs: UserPack[]}>(
      `${this.apiUrl}/packs/${userId}`,
      { packType, qty, cost }
    );
  }
  
  openPack(userId: string, packType: string): Observable<{ids: number[]; heroes: any[]; packs: UserPack[]}> {
    return this.http.post<{ids: number[]; heroes: any[]; packs: UserPack[]}>(
      `${this.heroUrl}/open/${userId}`,
      { packType }
    );
  }

  addCardsToAlbum(userId: string, cards: any[]): Observable<any> {
    return this.http.post(`${this.albumUrl}/add/${userId}`, { cards });
  }
}
