import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { PacchettiService } from '../../services/pacchetti.service';
import { delay } from 'rxjs';

@Component({
  selector: 'app-shopdash',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './shopdash.component.html',
  styleUrl: './shopdash.component.css'
})
export class ShopdashComponent implements OnInit {
   @ViewChild('packModal') packModal!: TemplateRef<any>;
  credits = 0;
  packs = [
    { name: 'Pacchetto Base',   image: 'assets/pacchetto.png', price: 5 },
    { name: 'Pacchetto Marvel', image: 'assets/pacchetto marvel.png', price: 6 },
    { name: 'Pacchetto DC',     image: 'assets/pacchetto dc.png', price: 6 }
  ];

  packTransforms: string[] = this.packs.map(() => 'perspective(600px)');
  loading = false;
  toastMessage: string | null = null;
  toastType: 'success' | 'danger' = 'success';


  selectedQty: number | null = null;
  selectedPack: { name: string; image: string; price: number } | null = null;

  get totalCost(): number {
    return (this.selectedQty || 1) * (this.selectedPack?.price ?? 0);
  }

  private userId = localStorage.getItem('userId');

  constructor(
    private userService: UserService,
    private pacchettiService: PacchettiService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  onMouseEnter(index: number) {
    this.packTransforms[index] = 'perspective(600px) scale(1.05)';
  }

  onMouseMove(event: MouseEvent, index: number) {
    const card = event.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateX = -((y - rect.height / 2) / rect.height) * 10;
    const rotateY = ((x - rect.width / 2) / rect.width) * 10;
    this.packTransforms[index] = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  }

  onMouseLeave(index: number) {
    this.packTransforms[index] = 'perspective(600px)';
  }

  ngOnInit(): void {
    if (this.userId) {
      this.userService.getUser(this.userId).subscribe({
        next: user => this.credits = user.credits,
        error: () => {}
      });
    }
  }

  confirmPurchase(modalRef: any) {
    const qty = this.selectedQty || 1;
    if (!this.userId || !this.selectedPack) { return; }
    this.loading = true;
    this.pacchettiService.buyPacks(this.userId, this.selectedPack.name, qty, this.totalCost)
      .pipe(delay(2000))
      .subscribe({
        next: res => {
          this.loading = false;
          this.credits = res.credits;
          modalRef.close();
          this.toastType = 'success';
          this.toastMessage = res.message;
          setTimeout(() => this.toastMessage = null, 3000);
        },
        error: err => {
          this.loading = false;
          modalRef.close();
          this.toastType = 'danger';
          this.toastMessage = err.error?.message || 'Errore durante l\'acquisto.';
          setTimeout(() => this.toastMessage = null, 3000);
        }
      });
  }

  openPackBuy(pack: { name: string; image: string; price: number }) {
    this.selectedPack = pack;
    this.selectedQty = null;
    this.modalService.open(this.packModal, { centered: true });
  }

  goToCredits() {
    this.router.navigate(['/shop/credits']);
  }
}