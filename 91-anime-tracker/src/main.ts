import './style.scss';
import { toast } from './utils/toast.ts';
import axios from 'axios';

interface AnimeResult {
  mal_id: number;
  title: string;
  images: { jpg: { image_url: string } };
  episodes: number;
}

interface AnimeStored {
  id: number;
  title: string;
  img: string;
  episodes: number;
  episodesFinish: number;
}
/**
 * @file Основной класс AnimeTracker, отвечающий за отслеживание и управление списком аниме.
 * @class
 */
class AnimeTracker {
  private searchResults: AnimeResult[] = [];
  private storedResults: AnimeStored[] = [];
  private form: HTMLFormElement;
  private searchList: HTMLUListElement;
  private storedList: HTMLUListElement;
  /**
   * Создает экземпляр класса AnimeTracker.
   * @constructor
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализация приложения.
   * Создает DOM-элементы, устанавливает слушатели событий.
   * @private
   */
  private initialize() {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает DOM-структуру приложения.
   * @private
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='max-w-2xl w-full p-3 grid gap-4'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Anime Tracker</h1>
        <div class='grid gap-3'>
          <form data-form class='bg-white rounded border p-3 grid gap-3'>
            <input class='px-3 py-2 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50' type='text' name='query' placeholder='Enter anime name'>
            <button class='px-3 py-2 border hover:bg-slate-50' type='submit'>Search</button>
          </form>
          <ul class='grid items-start grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 max-h-[500px] overflow-auto p-3 bg-white border rounded hidden' data-search></ul>
          <ul class='bg-white rounded border p-3 grid gap-3 hidden' data-stored></ul>
        </div>
      </div>
    `;
    this.form = root.querySelector('[data-form]')!;
    this.searchList = root.querySelector('[data-search]')!;
    this.storedList = root.querySelector('[data-stored]')!;
  }
  /**
   * Устанавливает слушатели событий для формы и списков.
   * @private
   */
  private setupEventListeners(): void {
    this.storedResults = this.storageGet();
    this.storageDisplay();
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    this.searchList.addEventListener('click', this.handleSearchClick.bind(this));
    this.storedList.addEventListener('click', this.handleStoredClick.bind(this));
  }
  /**
   * Получает данные из локального хранилища.
   * @returns {AnimeStored[]} Массив объектов, представляющих хранящиеся аниме.
   * @private
   */
  private storageGet(): AnimeStored[] | [] {
    const entries = localStorage.getItem('anime');
    return entries ? JSON.parse(entries) : [];
  }
  /**
   * Отображает данные из локального хранилища.
   * @private
   */
  private storageDisplay():void {
    const storedList = this.storageGet();
    if (storedList.length === 0) {
      this.storedList.classList.add('hidden');
      return;
    }
    this.storedList.classList.remove('hidden');
    this.renderStore(storedList);
  }
  /**
   * Отображает список хранимых аниме.
   * @param {AnimeStored[]} data - Массив объектов, представляющих хранящиеся аниме.
   * @private
   */
  private renderStore(data: AnimeStored[]):void {
    this.storedList.innerHTML = '';
    for (const { img, title, id, episodes, episodesFinish } of data) {
      const li = document.createElement('li');
      li.className = 'grid gap-3 p-3 border rounded sm:grid-cols-[auto_auto]';
      li.innerHTML = `
        <div class='grid grid-cols-[100px_auto] items-center gap-2'>
          <img src='${img}' alt='${title}'>
          <h3 class='font-bold'><a href='https://myanimelist.net/anime/${id}/${title}' target='_blank'>${title}</a></h3>
        </div>
        <div class='body grid grid-cols-[auto_auto] items-center gap-3 sm:justify-end' data-id='${id}'>
          <div class='flex'>
            <span data-finished>${episodesFinish}</span>/<span data-all-episodes>${episodes}</span>
          </div>
          <div class='flex gap-2'>
            <button class='px-3 border hover:bg-slate-50' data-plus>+</button>
            <button class='px-3 border hover:bg-slate-50' data-minus>-</button>
            <button class='px-3 py-2 border hover:bg-slate-50' data-trash='${id}'>Remove</button>
          </div>
        </div>
      `;
      this.storedList.append(li);
    }
  }
  /**
   * Обрабатывает отправку формы поиска аниме.
   * @param {Event} event - Событие отправки формы.
   * @private
   */
  private handleSubmit(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const query = formData.get('query') as string;
    if (query.length === 0) {
      toast('Please fill the field', 'warning');
      return;
    }
    this.fetchAnime(query);
  }
  /**
   * Осуществляет поиск аниме по запросу.
   * @param {string} query - Запрос для поиска аниме.
   * @returns {Promise<void>}
   * @private
   */
  private async fetchAnime(query: string): Promise<void> {
    const button = this.form.querySelector('button')!;
    try {
      button.textContent = 'Loading...';
      const { data: { data } } = await axios.get(`https://api.jikan.moe/v4/anime?q=${query}`);
      this.searchResults = data;
      if (this.searchResults.length === 0) {
        toast('Something went wrong, open developer console', 'error');
        button.textContent = 'Search';
        return;
      }
      this.renderHTML(this.searchResults);
      button.textContent = 'Search';
    } catch (e) {
      toast('Something went wrong, open developer console', 'error');
      button.textContent = 'Search';
      console.log(e);
    }
  }
  /**
   * Отображает результаты поиска аниме.
   * @param {AnimeResult[]} data - Массив объектов, представляющих результаты поиска.
   * @private
   */
  private renderHTML(data: AnimeResult[]): void {
    this.searchList.classList.remove('hidden');
    this.searchList.innerHTML = ``;
    for (const anime of data) {
      const li = document.createElement('li');
      li.setAttribute('data-id', anime.mal_id);
      li.className = 'p-1 border rounded grid gap-2 items-start';
      li.innerHTML = `
          <img src='${anime.images.jpg.image_url}' alt='${anime.title}'>
            <a class='font-medium text-sm' href='https://myanimelist.net/anime/${anime.mal_id}/${anime.title}' target='_blank'>
              ${anime.title}
            </a>
            <button class='px-3 py-2 border hover:bg-slate-50' data-add='${JSON.stringify({
        episodes: anime.episodes,
        title: anime.title,
        id: anime.mal_id,
        img: anime.images.jpg.image_url,
      })}'
          >Add To List</button>
    `;
      li.querySelector('button').disabled = this.storedResults.find(({ id }) => id === anime.mal_id);
      this.searchList.appendChild(li);
    }
  }
  /**
   * Обрабатывает клик по элементам результатов поиска аниме.
   * @param {Event} event - Событие клика.
   * @private
   */
  private handleSearchClick({ target }): void {
    if (target.matches('[data-add]')) {
      target.disabled = true;
      const { episodes, title, id, img } = JSON.parse(target.dataset.add);
      this.storedResults = [...this.storedResults, { episodes, title, id, img, episodesFinish: 0 }];
      this.storedList.classList.remove('hidden');
      this.storageSet(this.storedResults);
      this.renderStore(this.storedResults);
    }
  }
  /**
   * Устанавливает данные об аниме в список хранящихся аниме.
   * @param {Object} data - Данные об аниме.
   * @private
   */
  private storageSet(data): void {
    return localStorage.setItem('anime', JSON.stringify(data));
  }
  /**
   * Обрабатывает клик по элементам хранящихся аниме.
   * @param {Event} event - Событие клика.
   * @private
   */
  private handleStoredClick({ target }): void {
    if (target.matches('[data-plus]')) {
      const body = target.closest('.body');
      const watchedCount = body.querySelector('[data-finished]');
      const episodesFinish = body.querySelector('[data-all-episodes]');
      let watchedCountValue = parseInt(watchedCount.textContent);
      if (watchedCountValue !== parseInt(episodesFinish.textContent)) {
        watchedCountValue++;
        watchedCount.innerHTML = watchedCountValue;
        this.storedResults = this.storedResults.map(anime => anime.id === parseInt(body.dataset.id) ? {
          ...anime,
          episodesFinish: watchedCountValue,
        } : anime);
        this.storageSet(this.storedResults);
      }
    }

    if (target.matches('[data-minus]')) {
      const body = target.closest('.body');
      const watchedCount = body.querySelector('[data-finished]');
      let watchedCountValue = parseInt(watchedCount.textContent);
      if (watchedCountValue !== 0) {
        watchedCountValue--;
        watchedCount.innerHTML = watchedCountValue;
        this.storedResults = this.storedResults.map(anime => anime.id === parseInt(body.dataset.id) ? {
          ...anime,
          episodesFinish: watchedCountValue,
        } : anime);

        this.storageSet(this.storedResults);
      }
    }

    if (target.matches('[data-trash]')) {
      if (confirm('Are you sure?')) {
        const ID = parseInt(target.dataset.trash);
        const searchItems = Array.from(this.searchList.querySelectorAll('li'));
        target.closest('li').remove();
        this.storedResults = this.storedResults.filter(({ id }) => id !== ID);
        this.storageSet(this.storedResults);
        this.renderStore(this.storedResults);
        if (this.storedResults.length === 0) {
          this.storedList.classList.add('hidden');
        }
        if (searchItems.length !== 0) {
          searchItems.forEach(li => {
            if (parseInt(li.dataset.id) === ID) li.querySelector('button').disabled = false;
          });
        }
      }
    }
  }
}
// Создание экземпляра класса AnimeTracker.
new AnimeTracker();
