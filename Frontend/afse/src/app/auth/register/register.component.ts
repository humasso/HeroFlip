import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService, RegisterRequest } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterModule],
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
    this.authService.register(payload).subscribe({
      next: res => {
        console.log('Registrazione riuscita:', res);
        this.router.navigate(['/login']);
      },
      error: err => {
        console.error('Errore registrazione:', err);
      }
    });
  }
}
