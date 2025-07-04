export interface Bundle {
  name: string;
  price: number;   // in Euro
  credits: number; // totali inclusi bonus
}

export interface PurchaseResponse {
  message: string;
  credits: number;
}