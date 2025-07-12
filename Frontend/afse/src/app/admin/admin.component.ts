import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { AlbumService, Album } from '../services/album.service';
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
  creditAmount = 0;
  packType = '';
  packQty = 0;
  newPassword = '';
  cardHeroId = '';
  cardName = '';
  cardImage = '';

  constructor(private userService: UserService, private albumService: AlbumService) {}

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
    this.albumService.getAlbum(u._id).subscribe(a => this.album = a);
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

  addCard() {
    if (!this.selected) return;
    const card = { heroId: this.cardHeroId, name: this.cardName, image: this.cardImage };
    this.albumService.addCards(this.selected._id, [card]).subscribe(a => {
      this.album = a;
      this.cardHeroId = this.cardName = this.cardImage = '';
    });
  }
}