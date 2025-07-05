import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-shopdash',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './shopdash.component.html',
  styleUrl: './shopdash.component.css'
})
export class ShopdashComponent implements OnInit {
  credits = 0;
  packOptions = Array.from({ length: 10 }, (_, i) => i + 1);

  private userId = localStorage.getItem('userid')?.split('"')[3];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    if (this.userId) {
      this.userService.getUser(this.userId).subscribe({
        next: user => this.credits = user.credits, 
        error: () => {}
      });
    }
  }

  buyPacks(qty: number) {
    alert(`Hai acquistato ${qty} pacchetto${qty > 1 ? 'i' : ''}!`);
  }
}