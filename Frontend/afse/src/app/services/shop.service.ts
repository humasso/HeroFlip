import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PurchaseResponse } from '../models/shop.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.backendApi}/shop`;
  
  constructor() { }

  purchaseCredits(userId: string, credits: number): Observable<PurchaseResponse> {
    return this.http.post<PurchaseResponse>(
      `${this.apiUrl}/credits/${userId}`,
      { credits }
    );
  }
}
