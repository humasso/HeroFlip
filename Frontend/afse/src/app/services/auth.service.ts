import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RegisterRequest, RegisterResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient)
  private apiUrl = 'http://localhost:3000/auth';

  // 1) BehaviorSubject per tenere lo stato di login
  private loggedInSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('userId'));
  public loggedIn$ = this.loggedInSubject.asObservable();

  constructor() {}

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, data); 
  }

  login(credentials: { username: string; password: string }): Observable<{ userid: string }> {
    return this.http
      .post<{ userid: string }>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(res => {
          // 2) salva su localStorage
          localStorage.setItem('userId', res.userid);
          // 3) notifichi tutti gli subscriber
          this.loggedInSubject.next(true);
        })
      );
  }

  logout(): void {
    // 4) rimuovi e notifichi
    localStorage.removeItem('userId');
    this.loggedInSubject.next(false);
  }

  /** Facoltativo: getter sincrono */
  get isLoggedIn(): boolean {
    return this.loggedInSubject.value;
  }

}
