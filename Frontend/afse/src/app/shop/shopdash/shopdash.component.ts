import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { PacchettiService } from '../../services/pacchetti.service';

@Component({
  selector: 'app-shopdash',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
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

  cardTransform = 'perspective(600px)';

  selectedQty: number | null = null;
  selectedPack: { name: string; image: string; price: number } | null = null;

  get totalCost(): number {
    return (this.selectedQty || 1) * (this.selectedPack?.price ?? 0);
  }

  private userId = localStorage.getItem('userid')?.split('"')[3];

  constructor(
    private userService: UserService,
    private pacchettiService: PacchettiService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  onMouseEnter() {
    this.cardTransform = 'perspective(600px) scale(1.05)';
  }

  onMouseMove(event: MouseEvent) {
    const card = event.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateX = -((y - rect.height / 2) / rect.height) * 10;
    const rotateY = ((x - rect.width / 2) / rect.width) * 10;
    this.cardTransform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  }

  onMouseLeave() {
    this.cardTransform = 'perspective(600px)';
  }

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
    if (!this.userId || !this.selectedPack) { return; }
    this.pacchettiService.buyPacks(this.userId, this.selectedPack.name, qty, this.totalCost)
      .subscribe({
        next: res => {
          this.credits = res.credits;
          modalRef.close();
          alert(res.message);
        },
        error: () => {
          modalRef.close();
          alert('Errore durante l\'acquisto.');
        }
      });
  }

  goToCredits() {
    this.router.navigate(['/shop/credits']);
  }
}