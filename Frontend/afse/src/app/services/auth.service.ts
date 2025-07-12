import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RegisterRequest, RegisterResponse } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient)
  private apiUrl = `${environment.backendApi}/auth`;

  // 1) BehaviorSubject per tenere lo stato di login
  private loggedInSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('userId'));
  public loggedIn$ = this.loggedInSubject.asObservable();

  constructor() {}

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, data); 
  }

   login(credentials: { username: string; password: string }): Observable<{ userid?: string; admin?: boolean }> {
    return this.http
      .post<{ userid?: string; admin?: boolean }>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(res => {
          if (res.admin) {
            localStorage.setItem('isAdmin', 'true');
            localStorage.setItem('userId', 'admin');
          } else if (res.userid) {
            localStorage.removeItem('isAdmin');
            localStorage.setItem('userId', res.userid);
          }
          this.loggedInSubject.next(true);
        })
      );
  }

  logout(): void {
    // 4) rimuovi e notifichi
    localStorage.removeItem('userId');
    localStorage.removeItem('isAdmin');
    this.loggedInSubject.next(false);
  }

  /** Facoltativo: getter sincrono */
  get isLoggedIn(): boolean {
    return this.loggedInSubject.value;
  }

}
