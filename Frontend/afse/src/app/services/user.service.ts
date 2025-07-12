import { inject, Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient)
  private apiUrl = `${environment.backendApi}/user`;

  private avatarSubject = new BehaviorSubject<string | null>(null);
  avatar$ = this.avatarSubject.asObservable();

  constructor() { }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  updateFavoriteHero(id: string, favoriteHero: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/favoritehero/${id}`, { favoriteHero });
  }

  updatePassword(id: string, oldPassword: string, newPassword: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/pass/${id}`, { oldPassword, newPassword });
  }

  updateUsername(id: string, username: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/username/${id}`, { username });
  }

  updateAvatar(id: string, avatar: string): Observable<{ message: string }> {
    return this.http
      .put<{ message: string }>(`${this.apiUrl}/avatar/${id}`, { avatar })
      .pipe(tap(() => this.avatarSubject.next(avatar)));
  }

  setAvatar(avatar: string | null) {
    this.avatarSubject.next(avatar);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Metodi per amministratore
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.backendApi}/admin/users`);
  }

  updateCreditsAdmin(id: string, amount: number): Observable<User> {
    return this.http.patch<User>(`${environment.backendApi}/admin/credits/${id}`, { amount });
  }

  updatePacksAdmin(id: string, packType: string, qty: number) {
    return this.http.patch(`${environment.backendApi}/admin/packs/${id}`, { packType, qty });
  }

  setPasswordAdmin(id: string, password: string) {
    return this.http.put(`${environment.backendApi}/admin/password/${id}`, { password });
  }

}