import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfacce per la richiesta e risposta di registrazione
export interface RegisterRequest {
  username: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  favoriteHero: string;
}

export interface RegisterResponse {
  message: string;
  userId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient)
  private apiUrl = 'http://localhost:3000/auth';

  constructor() {}

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, data);
  }
}
