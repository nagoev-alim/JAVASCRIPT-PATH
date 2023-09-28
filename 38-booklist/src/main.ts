import './style.scss';
import { v4 as uuidv4 } from 'uuid';
import { capitalStr } from './utils/capitalStr';
import { toast } from './utils/toast';
import axios from 'axios';

/**
 * Интерфейс для описания структуры книги.
 * @interface
 */
interface IBook {
  title: string; // Название книги
  author: string; // Автор книги
  isbn: string; // ISBN книги
  id: string; // Уникальный идентификатор книги
}

/**
 * Интерфейс для описания информации о книге из Google Books API.
 * @interface
 */
interface BookInfo {
  volumeInfo: {
    title: string; // Название книги
    previewLink: string; // Ссылка на предпросмотр книги
    authors: string[]; // Авторы книги
    imageLinks?: {
      thumbnail: string; // Ссылка на обложку книги
    };
  };
  id: string; // Уникальный идентификатор книги
}

/**
 * Класс для управления списком книг.
 * @class
 */
class BookList {
  private form: HTMLFormElement;
  private list: HTMLUListElement;
  private formSearch: HTMLFormElement;
  private listSearch: HTMLUListElement;
  private spinnerSearch: HTMLDivElement;
  private books: IBook[] = [];
  private booksISBN = [];
  private readonly URL: string = 'https://www.googleapis.com/books/v1/volumes?q=';

  /**
   * Конструктор класса BookList.
   * @constructor
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализация класса.
   * @private
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает DOM элементы.
   * @private
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='grid gap-3 max-w-7xl w-full mx-auto'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Book List</h1>

        <div class='grid gap-3 lg:grid-cols-2 items-start'>
        <div class='p-3 bg-white border rounded grid gap-3'>
          <h3 class='font-bold text-lg lg:text-2xl'>Search use ISBN</h3>
          <form data-search-form>
            <input class='px-3 py-2 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50' type='text' name='query' placeholder='ISBN'/>
          </form>
          <div class='hidden' role='status' data-search-spinner>
            <div class='flex justify-center'>
              <svg aria-hidden='true' class='inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300' viewBox='0 0 100 101' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z' fill='currentColor'/>
                <path d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z' fill='currentFill'/>
              </svg>
              <span class='sr-only'>Loading...</span>
            </div>
          </div>
          <ul class='grid grid-cols-2 gap-3'  data-search-list></ul>
        </div>

        <div class='p-3 bg-white border rounded grid gap-3'>
          <h3 class='font-bold text-lg lg:text-2xl'>Fill manually</h2>
          <form class='grid gap-3' data-form>
            <ul class='grid gap-3'>
              ${['title', 'author', 'isbn'].map(i => `
              <li>
                <label class='grid gap-2'>
                  <span class='font-medium'>${i[0].toUpperCase() + i.substring(1)}</span>
                  <input class='px-3 py-2 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50' type='text' name='${i}' placeholder='${capitalStr(i)}'>
                </label>
              </li>
              `).join('')}
            </ul>
            <button class='px-3 py-2 border hover:bg-slate-50' type='submit'>Add Book</button>
          </form>
        </div>
      </div>

        <div>
          <ul class='grid grid-cols-[1.5fr_1.5fr_1.5fr_.5fr]'>
            ${['Title', 'Author', 'ISBN', ''].map(i => `<li class='bg-white border p-2 font-medium'>${i}</li>`).join('')}
          </ul>
          <ul  data-list></ul>
        </div>
      </div>
    `;

    this.form = root.querySelector('[data-form]')!;
    this.list = root.querySelector('[data-list]')!;
    this.formSearch = root.querySelector('[data-search-form]')!;
    this.listSearch = root.querySelector('[data-search-list]')!;
    this.spinnerSearch = root.querySelector('[data-search-spinner]')!;
  }

  /**
   * Настраивает обработчики событий.
   * @private
   */
  private setupEventListeners(): void {
    this.books = this.storeGet();
    this.renderData(this.books);
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    this.formSearch.addEventListener('submit', this.handleSearch.bind(this));
    this.list.addEventListener('click', this.handleDelete.bind(this));
    this.listSearch.addEventListener('click', this.handleAddBook.bind(this));
  }

  /**
   * Отрисовывает данные в списке книг.
   * @param {IBook[]} data - Массив книг для отображения.
   * @private
   */
  private renderData(data: IBook[]): void {
    this.list.innerHTML = `
      ${data.map(({ title, author, isbn, id }) => `
      <li class='grid grid-cols-[1.5fr_1.5fr_1.5fr_.5fr]'>
        <div class='bg-white border p-2'><p>${title}</p></div>
        <div class='bg-white border p-2'><p>${author}</p></div>
        <div class='bg-white border p-2'><p>${isbn}</p></div>
        <div class='bg-white border p-2'><button data-id='${id}'>&times;</button></div>
      </li>
      `).join('')}
    `;
  }

  /**
   * Обработчик отправки формы для добавления книги.
   * @param {Event} event - Событие отправки формы.
   * @private
   */
  private handleSubmit(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const title = formData.get('title') as string;
    const author = formData.get('author') as string;
    const isbn = formData.get('isbn') as string;
    if (title.trim().length === 0 || author.trim().length === 0 || isbn.trim().length === 0) {
      toast('Please fill all fields', 'warning');
      return;
    }
    this.books = [{ title, author, isbn, id: uuidv4() }, ...this.books];
    const uniqueBooks = this.getUniqueBooks(this.books);
    console.log(uniqueBooks);
    this.storeAdd(this.books);
    this.renderData(this.books);
    form.reset();
  }

