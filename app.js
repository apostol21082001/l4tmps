class Book {
    constructor(title, author) {
        this.title = title;
        this.author = author;
    }
}

class Iterator {
    constructor(books) {
        this.books = books;
        this.index = 0;
    }

    hasNext() {
        return this.index < this.books.length;
    }

    next() {
        return this.hasNext() ? this.books[this.index++] : null;
    }
}

class SearchHandler {
    constructor() {
        this.nextHandler = null;
    }

    setNext(handler) {
        this.nextHandler = handler;
    }

    search(books, query) {
        if (this.nextHandler) {
            return this.nextHandler.search(books, query);
        }
        return [];
    }
}

class TitleSearchHandler extends SearchHandler {
    search(books, query) {
        const result = books.filter(book => book.title.toLowerCase().includes(query.toLowerCase()));
        return result.length ? result : super.search(books, query);
    }
}

class AuthorSearchHandler extends SearchHandler {
    search(books, query) {
        const result = books.filter(book => book.author.toLowerCase().includes(query.toLowerCase()));
        return result.length ? result : super.search(books, query);
    }
}

class BookCollection {
    constructor() {
        this.books = [];
        this.titleSearchHandler = new TitleSearchHandler();
        this.authorSearchHandler = new AuthorSearchHandler();
        this.titleSearchHandler.setNext(this.authorSearchHandler);
    }

    addBook(book) {
        this.books.push(book);
    }

    getIterator() {
        return new Iterator(this.books);
    }

    search(query) {
        return this.titleSearchHandler.search(this.books, query);
    }
}

class Library {
    constructor() {
        this.bookCollection = new BookCollection();
    }

    execute(command) {
        command.execute(this.bookCollection);
    }
}

class AddBookCommand {
    constructor(book) {
        this.book = book;
    }

    execute(bookCollection) {
        bookCollection.addBook(this.book);
    }
}

class DeleteBookCommand {
    constructor(index) {
        this.index = index;
    }

    execute(bookCollection) {
        bookCollection.books.splice(this.index, 1);
    }
}

class QueryInterpreter {
    constructor() {
        this.handlers = {
            title: new TitleSearchHandler(),
            author: new AuthorSearchHandler(),
        };
    }

    interpret(query) {
        const tokens = query.split(' ');
        const field = tokens[0];
        const searchTerm = tokens.slice(1).join(' ');

        if (this.handlers[field]) {
            return this.handlers[field].search(library.bookCollection.books, searchTerm);
        } else {
            throw new Error(`Invalid query field: ${field}`);
        }
    }
}

const library = new Library();
const queryInterpreter = new QueryInterpreter();

document.getElementById('add-book-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const addBookCommand = new AddBookCommand(new Book(title, author));
    library.execute(addBookCommand);

    const bookItems = document.getElementById('book-items');
    const li = document.createElement('li');
    li.textContent = `${title} - ${author}`;
    bookItems.appendChild(li);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Șterge';
    deleteButton.classList.add('delete-button');
    li.appendChild(deleteButton);

    deleteButton.addEventListener('click', () => {
        const index = Array.prototype.indexOf.call(bookItems.children, li);
        const deleteBookCommand = new DeleteBookCommand(index);
        library.execute(deleteBookCommand);
        bookItems.removeChild(li);
    });
});

document.getElementById('search-form').addEventListener('submit', (e) => {
e.preventDefault();
const query = document.getElementById('query').value;
const results = queryInterpreter.interpret(query);
const searchResults = document.getElementById('search-results');
searchResults.innerHTML = '';

for (const result of results) {
    const li = document.createElement('li');
    li.textContent = `${result.title} - ${result.author}`;
    searchResults.appendChild(li);
}
});
document.getElementById('clear-search-results').addEventListener('click', () => {
    const searchResults = document.getElementById('search-results');
    searchResults.innerHTML = '';
});

