# Tehnici și Mecanisme de Proiectare Software

# Labortator nr.4

# Apostol Mihail,ti_204

# Chain of Responsibility
Acest cod utilizează șablonul de design Chain of Responsibility pentru a permite căutarea într-o bibliotecă prin intermediul mai multor criterii.

Clasa SearchHandler reprezintă clasa de bază a lanțului de responsabilitate. Ea definește o metodă search(books, query) care primește o listă de cărți și o interogare de căutare și returnează o listă cu cărțile care se potrivesc cu interogarea. Dacă obiectul curent din lanț nu poate rezolva sarcina, metoda search() își va pasa sarcina la următorul obiect din lanț.

Metoda setNext(handler) este utilizată pentru a seta următorul obiect din lanț.

Clasele TitleSearchHandler și AuthorSearchHandler reprezintă nodurile din lanțul de responsabilitate. Acestea implementează metoda search(books, query) și caută după titlu și, respectiv, după autor. Dacă obiectul curent nu poate rezolva sarcina curentă, metoda search() își va pasa sarcina la următorul obiect din lanț, apelând metoda search() a superclasei SearchHandler. Dacă niciuna dintre clasele TitleSearchHandler și AuthorSearchHandler nu poate găsi cărți care să se potrivească cu interogarea, atunci se va returna o listă goală.

În utilizarea acestui design pattern, un client poate utiliza clasa SearchHandler pentru a efectua căutarea prin intermediul lanțului de responsabilitate, trecând lista de cărți și interogarea de căutare către primul obiect din lanț. Obiectul din lanț care poate rezolva sarcina va returna o listă cu cărți potrivite. Dacă niciun obiect din lanț nu poate rezolva sarcina, se va returna o listă goală.
```
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
```
# Command
Acest cod utilizează șablonul de design Command pentru a permite efectuarea unei acțiuni (adică adăugarea sau ștergerea unei cărți) prin intermediul unui obiect de comandă.

Clasa AddBookCommand reprezintă o comandă de adăugare a unei cărți într-o colecție de cărți. Această clasă are un constructor care primește obiectul book pe care îl vom adăuga în colecție și o metodă execute(bookCollection) care primește colecția de cărți și adaugă cartea în această colecție.

Clasa DeleteBookCommand reprezintă o comandă de ștergere a unei cărți dintr-o colecție de cărți. Această clasă are un constructor care primește index, adică indexul cărții pe care dorim să o ștergem din colecție și o metodă execute(bookCollection) care primește colecția de cărți și șterge cartea din colecție.

Acest șablon de design permite separarea comenzii (adică acțiunea care trebuie efectuată) de obiectul care o apelează și de obiectul care o execută. În acest caz, comanda este reprezentată de obiectele AddBookCommand și DeleteBookCommand, iar obiectul care o apelează este de obicei o interfață cu utilizatorul. Obiectul care execută comanda este colecția de cărți (bookCollection), care este dată ca argument metodei execute() a obiectelor de comandă.

Acest șablon de design este implementat prin utilizarea unei clase de bază Command care defineste o metodă execute() și mai multe clase derivate (în cazul nostru, AddBookCommand și DeleteBookCommand) care implementează această metodă. Aceste clase de comandă sunt proiectate pentru a fi utilizate împreună cu o clasă de invocator (Invoker) care poate gestiona obiectele de comandă și poate apela metoda execute() pe obiectul de comandă potrivit.

În utilizarea acestui design pattern, obiectele de comandă sunt create și stocate într-o coadă sau într-o stivă. Când utilizatorul dorește să execute o anumită comandă, invocatorul extrage comanda corespunzătoare din coadă sau stivă și apelează metoda execute(). Această metodă apelează apoi metoda corespunzătoare din clasa de colecție de cărți. Acest design pattern este util pentru a permite undo/redo (adica anularea sau refacerea acțiunilor efectuate) și pentru a separa logica de interfața cu utilizatorul.
	
```
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
```

# Iterator
Acest cod implementează design pattern-ul Iterator, care permite accesarea și parcurgerea elementelor unei colecții fără a dezvălui detaliile interne ale acesteia.