  /**
   * Добавляет записи в локальное хранилище браузера.
   * @param {IBook[]} entries - Массив записей для добавления.
   * @private
   */
  private storeAdd(entries: IBook[]): void {
    localStorage.setItem('books', JSON.stringify(entries));
  }

  /**
   * Получает записи из локального хранилища браузера.
   * @returns {IBook[]} - Массив записей из хранилища.
   * @private
   */
  private storeGet(): IBook[] {
    const storedBooks = localStorage.getItem('books');
    return storedBooks ? JSON.parse(storedBooks) : [];
  };

  /**
   * Обработчик отправки формы для поиска книги по ISBN.
   * @param {Event} event - Событие отправки формы.
   * @private
   */
  private async handleSearch(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const query = formData.get('query') as string;
    if (!/^[0-9-]+$/.test(query.trim())) {
      toast('Please enter valid ISBN', 'warning');
      return;
    }
    try {
      this.spinnerSearch.classList.remove('hidden');
      this.listSearch.innerHTML = '';
      const { data: { items } } = await axios.get(`${this.URL}${query}&key=AIzaSyAB2_GLzHnLIODDfGShsLcScvark6cgMdY`);

      if (items.length !== 0) {
        this.spinnerSearch.classList.add('hidden');
        this.booksISBN = items;
        this.renderISBN(this.booksISBN);
      }
    } catch (e) {
      toast('Something went wrong, open dev console', 'error');
      console.log(e);
      this.spinnerSearch.classList.add('hidden');
      this.listSearch.innerHTML = '';
    }
  }

  /**
   * Рендерит список книг по результатам поиска по ISBN.
   * @param {BookInfo[]} entries - Массив информации о книгах для отображения.
   * @private
   */
  private renderISBN(entries: BookInfo[]): void {
    this.listSearch.innerHTML = `
      ${entries.map(({ volumeInfo: { title, previewLink, authors, imageLinks }, id }) => `
        <li class='grid gap-2 ${this.books.find(({ id: bookId }) => id === bookId) ? 'opacity-25 pointer-events-none cursor-allowed' : ''}'>
          <img src='${imageLinks ? imageLinks.thumbnail : '#'}' alt='${title}'>
          <h3><a class='font-bold' href='${previewLink}' target='_blank'>${title}</a></h3>
          ${authors && authors.length !== 0 ? `<p>${authors[0]}</p>` : ''}
          <button class='px-3 py-2 border hover:bg-slate-50' data-isbn-id='${id}'>Add</button>
        </li>
      `).join('')}
    `;
  }

  /**
   * Обработчик удаления книги из списка.
   * @param {MouseEvent} event - Событие клика на кнопке удаления книги.
   * @private
   */
  private handleDelete(event: MouseEvent): void {
    const target = event.target as HTMLButtonElement;
    if (target.matches('[data-id]') && confirm('Are you sure you want to delete it?')) {
      const id = target.dataset.id;
      target.parentElement!.parentElement!.remove();
      this.listSearch.querySelectorAll('[data-isbn-id]').forEach(i => {
        if (i.dataset.isbnId === id) {
          i.parentElement!.classList.remove('added', 'opacity-25', 'pointer-events-none', 'cursor-allowed');
        }
      });
      this.storeDelete(id);

      toast('Book success removed', 'success');
      return;
    }
  }

  /**
   * Удаляет книгу из списка и из локального хранилища.
   * @param {string} bookId - Идентификатор книги для удаления.
   * @private
   */
  private storeDelete(bookId: string): void {
    this.books = this.storeGet();
    this.books = this.books.filter(({ id }) => id !== bookId);
    this.storeAdd(this.books);
  }

  /**
   * Обработчик добавления книги из списка результатов поиска по ISBN.
   * @param {MouseEvent} event - Событие клика на кнопке "Add" книги.
   * @private
   */
  private handleAddBook(event: MouseEvent): void {
    const target = event.target as HTMLButtonElement;
    if (target.matches('[data-isbn-id]')) {
      target.parentElement!.classList.add('added', 'opacity-25', 'pointer-events-none', 'cursor-allowed');
      const bookId = target.dataset.isbnId;
      const {
        volumeInfo: {
          title,
          authors,
          industryIdentifiers,
        },
      } = this.booksISBN.filter(({ id }) => id === bookId)[0];
      const bookInfo = {
        title,
        author: authors && authors.length !== 0 ? authors[0] : 'No info',
        isbn: industryIdentifiers[0].identifier,
        id: bookId,
      };
      this.books = [bookInfo, ...this.books];
      this.storeAdd(this.books);
      this.renderData(this.books);
    }
  }

  /**
   * Удаляет дубликаты книг из массива оригинальных книг.
   * @param {IBook[]} originalBooks - Массив оригинальных книг.
   * @returns {IBook[]} - Массив уникальных книг без дубликатов.
   * @private
   */
  private getUniqueBooks(originalBooks): any[] {
    const uniqueBooksSet = new Set();
    const uniqueBooksMap = new Map();

    originalBooks.forEach((book) => {
      const bookJson = JSON.stringify(book);

      if (!uniqueBooksSet.has(bookJson)) {
        uniqueBooksSet.add(bookJson);
        uniqueBooksMap.set(bookJson, book);
      }
    });

    return Array.from(uniqueBooksMap.values());
  }
}

new BookList();
