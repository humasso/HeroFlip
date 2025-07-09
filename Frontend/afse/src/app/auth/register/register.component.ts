import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/user.model';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { HeroService } from '../../services/hero.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink, RouterModule, NgIf, CommonModule],
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
  confirmPassword = '';
  favoriteHero = '';
  heroOptions: { id: number; name: string }[] = [];

  errorMessage: string | null = null;

  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private heroService: HeroService
  ) {}

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  toggleShowConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  searchHero() {
    if (!this.favoriteHero.trim()) {
      this.heroOptions = [];
      return;
    }
    this.heroService.searchHeroes(this.favoriteHero).subscribe(options => this.heroOptions = options);
  }

  selectHero(name: string) {
    this.favoriteHero = name;
    this.heroOptions = [];
  }


  register() {
    const payload: RegisterRequest = {
      username: this.username,
      name: this.name,
      surname: this.surname,
      email: this.email,
      password: this.password,
      favoriteHero: this.favoriteHero,
      avatar: `https://robohash.org/${this.username}.png?set=set4`
    };

    this.errorMessage = null;

    // controllo che le due password coincidano
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Le password non coincidono';
      return;
    }

    // Richiesta di registrazione
    this.authService.register(payload).subscribe({
      next: res => {
        console.log('Registrazione riuscita:', res);
        this.router.navigate(['/login']);
      },
      error: err => {
        console.error('Errore registrazione:', err);
        if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = err.error || 'Si è verificato un errore durante la registrazione.';
        }
      }
    });
  }
}
