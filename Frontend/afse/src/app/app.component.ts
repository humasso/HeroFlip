import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

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
  avatar: string | null = null;
  credits = 0;
  isDarkMode = false;
  isAdmin = false;

  constructor(private auth: AuthService, private userService: UserService, public router: Router) {}

  ngOnInit(): void {
    this.username = null;
    const savedTheme = localStorage.getItem('isDarkMode');
    this.isDarkMode = savedTheme === 'true';
    this.isAdmin = localStorage.getItem('isAdmin') === 'true';
    document.body.setAttribute('data-bs-theme', this.isDarkMode ? 'dark' : 'light');
    this.userService.avatar$.subscribe(av => this.avatar = av);

    this.auth.loggedIn$.subscribe(status => {
      this.isLoggedIn = status;

      if (status) {
        const userId = localStorage.getItem('userId');
        if (userId) {
          this.userService.getUser(userId).subscribe(user => {
            this.username = user.username;
            this.userService.setAvatar(user.avatar);
            // this.credits = user.credits;
          });
        }
      } else {
        this.username = null;
        this.userService.setAvatar(null);
        this.credits = 0;
      }
    });
  }
  
  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    document.body.setAttribute('data-bs-theme', this.isDarkMode ? 'dark' : 'light');
    localStorage.setItem('isDarkMode', this.isDarkMode ? 'true' : 'false');
  }

  logout() {
    this.auth.logout();
    this.isLoggedIn = false;
    this.username = null;
    this.userService.setAvatar(null);
    this.credits = 0;
    this.isAdmin = false;
    
    // Reset dark mode al logout
    this.isDarkMode = false;
    document.body.setAttribute('data-bs-theme', 'light');
    localStorage.setItem('isDarkMode', 'false');

    this.router.navigate(['/login']);
  }
}