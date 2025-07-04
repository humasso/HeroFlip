import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PurchaseResponse } from '../models/shop.model';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/shop';
  
  constructor() { }

  purchaseCredits(userId: string, credits: number): Observable<PurchaseResponse> {
    return this.http.post<PurchaseResponse>(
      `${this.apiUrl}/credits/${userId}`,
      { credits }
    );
  }
}
