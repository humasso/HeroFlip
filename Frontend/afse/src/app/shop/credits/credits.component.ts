import { Component, OnInit } from '@angular/core';
import { Bundle } from '../../models/shop.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShopService } from '../../services/shop.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-credits',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.css']
})
export class CreditsComponent implements OnInit {
  bundles: Bundle[] = [
    { name: 'Starter Pack',    price: 5,   credits: 25  },
    { name: 'Medium Pack',     price: 10,  credits: 50  },
    { name: 'Large Pack',      price: 20,  credits: 100 },
    { name: 'Super Pack',      price: 30,  credits: 150 },
    { name: 'Mega Bonus Pack', price: 50,  credits: 300 },
    { name: 'Ultra Bonus Pack',price: 100, credits: 600 }
  ];

  purchaseForm: FormGroup;
  processing = false;
  errorMsg = '';
  paypalModalOpen = false;

  constructor(
    private fb: FormBuilder,
    private shopService: ShopService,
    private router: Router
  ) {
    // Inizializziamo il reactive form
    this.purchaseForm = this.fb.group({
      manualCredits:   ['', [Validators.min(1)]],
      bundleIndex:     [null],

      // method placeholder
      paymentMethod:   ['card', Validators.required],

      // carte
      cardNumber:      ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expiryMonth:     ['', [Validators.required, Validators.pattern(/^\d{2}$/)]],
      expiryYear:      ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      cvv:             ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],

      // PayPal
      paypalEmail:     ['', [Validators.required, Validators.email]],
      paypalPassword:  ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // mutual exclusion manual/bundle
    this.purchaseForm.get('bundleIndex')!.valueChanges.subscribe(idx => {
      if (idx !== null) this.purchaseForm.get('manualCredits')!.reset();
    });
    this.purchaseForm.get('manualCredits')!.valueChanges.subscribe(val => {
      if (val) this.purchaseForm.get('bundleIndex')!.setValue(null, { emitEvent: false });
    });
  }

  // bundle selezionato
  get selectedBundle(): Bundle | null {
    const idx = this.purchaseForm.get('bundleIndex')!.value;
    return (typeof idx === 'number' && idx >= 0 && idx < this.bundles.length)
      ? this.bundles[idx]
      : null;
  }

  // tot crediti
  get creditsToBuy(): number {
    if (this.selectedBundle) return this.selectedBundle.credits;
    const raw = this.purchaseForm.get('manualCredits')!.value;
    const n = parseInt((raw ?? '0').toString(), 10);
    return isNaN(n) ? 0 : n;
  }

  // prezzo
  get priceToPay(): number {
    if (this.selectedBundle) return this.selectedBundle.price;
    return +(this.creditsToBuy / 5).toFixed(2);
  }

  // apri/chiudi modal PayPal
  openPaypalModal() { 
    this.purchaseForm.get('paymentMethod')!.setValue('paypal');
    this.paypalModalOpen = true; 
  }
  closePaypalModal() {
    this.paypalModalOpen = false;
    // opzionale: reset credenziali
    this.purchaseForm.get('paypalEmail')!.reset();
    this.purchaseForm.get('paypalPassword')!.reset();
  }

  // submit Carta
  payWithCard() {
    if (this.purchaseForm.get('cardNumber')!.invalid ||
        this.purchaseForm.get('expiryMonth')!.invalid ||
        this.purchaseForm.get('expiryYear')!.invalid ||
        this.purchaseForm.get('cvv')!.invalid ||
        this.creditsToBuy <= 0) {
      this.purchaseForm.markAllAsTouched();
      return;
    }
    this.processing = true;
    setTimeout(() => {
      this.processing = false;
      alert(`Hai acquistato ${this.creditsToBuy} crediti per €${this.priceToPay}!`);
      this.router.navigate(['/profile']);
    }, 2000);
  }

  // submit PayPal
  payWithPaypal() {
    if (this.purchaseForm.get('paypalEmail')!.invalid ||
        this.purchaseForm.get('paypalPassword')!.invalid ||
        this.creditsToBuy <= 0) {
      this.purchaseForm.markAllAsTouched();
      return;
    }
    this.processing = true;
    setTimeout(() => {
      this.processing = false;
      this.closePaypalModal();
      alert(`Pagato con PayPal e acquistati ${this.creditsToBuy} crediti!`);
      this.router.navigate(['/profile']);
    }, 2000);
  }

  // filtro solo cifre
  allowOnlyDigits(evt: KeyboardEvent) {
    if (!/^\d$/.test(evt.key)) {
      evt.preventDefault();
    }
  }
}
