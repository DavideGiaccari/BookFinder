async function searchBooks() {
    const category = document.getElementById('category').value.trim().toLowerCase();
    if (!category) {
        alert('Per favore, inserisci una categoria.');
        return;
    }

    try {
        const response = await fetch(`https://openlibrary.org/subjects/${category}.json`);
        if (!response.ok) {
            throw new Error('Errore durante la ricerca dei libri. Per favore, riprova.');
        }

        const data = await response.json();
        console.log(data.genre); 
        if (data.works && data.works.length > 0) {
            displayBooks(data.works);
        } else {
            alert('Nessun libro trovato per la categoria inserita.');
            document.getElementById('book-list').innerHTML = '';
        }
    } catch (error) {
        alert(error.message);
    }
}
function displayBooks(books) {
    const bookList = document.getElementById('book-list');
    const descriptionContainer = document.getElementById('description-container');
    bookList.innerHTML = '';
    descriptionContainer.innerHTML = ''; 
    books.forEach(book => {
        const listItem = document.createElement('li');
        listItem.textContent = `${book.title} - ${book.authors.map(author => author.name).join(', ')}`;
        listItem.onclick = () => showBookDescription(book.key, book.cover_id);
        bookList.appendChild(listItem);
        bookList.scrollIntoView({ behavior: 'smooth' });
    });
}

async function showBookDescription(bookKey, coverId) {
    try {
        const response = await fetch(`https://openlibrary.org${bookKey}.json`);
        if (!response.ok) {
            throw new Error('Errore durante il recupero della descrizione del libro. Per favore, riprova.');
        }

        const data = await response.json();
        const descriptionContainer = document.getElementById('description-container');
        
        let description;
        if (typeof data.description === 'string') {
            description = data.description;
        } else if (typeof data.description === 'object' && data.description.value) {
            description = data.description.value;
        } else {
            description = "Descrizione non disponibile";
        }

        let imageUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : 'https://via.placeholder.com/150';
        
        descriptionContainer.innerHTML = `
            <p>${description}</p>
            <img src="${imageUrl}" alt="Copertina del libro">`;
            descriptionContainer.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        alert(error.message);
    }
}

document.getElementById('search-button').addEventListener('click', searchBooks);