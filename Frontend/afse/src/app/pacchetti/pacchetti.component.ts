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
  cardTransforms: string[] = [];

  private userId = localStorage.getItem('userid')?.split('"')[3];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    if (this.userId) {
      this.userService.getUser(this.userId).subscribe({
        next: user => {
          this.packs = user.packs ?? [];
          this.cardTransforms = new Array(this.packs.length).fill('perspective(600px)');
        },
        error: () => {
          this.packs = [];
          this.cardTransforms = [];
        }
      });
    }
  }
  onMouseEnter(i: number) {
    this.cardTransforms[i] = 'perspective(600px) scale(1.05)';
  }

  onMouseMove(event: MouseEvent, i: number) {
    const card = event.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateX = -((y - rect.height / 2) / rect.height) * 10;
    const rotateY = ((x - rect.width / 2) / rect.width) * 10;
    this.cardTransforms[i] = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  }

  onMouseLeave(i: number) {
    this.cardTransforms[i] = 'perspective(600px)';
  }
}
