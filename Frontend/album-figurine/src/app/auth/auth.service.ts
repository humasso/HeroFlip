// src/app/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:3000/api/auth';  // URL base delle API di autenticazione

  constructor(private http: HttpClient) { }

  // Richiede al backend di autenticare le credenziali e restituisce un Observable con la risposta
  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response.token) {
          // Salva il token JWT nel localStorage per usarlo nelle successive richieste
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  // Registra un nuovo utente
  register(data: { name: string, email: string, password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  // Logout: rimuove il token salvato
  logout(): void {
    localStorage.removeItem('token');
  }

  // Controlla se l'utente è attualmente loggato (token presente e non scaduto)
  isLoggedIn(): boolean {
    return localStorage.getItem('token') != null;
  }

  // Opzionale: ottiene il token (per usarlo, ad esempio, in un HttpInterceptor)
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
