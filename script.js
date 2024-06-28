console.log('Script caricato correttamente');

// Controller per gestire l'annullamento delle chiamate API
let abortController = new AbortController();

// Funzione per visualizzare i risultati
function displayBooks(filteredBooks) {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = '';

    const limitedBooks = filteredBooks.slice(0, 10); // Limitiamo a 10 risultati

    limitedBooks.forEach(book => {
        const li = document.createElement('li');
        li.textContent = `${book.title} - ${book.author_name ? book.author_name.join(', ') : 'Autore sconosciuto'}`;
        li.addEventListener('click', () => {
            displayDescription(book);
        });
        bookList.appendChild(li);
    });

    document.getElementById('loading-indicator').style.display = 'none';
}

// Funzione per visualizzare la descrizione del libro
function displayDescription(book) {
    const descriptionContainer = document.getElementById('description-container');
    descriptionContainer.innerHTML = `
        <div>
            <img src="https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg" alt="${book.title}">
            <p>${book.first_sentence ? book.first_sentence[0] : 'Nessuna descrizione disponibile'}</p>
        </div>
    `;
}

// Funzione di ricerca
async function searchBooks(event) {
    event.preventDefault();
    
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    console.log(`Eseguo la ricerca per: ${searchInput}`);
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(searchInput)}`;

    // Annulla la richiesta precedente se esiste
    if (abortController) {
        abortController.abort();
    }
    // Creiamo un nuovo AbortController per la nuova richiesta
    abortController = new AbortController();
    const signal = abortController.signal;

    document.getElementById('loading-indicator').style.display = 'block';

    try {
        const response = await fetch(url, { signal });
        if (!response.ok) {
            throw new Error('Errore nella risposta della rete');
        }
        const data = await response.json();
        const books = data.docs;

        console.log(books);
        displayBooks(books);
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('Richiesta annullata');
        } else {
            console.error('Errore durante la ricerca dei libri:', error);
            document.getElementById('loading-indicator').style.display = 'none';
        }
    }
}

// Aggiungere l'event listener al form per submit
document.getElementById('search-form').addEventListener('submit', searchBooks);
