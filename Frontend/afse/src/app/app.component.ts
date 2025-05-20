import { Component,OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, NgbDropdownModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'afse';

  isLoggedIn = false;
  username: string | null = null;

  constructor(private auth: AuthService) {}


  ngOnInit(): void {
    console.log('Is logged in:', this.isLoggedIn);
    this.username = 'palle';
    this.auth.loggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
    //this.username = localStorage.getItem('username');
  }

  logout() {
    this.auth.logout();
  }
}
