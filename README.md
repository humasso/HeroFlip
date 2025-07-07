# Progetto ProgWeb

## Nome Progetto: HeroFlip


### Struttura Sito

- appcomponent
  - Homepage
    - navbar
      - Auth
        - login
        - register
      - dashboard Shop
        - credits shop
        - Pachetti shop

### Struttura navbar utente loggato
-Nome utente
- Profilo
- pachetti / album (da decidere dopo)
- metodi di pagamento 
- cronologia ordini 
- Logout


### Step nella creazione da migliorare subito (quando verra voglia di farlo :/)
- [ ] creare un envoirment nella parte frontend per tenere l'indirizzo del server
- [ ] diferenzaire i vari tipi di errore e nella documentaione e commenti segnare vari tipi di codice errore cosa vuoldire
- [ ] Aggiungere messaggio di conferma di registrazione avvenuta e login avvenuto (piu avanti magari si potrebbe inserire una mini animazione di sucesso)
- [ ] separare funzioni in usercheck
- [ ] il supereore preferito diventa l'icona del profilo
- [ ] sistemare Formated String function in Backend
- [ ] mettere nel usercheck tutte le funzioni di controllo dei dati del utente
- [ ] nel aggiorna password usare le funzioni di usercheck per controllare la nuova pass
- [ ] facendo login una seconda volta senza aver fatto il logout, nella navbar rimane il nome del vecchio account 
- [ ] per qualche motivo, facendo cambio account e rimettendo lo stesso account nella navbar non appare il username, rimane vuoto
- [ ] Se non c'è l'account non da l'errore giusto. (errore server)
- [ ] avere un timer per disconnettere l'utente
- [ ] cambiare colore dello sfondo

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
  - pacchetti



### Shop Struttura

Una dashboard per lo shop dove ci sono informazioni principali e in grande anche i crediti disponibili 
il componente di shop creditis fa la simulazione per comprare dei crediti 
pachetti ci devo pensare ancora 

nella pagina di espazione c'è anche un opzione per visualizzare informazioni su quella espasione. tipo quanti 

i crediti sono in rapporto 5:1 con euro
un pachetto costa 6 crediti
5 euro compro 25 crediti = 4 pachetti e mi rimangono crediti in piu 
in piu ci sono disponibili dei bundule che si possono comprare, esempio 50 dovrei prendere 250 crediti invece prendo 300 = 50 pachetti precisi
cosi via dando sempre piu crediti piu soldi spende l'utente 



### Interfaccia Carte

- [ ] Usare progress bar di bootstrap per le stats dei supereroi




### Da gestire

- [ ] i doppioni di carte sono carte diverse con un altro id oppure ogni carta ha un campo copie per indicare quanti duplicati ci sono di una certa carta?





## Task Completate:

- [X] ha senso salvare le informazioni di scambio?
- [X] creare piu album oppure un album con piu viste?
- [X] controllare meglio i campi login
- [X] far vedere errori sul form quando si inserisce un campo sbagliato
- [X] doppia psd per registrazione