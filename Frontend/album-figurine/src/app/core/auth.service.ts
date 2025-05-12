import { Injectable } from '@angular/core';
import { HttpClient }    from '@angular/common/http';
import { tap }           from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = 'http://localhost:3000/api/auth';
  constructor(private http: HttpClient) {}

  register(data: any) {
    return this.http.post(`${this.api}/register`, data);
  }

  login(creds: any) {
    return this.http.post<{ token: string }>(`${this.api}/login`, creds)
      .pipe(tap(res => localStorage.setItem('token', res.token)));
  }

  logout() { localStorage.removeItem('token'); }
  getToken(): string | null { return localStorage.getItem('token'); }
  isLoggedIn(): boolean { return !!this.getToken(); }
}