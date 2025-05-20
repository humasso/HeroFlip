import { CommonModule} from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  imports: [NgbDropdownModule, CommonModule, RouterOutlet, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;
  username: string | null = null;

  ngOnInit(): void {
    const userId = localStorage.getItem('userid');
    console.log('User ID:', userId);
    console.log('Is logged in:', this.isLoggedIn);
    //this.isLoggedIn = !!userId;
    //this.username = localStorage.getItem('username');
  }
}
