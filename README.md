# Progetto ProgWeb

## Nome Progetto: HeroFlip


### Struttura Sito

- appcomponent
  - Homepage
    - navbar
      - Auth
        - login
        - register
      - shop
    - Pachetti



### Step nella creazione da migliorare subito (quando verra voglia di farlo :/)
- [ ] creare un envoirment nella parte frontend per tenere l'indirizzo del server
- [X] controllare meglio i campi login
- [X] far vedere errori sul form quando si inserisce un campo sbagliato
- [ ] diferenzaire i vari tipi di errore e nella documentaione e commenti segnare vari tipi di codice errore cosa vuoldire
- [ ] Aggiungere messaggio di conferma di registrazione avvenuta e login avvenuto (piu avanti magari si potrebbe inserire una mini animazione di sucesso)
- [ ] doppia psd per registrazione
- [ ] separare funzioni in usercheck
- [ ] il supereore preferito diventa l'icona del profilo
- [ ] sistemare Formated String function in Backend

### User creation 
- Struttura: 
  - username
  - nome
  - cognome
  - email
  - password
  - eroe preferto
  - crediti
  - profile pic





### Interfaccia Carte

- [ ] Usare progress bar di bootstrap per le stats dei supereroi






### Da gestire

- [ ] i doppioni di carte sono carte diverse con un altro id oppure ogni carta ha un campo copie per indicare quanti duplicati ci sono di una certa carta?
- [ ] ha senso salvare le informazioni di scambio?
- [ ] creare piu album oppure un album con piu viste?






###### TEmp

<div class="container mt-5">
      <h1 class="mb-4">Home Page</h1>
      <button class="btn btn-primary" routerLink="/login">Vai al Login</button>
      <br>
      <br>
      <button class="btn btn-secondary" routerLink="/register">Registrati</button>
      <br>
      <br>
      <button class="btn btn-secondary" routerLink="/home">Home</button>
</div>


<router-outlet></router-outlet> 