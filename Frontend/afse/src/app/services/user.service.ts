import { inject, Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient)
  private apiUrl = 'http://localhost:3000/user';

  constructor() { }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }
  
  /*
  updateUser(id: string, data: Partial<User & { password?: string }>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, data);
  }
  */
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}