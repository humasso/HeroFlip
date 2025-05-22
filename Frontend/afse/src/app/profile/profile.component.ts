import { Component, OnInit, TemplateRef, ViewChild }           from '@angular/core';
import { CommonModule }                from '@angular/common';
import { ReactiveFormsModule }         from '@angular/forms';
import { Router }                      from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserService }                 from '../services/user.service';
import { AuthService }                 from '../services/auth.service';
import { User }                        from '../models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ProfileComponent implements OnInit {

  @ViewChild('loadingTpl', { static: true }) loadingTpl!: TemplateRef<any>;


  // $2b$10$EX8F/V/9tFyPEsmv5QuNbuhggVLJdnLcBS68HlojP1A1gPzbEqUQu
  // 

  user!: User;
  editForm!: FormGroup;
  editingField: 'username' | 'password' | 'favoriteHero' | null = null;
  loading = false;
  errorMsg = '';
  temp = 300; 

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService
  ) {}

  private userId = localStorage.getItem('userid')?.split('"')[3];

  ngOnInit(): void {
    if (!this.userId) {
      this.router.navigate(['/login']);
      return;
    }
    this.userService.getUser(this.userId).subscribe({
      next: user => {
        this.user = user;
        this.initForm();
      },
      error: () => this.errorMsg = 'Impossibile caricare i dati.'
    });
  }

  private initForm() {
    this.editForm = this.fb.group({
      username: [this.user.username, [Validators.required, Validators.minLength(3)]],
      oldPassword: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.minLength(6)]],
      favoriteHero: [this.user.favoriteHero, Validators.required]
    });
  }

  startEdit(field: 'username' | 'password' | 'favoriteHero') {
    this.editingField = field;
    if (field === 'password') {
    // reset di entrambi i campi sulla password
    this.editForm.patchValue({ oldPassword: '', password: '' });
    } else {
      const value = this.user[field] || '';
      this.editForm.get(field)!.setValue(value);
    }
  }

  cancelEdit() {
    this.editingField = null;
    this.editForm.reset({
      username: this.user.username,
      password: '',
      favoriteHero: this.user.favoriteHero
    });
  }

  saveField(field: 'username' | 'password' | 'favoriteHero') {
    if (this.editForm.get(field)!.invalid) { return; }
    this.loading = true;

    // Caso Password
    if (field === 'password') {
      console.log('user', this.user);
      this.userService.updatePassword(this.user._id, this.editForm.value.oldPassword, this.editForm.value.password).subscribe({
        next: response => {
          console.log('response', response);
          this.user.password = this.editForm.value.password;
          this.editingField = null;
          this.loading = false;
          this.errorMsg = '';
          alert('Password aggiornata con successo.');
        },
        error: error => {
          this.errorMsg =  error.error.message || 'Errore durante l\'aggiornamento della password.';
          this.loading = false;
        }
      });
    }

    // Caso Usarname
    if (field === 'username') {
      if (this.editForm.value.username === this.user.username) {
        this.editingField = null;
        this.loading = false;
        alert('Username aggiornato con successo.');
        return;
      }
      this.userService.updateUsername(this.user._id, this.editForm.value.username).subscribe({
        next: response => {
          this.user.username = this.editForm.value.username;
          this.editingField = null;
          this.loading = false;
          this.errorMsg = '';
          alert('Username aggiornato con successo.');
        },
        error: error => {
          this.errorMsg =  error.error.message || 'Errore durante l\'aggiornamento dello username.';
          this.loading = false;
        }
      });
    }

  }

  deleteProfile() {
    if (!confirm('Sei sicuro di voler eliminare definitivamente il tuo profilo?')) { return; }
    this.userService.deleteUser(this.user._id).subscribe({
      next: () => {
        this.auth.logout();
        this.router.navigate(['/']);
        alert('Profilo eliminato con successo.');
      },
      error: () => this.errorMsg = 'Errore durante la cancellazione.'
    });
  }

  goToShop() {
    this.router.navigate(['/shop']);
  }
}
