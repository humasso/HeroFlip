import { inject, Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient)
  private apiUrl = `${environment.backendApi}/user`;

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
    return this.http.put<{ message: string }>(`${this.apiUrl}/avatar/${id}`, { avatar });
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}