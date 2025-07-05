import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { UserPack } from '../models/user.model';

@Component({
  selector: 'app-pacchetti',
  imports: [CommonModule],
  templateUrl: './pacchetti.component.html',
  styleUrl: './pacchetti.component.css'
})
export class PacchettiComponent implements OnInit {
  packs: UserPack[] = [];

  private userId = localStorage.getItem('userid')?.split('"')[3];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    if (this.userId) {
      this.userService.getUser(this.userId).subscribe({
        next: user => this.packs = user.packs ?? [],
        error: () => this.packs = []
      });
    }
  }
}
