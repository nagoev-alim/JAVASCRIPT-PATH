import './style.scss';
import feather from 'feather-icons';
import axios, { AxiosResponse } from 'axios';
import { toast } from './utils/toast.ts';

interface APIEntry {
  API: string;
  Description: string;
  Auth: string;
  Cors: string;
  Category: string;
  Link: string;
}

interface APICategoryResponse {
  count: number;
  categories: string[];
}

/**
 * Класс для выполнения поиска API с использованием веб-интерфейса.
 */
class SearchAPIs {
  private form: HTMLFormElement;
  private categoryCount: HTMLSpanElement;
  private categoryList: HTMLUListElement;
  private cards: HTMLUListElement;
  private result: HTMLDivElement;

  /**
   * Создает экземпляр класса и инициализирует его.
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует класс, создавая DOM-элементы и настраивая обработчики событий.
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает DOM-элементы, представляющие веб-интерфейс для поиска API.
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='max-w-4xl mx-auto w-full p-3 grid gap-4'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Search APIs</h1>
        <div class='grid gap-3'>
        <form class='bg-white grid gap-2 max-w-lg w-full mx-auto p-3 border rounded' data-form>
          <label>
            <input class='px-3 py-2 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50' type='text' name='category' placeholder='Enter keywords'>
          </label>
          <button class='px-3 py-2 border hover:bg-slate-50' type='submit'>Submit</button>
        </form>

        <div class='grid gap-2  w-full mx-auto ' data-result>
          <div class='bg-white p-3 border rounded grid gap-4'>
            <h3 class='font-medium'>Total categories: <span data-categories-count class='font-bold'>0</span></h3>
            <ul class='flex flex-wrap gap-3 justify-center items-center' data-buttons></ul>
          </div>

          <div class='bg-white p-3 border rounded grid gap-4 hidden'>
            <h3 class='font-medium'>List API</h3>
            <ul class='grid gap-3 items-start sm:grid-cols-2 md:grid-cols-3' data-cards></ul>
          </div>
        </div>
      </div>
      </div>
    `;
    this.form = root.querySelector('[data-form]')!;
    this.categoryCount = root.querySelector('[data-categories-count]')!;
    this.categoryList = root.querySelector('[data-buttons]')!;
    this.cards = root.querySelector('[data-cards]')!;
    this.result = root.querySelector('[data-result]')!;
  }

  /**
   * Настраивает обработчики событий для формы поиска и кнопок категорий.
   */
  private setupEventListeners(): void {
    this.fetchCategories();
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
  }

  /**
   * Загружает список категорий API с удаленного сервера.
   */
  private async fetchCategories(): Promise<void> {
    try {
      const response: AxiosResponse<APICategoryResponse> = await axios.get('https://api.publicapis.org/categories');
      const { count, categories } = response.data;
      this.renderCategories(count, categories);
    } catch (e) {
      toast('Something went wrong, open dev console', 'error');
      console.log(e);
    }
  }

  /**
   * Обрабатывает отправку формы поиска и выполняет поиск API по введенным ключевым словам.
   * @param {Event} event - Событие отправки формы.
   */
  private async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const category = formData.get('category') as string;
    if (category.trim().toLowerCase().length === 0) {
      toast('Please fill the field', 'warning');
      return;
    }
    try {
      const response: AxiosResponse<{
        entries: APIEntry[]
      }> = await axios.get(`https://api.publicapis.org/entries?title=${category}`);
      this.renderCards(response.data.entries);
    } catch (e) {
      toast('Something went wrong, open dev console', 'error');
      console.log(e);
    }
  }

  /**
   * Отображает список категорий на странице.
   * @param {number} count - Количество категорий.
   * @param {string[]} categories - Массив категорий.
   */
  private renderCategories(count: number, categories: string[]): void {
    this.categoryCount.textContent = String(count);
    this.categoryList.innerHTML = ``;

    for (const category of categories) {
      const li = document.createElement('li');
      li.innerHTML = `<button class='px-3 py-2 border hover:bg-slate-50' data-category='${category}'>${category}</button>`;
      const buttons = li.querySelectorAll('[data-category]');
      buttons.forEach(btn => btn.addEventListener('click', ({ target: { dataset: { category } } }) => {
        document.querySelectorAll('[data-category]').forEach(b => b.classList.remove('bg-neutral-900', 'text-white', 'font-bold', 'hover:bg-neutral-800'));
        btn.classList.add('bg-neutral-900', 'text-white', 'font-bold', 'hover:bg-neutral-800');
        this.fetchCategory(category);
      }));

      this.categoryList.append(li);
    }
  }

  /**
   * Загружает API, соответствующие выбранной категории.
   * @param {string} category - Выбранная категория.
   */
  private async fetchCategory(category: string): Promise<void> {
    try {
      const { data: { entries } } = await axios.get(`https://api.publicapis.org/entries?category=${category}`);
      this.renderCards(entries);
    } catch (e) {
      toast('Something went wrong, open dev console', 'error');
      console.log(e);
    }
  }

  /**
   * Отображает найденные API на странице.
   * @param {APIEntry[]} entries - Массив объектов API.
   */
  private renderCards(entries: APIEntry[]): void {
    this.cards.parentElement!.classList.remove('hidden');
    this.cards.innerHTML = `
      ${entries.map((entry) => `
        <li class='bg-slate-50 rounded p-2 border'>
          <a href='${entry.Link}' target='_blank'>
            ${['API', 'Description', 'Auth', 'Cors', 'Category'].map((i, idx) => `
              <p>
                <span class='font-bold'>${idx === 0 ? 'Title' : i}:</span>
                <span>${entry[i] === '' ? '-' : entry[i]}</span>
              </p>
            `).join('')}
          </a>
        </li>
      `).join('')}`;
  }
}

// Создает экземпляр класса для выполнения поиска API.
new SearchAPIs();
