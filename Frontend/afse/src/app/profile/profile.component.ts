import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, NgIf, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user!: User;
  editForm!: FormGroup;
  editing = false;
  loading = false;
  errorMsg = '';

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService
  ) {}

  userId = localStorage.getItem('userid')?.split('"')[3];

  ngOnInit(): void {

    if (!this.userId) {
      this.router.navigate(['/login']);
      return;
    }
    console.log('User ID:', this.userId);
    this.userService.getUser(this.userId).subscribe({
      next: user => {
        this.user = user;
        this.initForm();
      },
      error: err => this.errorMsg = 'Impossibile caricare i dati.'
    });
  }

  initForm() {
    this.editForm = this.fb.group({
      username: [this.user.username, [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.minLength(6)]]
    });
  }

  toggleEdit() {
    this.editing = !this.editing;
    if (!this.editing) this.editForm.reset({ username: this.user.username, password: '' });
  }

  onSubmit() {
    if (this.editForm.invalid) return;
    this.loading = true;
    const { username, password } = this.editForm.value;
    const updateData: any = { username };
    if (password) updateData.password = password;
  }

  onDelete() {
    if (!confirm('Sei sicuro di voler eliminare definitivamente il tuo profilo?')) return;
    if (!this.userId) {
      this.router.navigate(['/login']);
      return;
    }
    this.userService.deleteUser(this.userId).subscribe({
      next: () => {
        this.router.navigate(['/']);
        alert('Profilo eliminato con successo.');
        this.auth.logout();
      },
      error: () => this.errorMsg = 'Errore durante la cancellazione.'
    });
  }
}
