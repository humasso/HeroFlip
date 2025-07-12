HeroFlip: Album delle Figurine dei Super Eroi
Introduzione
HeroFlip è un progetto web che implementa un album elettronico di figurine di supereroi, con funzionalità di acquisto pacchetti e scambio figurine tra utenti.
La struttura dell’applicazione è documentata nel file README.md, che descrive la suddivisione tra componenti di autenticazione, dashboard dello shop, gestione pacchetti e profilo utente.

Architettura
Backend (NodeJS + MongoDB): Espone diverse API REST documentate tramite Swagger. Nel file Backend/README.md sono riepilogati i principali endpoint, i codici di errore e le istruzioni di avvio del server.

Frontend (Angular): Generato con Angular CLI, con struttura modulare in Frontend/afse/src/app. Il file Frontend/afse/README.md fornisce istruzioni di sviluppo e build dell’applicazione Angular.

Funzionalità principali
Gestione utenti: Registrazione, login, modifica credenziali, aggiornamento username/eroe preferito, eliminazione account. Le relative API sono descritte nella sezione “Utenti” del backend README.

Shop: Consente di aggiungere crediti, acquistare pacchetti di figurine e aprirli. Endpoint /shop/credits, /shop/packs e /shop/open.

Album: Ogni utente possiede un album con le carte collezionate. L’endpoint /album/{userId} restituisce o crea l’album, mentre /album/add/{userId} permette di aggiungere carte.

Pacchetti e Eroi: L’API /hero/open/{id} apre un pacchetto e genera cinque carte casuali da inserire nell’album.

Scambi (Trade): È possibile pubblicare annunci di scambio, inviare proposte, accettare o rifiutare offerte e registrare la cronologia degli scambi. Gli endpoint sono elencati nella sezione “Trade”.

Notifiche: Gli utenti ricevono notifiche per gli eventi legati agli scambi. Gestite tramite /notification/{userId} e relative API.

Configurazione e avvio
Installare le dipendenze backend ed eseguire npm start.

Avviare il frontend con ng serve come indicato nel README del progetto Angular.

