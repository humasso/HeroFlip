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
  logoTransform = 'perspective(600px)';

  constructor(private auth: AuthService, private userService: UserService, private router: Router) {}


  ngOnInit(): void {
    this.username = null;
    const savedTheme = localStorage.getItem('isDarkMode');
    this.isDarkMode = savedTheme === 'true';
    document.body.setAttribute('data-bs-theme', this.isDarkMode ? 'dark' : 'light');
    this.auth.loggedIn$.subscribe(status => {
      this.isLoggedIn = status;

      if (status) {
        const userId = localStorage.getItem('userId');
        if (userId) {
          this.userService.getUser(userId).subscribe(user => {
            this.username = user.username;
            this.avatar = user.avatar;
            // this.credits = user.credits;
          });
        }
      } else {
        this.username = null;
        this.avatar = null;
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
    this.avatar = null;
    this.credits = 0;

    this.router.navigate(['/login']);
  }

  onMouseEnter() {
    this.logoTransform = 'perspective(600px) scale(1.05)';
  }

  onMouseMove(event: MouseEvent) {
    const el = event.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateX = -((y - rect.height / 2) / rect.height) * 10;
    const rotateY = ((x - rect.width / 2) / rect.width) * 10;
    this.logoTransform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  }

  onMouseLeave() {
    this.logoTransform = 'perspective(600px)';
  }
}
