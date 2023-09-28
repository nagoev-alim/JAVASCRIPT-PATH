import './style.scss';
import logo from '../public/logo.svg';
import { toast } from './utils/toast.ts';
import axios from 'axios';

/**
 * Интерфейс, представляющий структуру данных для объектов с информацией о результатах поиска в Wikipedia.
 * @interface
 */
interface IData {
  /**
   * Заголовок статьи или результат поиска.
   * @type {string}
   */
  title: string;

  /**
   * Краткое описание или отрывок из статьи.
   * @type {string}
   */
  snippet: string;

  /**
   * Уникальный идентификатор страницы или результата поиска.
   * @type {string}
   */
  pageid: string;
}

class WikiSearch {
  private form: HTMLFormElement;
  private result: HTMLUListElement;
  private readonly URL: string = 'https://en.wikipedia.org/w/api.php?action=query&list=search&srlimit=20&format=json&origin=*&srsearch=';

  /**
   * Создает экземпляр класса WikiSearch.
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует класс WikiSearch.
   * @private
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }


  /**
   * Создает структуру DOM для отображения интерфейса поиска Wikipedia.
   * @private
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='w-full max-w-4xl mx-auto grid items-start gap-4'>
        <div class='max-w-xl w-full mx-auto bg-white grid place-items-center gap-3 border p-3 rounded'>
          <img src='${logo}' alt='Wikipedia'>
          <h1 class='text-center font-bold text-2xl md:text-4xl'>Search Wikipedia</h1>
          <form class='grid gap-3 w-full' data-form>
            <label>
              <input class='px-3 py-2 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50' type='text' name='query' placeholder='Enter something'/>
            </label>
            <button class='px-3 py-2 border hover:bg-slate-50' type='submit'>Search</button>
          </form>
        </div>
        <ul class='hidden grid gap-3 sm:grid-cols-2 md:grid-cols-3' data-result></ul>
      </div>
    `;

    this.form = root.querySelector('[data-form]')!;
    this.result = root.querySelector('[data-result]')!;
  }

  /**
   * Устанавливает обработчики событий.
   * @private
   */
  private setupEventListeners(): void {
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
  }

  /**
   * Обрабатывает отправку формы поиска и отображает результаты поиска.
   * @param {Event} event - Событие отправки формы.
   * @private
   */
  private async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const query = formData.get('query') as string;
    const button = form.querySelector('button')!;
    if (query.length === 0) {
      toast('Please enter valid search term', 'warning');
      return;
    }
    try {
      button.textContent = 'Loading...';
      const { data: { query: { search } } } = await axios.get(`${this.URL}${query}`);
      if (search.length === 0) {
        toast('No matching results. Please try again.', 'warning');
        return;
      }
      this.renderData(search);
      button.textContent = 'Submit';
    } catch (e) {
      toast('Something went wrong, open dev console.', 'error');
      button.textContent = 'Submit';
      console.log(e);
    }
  }

  /**
   * Отображает результаты поиска на странице.
   * @param {IData[]} data - Массив данных с результатами поиска.
   * @private
   */
  private renderData(data: IData[]): void {
    this.result.classList.remove('hidden');
    this.result.innerHTML = `
      ${data.map(({ title, snippet, pageid }) => `
        <li class='bg-white border rounded p-3'>
          <a class='grid gap-2' href='https://en.wikipedia.org/?curid=${pageid}' target='_blank' >
            <h4 class='font-bold text-lg'>${title}</h4>
            <p>${snippet}</p>
          </a>
        </li>
      `).join('')}`;
  };
}

// Создание экземпляра класса для выполнения поиска на странице.
new WikiSearch();
