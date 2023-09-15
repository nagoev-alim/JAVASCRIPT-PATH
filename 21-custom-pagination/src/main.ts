import './style.scss';
import axios from 'axios';
import { toast } from './utils/toast.ts';

/**
 * Интерфейс для профиля пользователя на GitHub.
 * @interface
 */
interface GitHubUser {
  avatar_url: string;
  login: string;
  html_url: string;
}

/**
 * Интерфейс для ответа от GitHub API.
 * @interface
 */
interface GitHubResponse {
  data: GitHubUser[];
}

/**
 * Класс для реализации пользовательской пагинации.
 * @class
 */
class CustomPagination {
  /**
   * Элемент списка пользователей.
   * @private
   * @type {HTMLUListElement}
   */
  private users: HTMLUListElement;

  /**
   * Элемент пагинации.
   * @private
   * @type {HTMLUListElement}
   */
  private pagination: HTMLUListElement;

  /**
   * URL для запроса данных с GitHub API.
   * @private
   * @type {string}
   */
  private readonly URL: string = 'https://api.github.com/users?since=1&per_page=40';

  /**
   * Текущий индекс страницы.
   * @private
   * @type {number}
   */
  private index: number = 0;

  /**
   * Массив страниц данных GitHub пользователей.
   * @private
   * @type {GitHubUser[][]}
   */
  private pages: GitHubUser[][] = [];

  /**
   * Создает экземпляр класса CustomPagination.
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
      <div class='max-w-3xl w-full mx-auto p-3 grid gap-4'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Custom Pagination</h1>
        <ul class='grid sm:grid-cols-2 md:grid-cols-3 gap-3' data-users></ul>
        <ul class='flex gap-3 justify-center items-center flex-wrap' data-pagination></ul>
      </div>
    `;
    this.users = root.querySelector('[data-users]')!;
    this.pagination = root.querySelector('[data-pagination]')!;
  }

  /**
   * Устанавливает обработчики событий.
   * @private
   */
  private async setupEventListeners(): Promise<void> {
    const { data: users } = await this.fetchData() as GitHubResponse;
    this.pages = this.paginate(users);
    this.renderUI();
    this.pagination.addEventListener('click', this.handleClick.bind(this));
  }

  /**
   * Получает данные с GitHub API.
   * @private
   * @returns {Promise<GitHubResponse>} Ответ с данными GitHub пользователей.
   */
  private async fetchData(): Promise<GitHubResponse> {
    try {
      return await axios.get(this.URL);
    } catch (e) {
      toast('Something went wrong, open dev console', 'warning');
      console.error(e);
      return { data: [] };
    }
  }

  /**
   * Разбивает данные на страницы.
   * @private
   * @param {GitHubUser[]} items - Массив данных GitHub пользователей.
   * @returns {GitHubUser[][]} Массив страниц данных GitHub пользователей.
   */
  private paginate(items: GitHubUser[]): GitHubUser[][] {
    const itemsPerPage: number = 10;
    return Array.from({ length: Math.ceil(items.length / itemsPerPage) }, (_, index) => {
      const start: number = index * itemsPerPage;
      return items.slice(start, start + itemsPerPage);
    });
  }

  /**
   * Отрисовывает пользователей и кнопки пагинации.
   * @private
   */
  private renderUI(): void {
    this.renderUsers(this.pages[this.index]);
    this.renderButtons(this.pagination, this.pages, this.index);
  }

  /**
   * Отрисовывает пользователей.
   * @private
   * @param {GitHubUser[]} data - Массив данных GitHub пользователей для отображения.
   */
  private renderUsers(data: GitHubUser[]): void {
    this.users.innerHTML = `
      ${data.map(({ avatar_url, login, html_url }: GitHubUser): string => `
        <li class='bg-white rounded overflow-hidden border min-h-[324px]'>
          <img class='w-full object-cover' src='${avatar_url}' alt='${login}'>
          <div class='p-4 grid gap-2 place-items-center'>
            <h4 class='font-bold text-lg'>${login}</h4>
            <a class='border px-3 py-2.5 hover:bg-gray-100 transition-colors rounded' href='${html_url}' target='_blank'>View profile</a>
          </div>
        </li>
      `).join('')}
    `;
  }

  /**
   * Отрисовывает кнопки пагинации.
   * @private
   * @param {HTMLUListElement} container - Контейнер для кнопок пагинации.
   * @param {GitHubUser[][]} pages - Массив страниц данных GitHub пользователей.
   * @param {number} activeIndex - Индекс активной страницы.
   */
  private renderButtons(container: HTMLUListElement, pages: GitHubUser[][], activeIndex: number): void {
    let buttons: string[] = pages.map((_, pageIndex): string => `
      <li>
        <button class='px-4 py-1.5 border rounded hover:bg-slate-50 ${activeIndex === pageIndex ? 'bg-slate-100' : 'bg-white'}' data-index='${pageIndex}'>${pageIndex + 1}</button>
      </li>`);

    buttons.push(`
      <li>
        ${this.index >= this.pages.length - 1
      ? `<button class='px-2 py-1.5 border rounded bg-gray-100 cursor-not-allowed' data-type='next' disabled>Next</button>`
      : `<button class='bg-white px-2 py-1.5 border rounded hover-bg-slate-50' data-type='next'>Next</button>`}
      </li>`);

    buttons.unshift(`
      <li>
        ${this.index <= 0
      ? `<button class='px-2 py-1.5 border rounded bg-gray-100 cursor-not-allowed' data-type='prev' disabled>Prev</button>`
      : `<button class='bg-white px-2 py-1.5 border rounded hover-bg-slate-50' data-type='prev'>Prev</button>`}
      </li>`);

    container.innerHTML = buttons.join('');
  }

  /**
   * Обработчик события клика на кнопки пагинации.
   * @private
   * @param {Event} event - Событие клика.
   */
  private handleClick(event: Event): void {
    const target = event.target as HTMLButtonElement;
    if (target.dataset.pagination) return;
    if (target.dataset.index) this.index = parseInt(target.dataset.index);
    if (target.dataset.type === 'next') this.index++;
    if (target.dataset.type === 'prev') this.index--;
    this.renderUI();
  }
}

// Создание экземпляра класса для запуска приложения.
new CustomPagination();
