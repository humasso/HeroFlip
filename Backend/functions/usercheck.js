function formattedString(string) {
    // Rimuovi spazi aggiuntivi all'inizio e alla fine della stringa
     string = string.trim();
 
     // Dividi la stringa in parole utilizzando uno o più spazi come delimitatore
     const words = string.split(/\s+/);
 
     // Per ogni parola, converti la prima lettera in maiuscolo e le altre in minuscolo
     const capitalizedWords = words.map(word => {
         return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
     });
 
     // Unisci le parole con uno spazio
     return capitalizedWords.join(' ');
 }

module.exports = formattedString;