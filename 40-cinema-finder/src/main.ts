import './style.scss';
import feather from 'feather-icons';
import axios, { AxiosInstance } from 'axios';
import { toast } from './utils/toast.ts';

/**
 * Интерфейс для описания объекта фильма.
 * @interface
 */
interface Film {
  nameEn: string | null;
  nameRu: string;
  rating: string | null;
  posterUrl: string;
  filmId: string;
}

/**
 * Класс Cinema представляет приложение для поиска фильмов.
 * @class
 */
class Cinema {
  private form: HTMLFormElement;
  private resultEl: HTMLUListElement;
  private overlay: HTMLDivElement;
  private modal: HTMLElement;
  private more: HTMLButtonElement;
  private readonly url: string = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/';
  private readonly keyword: string = 'search-by-keyword?keyword=';
  private readonly top: string = 'top?type=TOP_250_BEST_FILMS';
  private readonly key: string = 'acda60f6-b930-4677-b4fe-add4a929410a';
  private instance: AxiosInstance;
  private currentPage: number = 1;
  private countPage: number | null = null;
  private result: Film[] | null;
  private currentType: string = '';

  /**
   * Создает экземпляр класса Cinema и инициализирует приложение.
   * @constructor
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует приложение, создавая DOM-элементы.
   * @private
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Метод создает и вставляет структуру DOM-элементов для приложения Cinema Finder.
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='grid gap-2 items-start max-w-7xl w-full mx-auto'>
        <header class='border shadow rounded bg-white p-3 grid gap-3 place-items-center w-full sm:grid-cols-[auto_300px] sm:place-items-baseline'>
          <h2>
            <a class='font-bold' href='/'>Cinema Finder</a>
          </h2>
          <form class='w-full' data-form>
            <label>
              <input class='px-3 py-2 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50' type='search' name='query' placeholder='Enter name'>
            </label>
          </form>
        </header>

        <main class='grid gap-4'>
          <ul class='grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' data-list></ul>
          <div class='flex justify-center'>
            <button class='hidden x-3 py-2 border hover:bg-slate-50' data-more>More</button>
          </div>
        </main>

        <div class='fixed bg-neutral-900/40 w-full h-full top-0 left-0 right-0 bottom-0 grid place-items-center p-3 hidden' data-overlay>
          <section class='max-w-lg w-full bg-white p-3 grid gap-3 rounded' data-modal></section>
        </div>
      </div>
    `;
    this.form = root.querySelector('[data-form]')!;
    this.resultEl = root.querySelector('[data-list]')!;
    this.overlay = root.querySelector('[data-overlay]')!;
    this.modal = root.querySelector('[data-modal]')!;
    this.more = root.querySelector('[data-more]')!;
  }

  /**
   * Устанавливает обработчики событий.
   * @private
   */
  private setupEventListeners(): void {
    this.instance = axios.create({
      baseURL: this.url,
      headers: {
        'X-API-KEY': this.key,
        'Content-Type': 'application/json',
      },
    });
    this.currentType = this.top;
    this.handleFetch(this.currentType);

    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    this.resultEl.addEventListener('click', this.handleElementClick.bind(this));
    this.overlay.addEventListener('click', this.handleModal.bind(this));
    this.more.addEventListener('click', this.handleMoreClick.bind(this));
    document.addEventListener('keydown', this.handleKeyModal.bind(this));
  }

  /**
   * Обработчик запроса данных о фильмах.
   * @param {string} url - URL-адрес запроса.
   * @returns {Promise<void>}
   * @private
   */
  private async handleFetch(url: string): Promise<void> {
    try {
      this.resultEl.innerHTML = `<p class='font-medium text-lg'>Loading...</p>`;
      const { data: { films, pagesCount } } = await this.instance.get(`${url}&page=${this.currentPage}`);

      if (films.length === 0) {
        toast('Nothing found, you will be redirect to home page', 'warning');
        setTimeout(() => location.reload(), 4000);
        return;
      }

      this.result = films;
      this.countPage = pagesCount;
      this.renderData(this.result);
    } catch (e) {
      toast('Something went wrong, open dev console', 'error');
      console.log(e);
    }
  }

