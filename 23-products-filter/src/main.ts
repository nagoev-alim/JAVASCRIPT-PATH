import './style.scss';
import mock from '../src/mock/index.ts';
import { capitalStr } from './utils/capitalStr.ts';

/**
 * Интерфейс продукта.
 * @property {string} id - Идентификатор.
 * @property {string} title - Заголовок.
 * @property {string} company - Компания.
 * @property {string} image - Ссылка на изображение.
 * @property {number} price - Цена.
 */
interface IProduct {
  id: string,
  title: string,
  company: string,
  image: string,
  price: number,
}

/**
 * Класс для фильтрации продуктов.
 */
class ProductsFilter {
  /**
   * Форма для поиска.
   * @private
   * @type {HTMLFormElement}
   */
  private form: HTMLFormElement;
  /**
   * Поле для ввода поискового запроса.
   * @private
   * @type {HTMLInputElement}
   */
  private search: HTMLInputElement;
  /**
   * Список продуктов.
   * @private
   * @type {HTMLUListElement}
   */
  private list: HTMLUListElement;
  /**
   * Результат поиска.
   * @private
   * @type {HTMLDivElement}
   */
  private result: HTMLDivElement;
  /**
   * Список компаний.
   * @private
   * @type {HTMLUListElement}
   */
  private companies: HTMLUListElement;
  /**
   * Массив продуктов.
   * @private
   * @type {IProduct[]}
   */
  private products: IProduct[] = mock;

  /**
   * Создает экземпляр класса ProductsFilter.
   * @constructor
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует класс.
   * @private
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает DOM-структуру страницы.
   * @private
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='max-w-6xl mx-auto w-full p-3 grid gap-4 items-start'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Products Filter</h1>
        <div class='grid gap-3 xl:grid-cols-[300px_1fr] items-start'>
          <div class='grid gap-3'>
            <form data-form>
              <input class='px-3 py-2.5 border rounded bg-slate-50 focus:outline-none focus:border-blue-400 w-full' name='query' type='search' data-search placeholder='Search'>
            </form>
            <h5 class='font-medium text-sm'>Company</h5>
            <ul class='flex flex-wrap gap-2 xl:grid' data-companies></ul>
          </div>
          <div class='' data-result>
            <ul class='grid gap-3' data-products></ul>
          </div>
        </div>
      </div>
    `;

    this.form = root.querySelector('[data-form]')!;
    this.search = root.querySelector('[data-search]')!;
    this.list = root.querySelector('[data-products]')!;
    this.result = root.querySelector('[data-result]')!;
    this.companies = root.querySelector('[data-companies]')!;
  }

  /**
   * Устанавливает обработчики событий.
   * @private
   */
  private setupEventListeners(): void {
    this.renderProducts();
    this.renderCompanies();
    this.form.addEventListener('keyup', this.handleKeyUp.bind(this));
    this.companies.addEventListener('click', this.handleFilter.bind(this));
    this.search.addEventListener('search', this.handleSearch.bind(this));
  }

  /**
   * Отображает продукты.
   * @private
   */
  private renderProducts(): void {
    this.result.innerHTML = this.products.length === 0
      ? `<h5 class='font-medium'>😩 Sorry, no products matched your search</h5>`
      : `<ul class='grid gap-3 sm:grid-cols-2 md:grid-cols-3' data-products>
          ${this.products.map(({ id, title, image, price }: IProduct): string => `
        <li class='bg-white border rounded overflow-hidden' data-id='${id}'>
          <div class=''>
            <img class='max-h-[250px] min-h-[250px] object-cover w-full' src='${image}' alt='${title}'>
          </div>
          <div class='grid gap-3 p-3'>
            <h3 class='font-bold text-lg'>${title}</h3>
            <p>${price}</p>
          </div>
        </li>
      `).join('')}
    </ul>
    `;
  }

  /**
   * Отображает компании.
   * @private
   */
  private renderCompanies(): void {
    this.companies.innerHTML =
      ['all', ...new Set(mock.map(({ company }) => company))]
        .map(company => `<li><button class='border px-3 py-1.5 xl:w-full xl:justify-start ${company === 'all' ? 'bg-slate-100' : 'bg-white'}' data-filter-btn data-id='${company}'>${capitalStr(company)}</button></li>`)
        .join('');
  }

  /**
   * Обработчик события клавиатурного ввода.
   * @param {Event} event - Событие клавиатурного ввода.
   */
  private handleKeyUp(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.companies.querySelectorAll('button').forEach(btn => btn.classList.add('bg-white'));
    this.products = mock.filter(({ title }) => title.toLowerCase().includes(target.value.toLowerCase()));
    this.renderProducts();
  }

  /**
   * Обработчик события клика на кнопки фильтров по компаниям.
   * @param {Event} event - Событие клика.
   */
  private handleFilter(event: Event): void {
    const target = event.target as HTMLButtonElement;
    if (target.dataset.filterBtn === '') {
      this.companies.querySelectorAll('button').forEach(btn => btn.classList.add('bg-white'));
      target.classList.remove('bg-white');
      target.classList.add('bg-slate-100');
      this.products = target.dataset.id === 'all' ? mock : mock.filter(({ company }) => company === target.dataset.id);
      this.form.reset();
      this.renderProducts();
    }
  }

  /**
   * Обработчик события очистки поля поиска.
   */
  private handleSearch(): void {
    this.products = mock;
    this.renderProducts();
  }
}

// Создание экземпляра класса для запуска приложения.
new ProductsFilter();
