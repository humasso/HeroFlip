export interface User {
    _id: string;
    username: string;
    name: string;
    surname: string;
    email: string;
    password: string;
    favoriteHero: string;
    credits: number;
    avatar: string;
}

// Interfacce per la richiesta e risposta di registrazione
export interface RegisterRequest {
  username: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  favoriteHero: string;
  avatar: string; // URL dell'avatar
}

export interface RegisterResponse {
  message: string;
  userId?: string;
}