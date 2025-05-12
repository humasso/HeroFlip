import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.authService.register({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: () => {
        // Registrazione completata
        this.successMessage = 'Registrazione effettuata! Ora puoi accedere.';
        // Reindirizza al login dopo un breve ritardo, ad esempio
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err) => {
        console.error('Errore registrazione', err);
        if (err.status === 400) {
          this.errorMessage = 'Email già in uso. Prova con un altro indirizzo.';
        } else {
          this.errorMessage = 'Errore durante la registrazione. Riprova.';
        }
      }
    });
  }
}
