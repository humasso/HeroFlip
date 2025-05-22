import { Component,OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';
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
  credits = 0;

  constructor(private auth: AuthService, private userService: UserService) {}


  ngOnInit(): void {
    console.log('Is logged in:', this.isLoggedIn);
    
    this.auth.loggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });

    const userId = localStorage.getItem('userid')?.split('"')[3];
    if (userId) {
      this.userService.getUser(userId).subscribe(user => {
        this.username = user.username;
        //this.credits = user.credits;
      });
    }
  }

  logout() {
    this.auth.logout();
  }
}
