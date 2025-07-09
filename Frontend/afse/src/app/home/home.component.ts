import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;
  logoTransform = 'perspective(600px)';

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.loggedIn$.subscribe(status => (this.isLoggedIn = status));
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