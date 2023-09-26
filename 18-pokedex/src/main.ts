import './style.css';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import axios from 'axios';

/**
 * Класс Pokedex представляет собой приложение для отображения списка покемонов из API.
 * @class
 */
class Pokedex {
  private pokemons: HTMLUListElement;
  private pagination: HTMLUListElement;
  private items: any[] = [];
  private count: number = 40;
  private index: number = 0;
  private pages: any[] = [];
  private colors: Record<string, string> = {
    fire: '#FDDFDF',
    grass: '#DEFDE0',
    electric: '#FCF7DE',
    water: '#DEF3FD',
    ground: '#f4e7da',
    rock: '#d5d5d4',
    fairy: '#fceaff',
    poison: '#98d7a5',
    bug: '#f8d5a3',
    dragon: '#97b3e6',
    psychic: '#eaeda1',
    flying: '#F5F5F5',
    fighting: '#E6E0D4',
    normal: '#F5F5F5',
  };

  /**
   * Создает экземпляр класса Pokedex и инициализирует его.
   * @constructor
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует приложение, создавая DOM-элементы и устанавливая обработчики событий.
   * @private
   */
  private initialize() {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает DOM-элементы для приложения.
   * @private
   */
  private createDOM():void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='grid gap-4 max-w-3xl mx-auto w-full items-start'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Pokedex</h1>
        <ul class='grid gap-3 sm:grid-cols-2 md:grid-cols-3' data-pokemons></ul>
        <ul class='flex justify-center items-center gap-3' data-pagination></ul>
      </div>
    `;

    this.pokemons = document.querySelector('[data-pokemons]')!;
    this.pagination = document.querySelector('[data-pagination]')!;
  }

  /**
   * Настраивает обработчики событий для приложения.
   * @private
   */
  private async setupEventListeners(): Promise<void> {
    const items = await this.fetchData();
    this.pages = this.paginate(items);
    this.renderUI();
    this.pagination.addEventListener('click', this.handleClick.bind(this));
  }

  /**
   * Загружает данные о покемонах из API и возвращает их в виде массива.
   * @private
   * @returns {Promise<any[]>} Массив с данными о покемонах.
   */
  private async fetchData(): Promise<any[]> {
    try {
      for (let i = 1; i < this.count; i++) {
        const { data: { id, name, types } } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`);
        const pokemonTypes = types.map(({ type: { name } }: any) => name);

        const item = {
          id,
          name: name[0].toUpperCase() + name.substring(1),
          pokemonId: id.toString().padStart(3, '0'),
          type: Object.keys(this.colors).find(type => pokemonTypes.indexOf(type) > -1),
          color: this.colors[Object.keys(this.colors).find(type => pokemonTypes.indexOf(type) > -1)],
        };

        this.items.push(item);
      }
      return this.items;
    } catch (e) {
      console.log(e);
      Toastify({
        text: '⛔️ Something went wrong, open dev console',
        className: 'bg-none shadow-none bg-orange-100 text-black border border-orange-200',
        duration: 3000,
        gravity: 'bottom',
        position: 'center',
      }).showToast();
    }
  }

  /**
   * Разбивает массив данных о покемонах на страницы с ограниченным количеством элементов на странице.
   * @private
   * @param {any[]} data - Массив данных о покемонах.
   * @returns {any[]} Массив страниц данных о покемонах.
   */
  private paginate(data: any[]): any[] {
    const itemsPerPage = 9;

    return Array.from({ length: Math.ceil(data.length / itemsPerPage) }, (_, index) => {
      const start = index * itemsPerPage;
      return data.slice(start, start + itemsPerPage);
    });
  }

  /**
   * Отображает интерфейс пользователя, включая список покемонов и элементы управления.
   * @private
   */
  private renderUI() {
    if (this.pokemons) {
      this.renderPokemons(this.pages[this.index]);
    }
    if (this.pagination) {
      this.renderButtons(this.pagination, this.pages, this.index);
    }
  }

  /**
   * Отображает список покемонов на странице.
   * @private
   * @param {any[]} items - Массив данных о покемонах для отображения.
   */
  private renderPokemons(items: any[]) {
    if (this.pokemons) {
      this.pokemons.innerHTML = `
      ${items.map(({ id, name, pokemonId, type, color }: any) => `
        <li class='border rounded-lg overflow-hidden min-h-[248px]'>
          <div class='flex justify-center items-center p-2' style='background-color: ${color}'>
            <img src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png' alt='${name}'>
          </div>
          <div class='bg-white grid gap-2 place-items-center p-3'>
            <span class='rounded-xl bg-neutral-500 p-1.5 font-medium text-white'>#${pokemonId}</span>
            <h3 class='h5'>${name}</h3>
            <div class='flex'><p class='font-bold'>Type</p>: ${type}</div>
          </div>
        </li>
      `).join('')}
      `;
    }
  };

  /**
   * Отображает кнопки для переключения между страницами.
   * @private
   * @param {Element | null} container - Контейнер для кнопок.
   * @param {any[]} pages - Массив страниц данных о покемонах.
   * @param {number} activeIndex - Индекс активной страницы.
   */
  private renderButtons(container: Element | null, pages: any[], activeIndex: number) {
    if (container) {
      let buttons = pages.map((_, pageIndex) => `<li><button class='px-4 py-1.5 border rounded hover:bg-slate-50 ${activeIndex === pageIndex ? 'bg-slate-100' : 'bg-white'}' data-index='${pageIndex}'>${pageIndex + 1}</button></li>`);
      buttons.push(`<li>${this.index >= this.pages.length - 1 ? `<button class='px-2 py-1.5 border rounded bg-gray-100 cursor-not-allowed' data-type='next' disabled>Next</button>` : `<button class='bg-white px-2 py-1.5 border rounded hover:bg-slate-50' data-type='next'>Next</button>`}</li>`);
      buttons.unshift(`<li>${this.index <= 0 ? `<button class='px-2 py-1.5 border rounded bg-gray-100 cursor-not-allowed' data-type='prev' disabled>Prev</button>` : `<button class='bg-white px-2 py-1.5 border rounded hover:bg-slate-50' data-type='prev'>Prev</button>`}</li>`);
      container.innerHTML = buttons.join('');
    }
  };

  /**
   * Обработчик кликов на элементы интерфейса.
   * @private
   * @param {Event} event - Объект события клика.
   */
  private handleClick({ target }: any) {
    if (target.dataset.pagination) return;
    if (target.dataset.index) this.index = parseInt(target.dataset.index);
    if (target.dataset.type === 'next') this.index++;
    if (target.dataset.type === 'prev') this.index--;
    this.renderUI();
  };
}

// Создание экземпляра класса Pokedex при загрузке страницы.
new Pokedex();