  /**
   * Отображает данные о фильмах.
   * @param {Film[]} data - Массив объектов фильмов.
   * @private
   */
  private renderData(data: Film[]): void {
    this.resultEl.innerHTML = `
      ${Array.from(data).map(({ nameEn, nameRu, rating, posterUrl, filmId }) => {
      return `
      <li class='bg-white overflow-hidden border-2 rounded' data-id='${filmId}'>
        <div class=''>
          <img src='${posterUrl}' alt='${nameEn === null ? nameRu : nameEn}'>
        </div>
        <div class='p-3 grid gap-3'>
          <h5 class='font-bold'>${nameEn === null ? nameRu : nameEn}</h5>
          <p class='max-w-max bg-gray-400 rounded px-2 py-1 text-white'>${rating === 'null' ? '-' : rating}</p>
          <button class='px-3 py-2 border hover:bg-slate-50' data-detail>Detail</button>
        </div>
      </li>
      `;
    }).join('')}`;

    this.more.className = `px-3 py-2 border bg-white hover:bg-slate-50 ${this.currentPage < this.countPage ? '' : 'hidden'}`;
  }

  /**
   * Обработчик отправки формы поиска.
   * @param {Event} event - Событие отправки формы.
   * @private
   */
  private async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const query = formData.get('query') as string;

    if (query.length === 0) {
      toast('Please fill the field', 'warning');
      return;
    }

    this.currentPage = 1;
    this.currentType = `${this.keyword}${query}`;
    await this.handleFetch(this.currentType);
  }

  /**
   * Обработчик клика на элемент фильма для отображения деталей.
   * @param {MouseEvent} event - Событие клика.
   * @returns {Promise<void>}
   * @private
   */
  private async handleElementClick(event: MouseEvent): Promise<void> {
    const target = event.target as HTMLButtonElement;
    if (target.matches('[data-detail=""]')) {
      const {
        data: {
          data: {
            description,
            filmLength,
            nameEn,
            nameRu,
            posterUrl,
            posterUrlPreview,
            webUrl,
            year,
          },
        },
      } = await this.instance.get(target.closest('li')!.getAttribute('data-id'));

      this.modal.innerHTML = `
        <button class='max-w-max justify-self-end' data-close><span class='pointer-events-none'>${feather.icons.x.toSvg()}</span></button>
        <div class='flex justify-center'>
          <img class='max-w-[300px]' src='${posterUrl ? posterUrl : posterUrlPreview}' alt='${nameEn ? nameEn : nameRu}'>
        </div>
        <div class='grid gap-3'>
          <h5 class='font-bold'>${nameEn ? nameEn : nameRu} (${year})</h5>
          <p>${description}</p>
          <p>Duration: ${filmLength}</p>
          <a class='flex justify-center items-center px-3 py-2 border rounded hover:bg-slate-50' href='${webUrl}' target='_blank'>More</a>
        </div>
      `;

      this.overlay.classList.remove('hidden');
    }
  }

  /**
   * Обработчик закрытия модального окна.
   * @param {MouseEvent} event - Событие клика.
   * @private
   */
  private handleModal(event: MouseEvent): void {
    const target = event.target as HTMLButtonElement | HTMLDivElement;
    if ((target.matches('[data-close]') || target.matches('[data-overlay]'))) {
      this.overlay.classList.add('hidden');
    }
  }

  /**
   * Обработчик клика на кнопку "More" для загрузки дополнительных фильмов.
   * @returns {Promise<void>}
   * @private
   */
  private async handleMoreClick(): Promise<void> {
    if (this.countPage && this.currentPage < this.countPage) {
      this.currentPage++;
      const { data: { films } } = await this.instance.get(`${this.currentType}&page=${this.currentPage}`);
      this.result = [...this.result, ...films];
      this.renderData(this.result);
    } else {
      this.more.classList.add('hidden');
    }
  }

  /**
   * Обработчик клавиши Esc для закрытия модального окна.
   * @param {KeyboardEvent} event - Событие нажатия клавиши.
   * @private
   */
  private handleKeyModal(event: KeyboardEvent): void {
    const key = event.key;
    if (key === 'Escape') {
      this.overlay.classList.add('hidden');
    }
  }
}

new Cinema();
