import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, RouterModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private router: Router, private authService: AuthService) {}

  login() {
    const payload = {
      username: this.username,
      password: this.password
    };
    this.authService.login(payload).subscribe({
      next: res => {
        console.log('Login riuscito:', res);
        this.router.navigate(['/']);
      },
      error: err => {
        console.error('Errore login:', err);
      }
    });
  }
}
