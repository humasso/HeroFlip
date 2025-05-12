import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        // Login avvenuto con successo
        this.router.navigate(['/dashboard']);  // naviga alla pagina protetta (es. dashboard)
      },
      error: (err: any) => {
        // Gestione dell'errore (ad es. credenziali errate)
        console.error('Errore login', err);
        this.errorMessage = 'Credenziali non valide. Riprova.';
      }
    });
  }
}