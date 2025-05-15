import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService, RegisterRequest } from '../../services/auth.service';
import { NgIf } from '@angular/common';  

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterModule, NgIf],
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username = '';
  name = '';
  surname = '';
  email = '';
  password = '';
  favoriteHero = '';

  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register() {
    const payload: RegisterRequest = {
      username: this.username,
      name: this.name,
      surname: this.surname,
      email: this.email,
      password: this.password,
      favoriteHero: this.favoriteHero
    };

    this.errorMessage = null; 
    this.authService.register(payload).subscribe({
      next: res => {
        console.log('Registrazione riuscita:', res);
        this.router.navigate(['/login']);
      },
      error: err => {
        //console.error('Errore registrazione:', err);
        if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = err.error || 'Si è verificato un errore durante la registrazione.';
        }
      }
    });
  }
}
