# HeroFlip Backend

API per la gestione di utenti, album e scambi di carte collezionabili.

## Avvio

```bash
npm install
npm start
```

La documentazione interattiva è disponibile su `/api-docs` quando il server è in esecuzione.

## Codici di errore

| Codice | Significato                      |
|-------:|----------------------------------|
| 200    | Richiesta completata             |
| 201    | Risorsa creata                   |
| 204    | Nessun contenuto/operazione OK   |
| 400    | Dati inviati non validi          |
| 401    | Autenticazione necessaria        |
| 404    | Risorsa non trovata              |
| 500    | Errore interno del server        |

## Endpoint principali

### Autenticazione
- **POST `/auth/register`** – registra un nuovo utente. Campi obbligatori: `username`, `name`, `surname`, `email`, `password`, `favoriteHero`. Può restituire `400` o `500` in caso di errore.
- **POST `/auth/login`** – effettua il login con `username` e `password`.

### Utenti
- **GET `/user/{id}`** – dati di un utente. `404` se non trovato.
- **PUT `/user/pass/{id}`** – aggiorna la password fornendo `oldPassword` e `newPassword`.
- **PUT `/user/username/{id}`** – aggiorna lo username, campo `username` nel body.
- **PUT `/user/favoritehero/{id}`** – aggiorna l'eroe preferito, campo `favoriteHero` nel body.
- **DELETE `/user/{id}`** – elimina l'utente.

### Shop
- **POST `/shop/credits/{id}`** – aggiunge crediti all'utente con campo `credits`.
- **POST `/shop/packs/{id}`** – acquista pacchetti (`packType`, `qty`, `cost`).
- **POST `/shop/open/{id}`** – apre pacchetti (`packType`, `qty`).

### Album
- **GET `/album/{userId}`** – restituisce/crea l'album per l'utente.
- **POST `/album/add/{userId}`** – aggiunge carte all'album, campo `cards`.

### Hero
- **POST `/hero/open/{id}`** – apre un pacchetto e genera 5 carte casuali in base al tipo.

### Trade
- **POST `/trade`** – pubblica uno scambio. Richiede almeno una carta offerta o dei crediti.
- **GET `/trade`** – elenco di tutti gli scambi.
- **GET `/trade/user/{userId}`** – scambi di un utente.
- **GET `/trade/history/{userId}`** – storico scambi completati.
- **GET `/trade/{id}`** – dettaglio di uno scambio.
- **POST `/trade/{id}/respond`** – invia una proposta.
- **PATCH `/trade/{tradeId}/proposal/{proposalId}/reject`** – rifiuta una proposta.
- **PATCH `/trade/{tradeId}/proposal/{proposalId}/accept`** – accetta una proposta e trasferisce le carte.
- **DELETE `/trade/{id}`** – elimina lo scambio.

### Notifiche
- **GET `/notification/{userId}`** – notifiche dell'utente.
- **POST `/notification`** – crea una notifica (`user`, `message`, opzionale `actor`).
- **DELETE `/notification/{id}`** – elimina una notifica.