Clasa Iterator are doi membri: books, care este colecția pe care vrem să o parcurgem, și index, care ține evidența elementului curent din colecție. Clasa conține două metode: hasNext(), care returnează true dacă există încă elemente în colecție pe care nu le-am parcurs, și next(), care returnează următorul element din colecție și mută indexul curent la următorul element. Dacă nu există un următor element, metoda next() returnează null.

Prin folosirea design pattern-ului Iterator, putem itera prin elementele unei colecții fără să cunoaștem detaliile acesteia, ceea ce face codul mai modular și mai ușor de întreținut.
```
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
```
# Interpreter
Acest cod utilizează design pattern-ul Interpreter, care permite interpretarea și evaluarea unor expresii sau comenzi complexe.

Clasa QueryInterpreter conține un obiect handlers care reprezintă o mapare între numele unui câmp de căutare și un obiect handler asociat. Acest obiect handler implementează logica de căutare în colecția de cărți și este de tipul TitleSearchHandler sau AuthorSearchHandler. Aceste două clase sunt descrise și implementate într-un exemplu anterior.

Metoda interpret primește ca parametru un query și îl separă în două componente: câmpul de căutare și termenul de căutare. Apoi, metoda caută în obiectul handlers un handler asociat cu câmpul de căutare și îl folosește pentru a realiza căutarea. Dacă nu există un handler asociat cu câmpul de căutare, metoda aruncă o eroare.

Design pattern-ul Interpreter permite crearea de expresii și comenzi complexe și abstractizarea logicii de interpretare a acestora. În acest caz, Interpreter permite interpretarea unui query de căutare format dintr-un câmp și un termen de căutare, prin intermediul obiectelor handler specializate. Astfel, acest cod devine mai modular și mai ușor de întreținut.
```
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
```
# Concluzie
Cele patru design pattern-uri utilizate în acest set de coduri sunt: Command, Iterator, Chain of Responsibility și Interpreter. Acestea funcționează împreună pentru a crea un sistem modular, ușor de înțeles și de întreținut.

Design pattern-ul Command este utilizat pentru a abstractiza acțiunile efectuate asupra unei colecții de cărți. Clasele AddBookCommand și DeleteBookCommand encapsulează acțiunile de adăugare și ștergere a cărților și le fac ușor de extins sau de înlocuit cu alte acțiuni similare.

Design pattern-ul Iterator este utilizat pentru a itera printr-o colecție de cărți. Clasa Iterator abstractizează procesul de iterare și îl face ușor de utilizat și de înțeles. Acest design pattern permite utilizarea unei colecții de cărți de orice dimensiune, fără a fi necesară o implementare specifică pentru fiecare dimensiune.

Design pattern-ul Chain of Responsibility este utilizat pentru a căuta într-o colecție de cărți în funcție de diferite criterii. Clasele SearchHandler, TitleSearchHandler și AuthorSearchHandler sunt organizate ca o lanț de prelucrare, astfel încât o cerere de căutare poate fi procesată de fiecare handler până când este găsit un rezultat sau până când toți handlerii au fost parcurși. Acest design pattern permite adăugarea sau înlăturarea ușoară a altor handleri pentru a procesa diferite tipuri de căutare.

Design pattern-ul Interpreter este utilizat pentru a interpreta un query de căutare și a-l evalua în funcție de criteriile specifice. Clasa QueryInterpreter interpretează un query de căutare și utilizează obiecte de tip handler specializate pentru a efectua căutarea propriu-zisă. Acest design pattern permite crearea și extinderea ușoară a diferitelor tipuri de comenzi sau expresii de căutare.

În ansamblu, aceste patru design pattern-uri lucrează împreună pentru a crea un sistem modular și ușor de utilizat, care poate fi extins și îmbunătățit cu ușurință. Utilizarea acestor design pattern-uri permite abstractizarea logicii de programare și separarea componentelor de funcționalitate în module discrete, ceea ce facilitează dezvoltarea și întreținerea acestui sistem.
