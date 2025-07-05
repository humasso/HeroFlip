import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbCarouselModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-shopdash',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    NgbCarouselModule
  ],
  templateUrl: './shopdash.component.html',
  styleUrl: './shopdash.component.css'
})
export class ShopdashComponent implements OnInit {
   @ViewChild('packModal') packModal!: TemplateRef<any>;
  credits = 0;
  packs = [
    { name: 'Pacchetto Base', image: 'assets/pachetto.png', price: 5 }
  ];

  selectedQty: number | null = null;
  selectedPack: { name: string; image: string; price: number } | null = null;

  private userId = localStorage.getItem('userid')?.split('"')[3];

  constructor(
    private userService: UserService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.userId) {
      this.userService.getUser(this.userId).subscribe({
        next: user => this.credits = user.credits,
        error: () => {}
      });
    }
  }

  openPack(pack: { name: string; image: string; price: number }) {
    this.selectedPack = pack;
    this.selectedQty = null;
    this.modalService.open(this.packModal, { centered: true });
  }

  confirmPurchase(modalRef: any) {
    const qty = this.selectedQty || 1;
    alert(`Hai acquistato ${qty} pacchetto${qty > 1 ? 'i' : ''}!`);
    modalRef.close();
  }

  goToCredits() {
    this.router.navigate(['/shop/credits']);
  }
}