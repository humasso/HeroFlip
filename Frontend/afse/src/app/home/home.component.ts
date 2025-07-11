import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { HeroService } from '../services/hero.service';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;
  logoTransform = 'perspective(600px)';

  username: string | null = null;
  avatar: string | null = null;
  credits = 0;
  packCount = 0;
  cardCount = 0;
  searchTerm = '';
  heroResults: { id: number; name: string }[] = [];

  constructor(
    private auth: AuthService,
    private userService: UserService,
    private albumService: AlbumService,
    private heroService: HeroService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.avatar$.subscribe(av => this.avatar = av);
    this.auth.loggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      if (status) {
        const userId = localStorage.getItem('userId');
        if (!userId) { return; }
        this.userService.getUser(userId).subscribe(user => {
          this.username = user.username;
          this.userService.setAvatar(user.avatar);
          this.credits = user.credits;
          this.packCount = (user.packs ?? []).reduce((sum, p) => sum + p.quantity, 0);
        });
        this.albumService.getAlbum(userId).subscribe(album => {
          this.cardCount = album.cards.length;
        });
      } else {
        this.username = null;
        this.userService.setAvatar(null);
        this.credits = 0;
        this.packCount = 0;
        this.cardCount = 0;
      }
    });
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

  searchHero() {
    if (!this.searchTerm.trim()) {
      this.heroResults = [];
      return;
    }
    this.heroService.searchHeroes(this.searchTerm).subscribe(res => this.heroResults = res);
  }

  goToHero(id: number) {
    this.router.navigate(['/album/hero', id]);
    this.searchTerm = '';
    this.heroResults = [];
  }
}