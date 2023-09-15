import './style.scss';
import menu from '../src/mock/index.js';
import { capitalStr } from './utils/capitalStr.ts';

/**
 * Меню.
 * @property {number} id - Идентификатор.
 * @property {string} title - Заголовок.
 * @property {string} category - Категория.
 * @property {number} price - Цена.
 * @property {string} img - Ссылка на изображение.
 * @property {string} desc - Описание.
 */
interface Menu {
  id: number,
  title: string,
  category: string,
  price: number,
  img: string,
  desc: string,
}

/**
 * Класс для фильтрации продуктов.
 */
class ProductsFilter {
  /**
   * Элемент списка фильтров.
   * @private
   * @type {HTMLUListElement}
   */
  private filtersList: HTMLUListElement;
  /**
   * Элемент списка продуктов.
   * @private
   * @type {HTMLUListElement}
   */
  private productsList: HTMLUListElement;
  /**
   * Массив продуктов.
   * @private
   * @type {Menu[]}
   */
  private products: Menu[] = menu;

  /**
   * Создает экземпляр класса ProductFilter.
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
      <div class='max-w-6xl w-full mx-auto grid gap-3 items-start'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Products Filter</h1>
        <div class='grid gap-3'>
          <ul class='flex gap-3 justify-center flex-wrap' data-filters></ul>
          <ul class='grid sm:grid-cols-2 md:grid-cols-3 gap-3' data-products></ul>
        </div>
      </div>
    `;

    this.filtersList = root.querySelector('[data-filters]')!;
    this.productsList = root.querySelector('[data-products]')!;
  }

  /**
   * Устанавливает обработчики событий.
   * @private
   */
  private setupEventListeners(): void {
    this.renderButtons(this.products);
    this.renderItems(this.products);
    this.filtersList.addEventListener('click', this.handleClick.bind(this));
  }

  /**
   * Отображает кнопки фильтров.
   * @private
   * @param {Menu[]} items - Массив продуктов.
   * @returns {string} HTML-разметка кнопок фильтров.
   */
  private renderButtons(items: Menu[]): string {
    return this.filtersList.innerHTML = `
      <li><button class='px-3 py-1.5 rounded-md border bg-slate-300' data-id='all'>All</button></li>
      ${[...new Set(items.map((i) => i.category))].map(category => `<li><button class='bg-white px-3 py-1.5 rounded-md border hover:bg-slate-300' data-id='${category}'>${capitalStr(category)}</button></li>`).join('')}`;
  }

  /**
   * Отображает продукты.
   * @private
   * @param {Menu[]} items - Массив продуктов.
   */
  private renderItems(items: Menu[]) {
    return this.productsList.innerHTML = `
      ${items.map(({ id, title, price, img, desc }: Menu): string => `
        <li class='bg-white rounded border overflow-hidden' data-id='${id}'>
          <div class=''>
            <img class='max-h-[250px] min-h-[250px] h-full w-full object-cover' src='${img}' alt='${title}'>
          </div>
          <div class='grid p-3 gap-3'>
            <div class='grid gap-3'>
              <h4 class='font-bold text-lg'>${title}</h4>
              <p>$${price}</p>
            </div>
            <p>${desc}</p>
          </div>
        </li>
        `).join('')}
      `;
  }

  /**
   * Обработчик события клика на кнопки фильтров.
   * @private
   * @param {Event} event - Событие клика.
   */
  private handleClick(event: Event) {
    const target = event.target as HTMLButtonElement;
    this.filtersList.querySelectorAll('button').forEach(btn => btn.classList.remove('bg-slate-300'));

    if (target.tagName === 'BUTTON') {
      target.classList.remove('bg-white');
      target.classList.add('bg-slate-300');
      const { dataset: { id } } = target;
      this.renderItems(id === 'all' ? this.products : this.products.filter(({ category }) => category === id));
    }
  }
}

// Создание экземпляра класса для запуска приложения.
new ProductsFilter();
