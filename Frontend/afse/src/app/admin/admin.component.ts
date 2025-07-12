import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { AlbumService, Album } from '../services/album.service';
import { HeroService } from '../services/hero.service';
import { User, UserPack } from '../models/user.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  users: User[] = [];
  filtered: User[] = [];
  selected: User | null = null;
  searchTerm = '';
  album: Album | null = null;
  albumSearch = '';
  albumPage = 1;
  readonly albumPageSize = 20;
  creditAmount = 0;
  packType = '';
  packQty = 0;
  newPassword = '';
  heroSearch = '';
  heroResults: { id: number; name: string }[] = [];
  selectedHero: { heroId: string; name: string; image: string } | null = null;
  cardQty = 1;

  constructor(
    private userService: UserService,
    private albumService: AlbumService,
    private heroService: HeroService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe(u => {
      this.users = u;
      this.filter();
    });
  }

  filter() {
    const term = this.searchTerm.toLowerCase();
    this.filtered = this.users.filter(u => u.username.toLowerCase().includes(term));
  }

  selectUser(u: User) {
    this.selected = u;
    this.albumService.getAlbum(u._id).subscribe(a => {
      this.album = a;
      this.albumPage = 1;
      this.albumSearch = '';
    });
  }

  updateCredits() {
    if (!this.selected) return;
    this.userService.updateCreditsAdmin(this.selected._id, this.creditAmount).subscribe(user => {
      this.selected!.credits = user.credits;
      this.creditAmount = 0;
    });
  }

  updatePacks() {
    if (!this.selected) return;
    this.userService.updatePacksAdmin(this.selected._id, this.packType, this.packQty).subscribe(packs => {
      this.selected!.packs = packs as UserPack[];
      this.packQty = 0;
    });
  }

  changePassword() {
    if (!this.selected) return;
    this.userService.setPasswordAdmin(this.selected._id, this.newPassword).subscribe(() => {
      this.newPassword = '';
    });
  }

  searchHero() {
    if (!this.heroSearch.trim()) {
      this.heroResults = [];
      return;
    }
    this.heroService.searchHeroes(this.heroSearch).subscribe(res => this.heroResults = res);
  }

  selectHero(opt: { id: number; name: string }) {
    this.heroSearch = opt.name;
    this.heroResults = [];
    this.heroService.getHero(opt.id).subscribe(card => {
      this.selectedHero = {
        heroId: String(card.heroId),
        name: card.name,
        image: card.image
      };
    });
  }

  addCard() {
    if (!this.selected || !this.selectedHero || this.cardQty <= 0) return;
    const card = {
      heroId: this.selectedHero.heroId,
      name: this.selectedHero.name,
      image: this.selectedHero.image
    };
    const cards = Array(this.cardQty).fill(card);
    this.albumService.addCards(this.selected._id, cards).subscribe(a => {
      this.album = a;
      this.selectedHero = null;
      this.heroSearch = '';
      this.cardQty = 1;
    });
  }

  get filteredAlbumCards(): any[] {
    if (!this.album) return [];
    const term = this.albumSearch.toLowerCase();
    return this.album.cards.filter(c => c.name.toLowerCase().includes(term));
  }

  get albumTotalPages(): number {
    return Math.ceil(this.filteredAlbumCards.length / this.albumPageSize) || 1;
  }

  get pagedAlbumCards(): any[] {
    const start = (this.albumPage - 1) * this.albumPageSize;
    return this.filteredAlbumCards.slice(start, start + this.albumPageSize);
  }

  albumNextPage() {
    if (this.albumPage < this.albumTotalPages) {
      this.albumPage++;
    }
  }

  albumPrevPage() {
    if (this.albumPage > 1) {
      this.albumPage--;
    }
  }

  deleteSelectedUser() {
    if (!this.selected) return;
    if (!confirm('Sei sicuro di voler eliminare questo utente?')) return;
    const id = this.selected._id;
    this.userService.deleteUserAdmin(id).subscribe(() => {
      this.users = this.users.filter(u => u._id !== id);
      this.selected = null;
      this.filter();
    });
  }
}