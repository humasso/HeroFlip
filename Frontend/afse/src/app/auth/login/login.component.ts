import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, RouterModule, NgIf],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';

  errorMessage: string | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  login() {
    const payload = {
      username:  this.username,
      password: this.password
    };

    this.errorMessage = null; 

    this.authService.login(payload).subscribe({
      next: res => {
        //console.log('Login riuscito:', res);
        localStorage.setItem('userid', JSON.stringify(res));
        //console.log('ID utente salvato in localStorage:', localStorage.getItem('userid'));
        this.router.navigate(['/']);
      },
      error: err => {
        console.error('Errore login:', err);
        if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = err.error || 'Si è verificato un errore durante il login.';
        }
      }
    });
  }
}
