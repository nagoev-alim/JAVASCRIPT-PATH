import './style.scss';
import states from './mock/states.json';

/**
 * Интерфейс представляющий состояние (штат).
 */
interface State {
  abbr: string,
  name: string,
  capital: string,
  lat: string,
  long: string
}

/**
 * Класс для поиска столицы штата по его названию или аббревиатуре.
 */

class StateCapitalLookup {
  /**
   * Элемент ввода пользовательского запроса.
   */
  private input: HTMLInputElement;

  /**
   * Список результатов поиска.
   */
  private list: HTMLUListElement;

  /**
   * Создает экземпляр StateCapitalLookup.
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует компонент:
   * - Создает DOM элементы.
   * - Назначает обработчики событий.
   */
  private initialize():void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает DOM элементы и добавляет их на страницу.
   */
  private createDOM():void {
    const root:HTMLDivElement = document.querySelector('#app')!;
    if (!root) return;

    root.innerHTML = `
      <div class='bg-white border shadow rounded max-w-md w-full p-3 grid gap-4'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>State Capital Lookup</h1>
        <input class='bg-slate-50 border-2 rounded px-3 py-2.5 focus:outline-none focus:border-blue-400' type='text' placeholder='Enter state name or abbreviation...' data-input>
        <ul class='grid gap-3' data-list></ul>
      </div>
    `;
    this.input = root.querySelector('[data-input]')!;
    this.list = root.querySelector('[data-list]')!;
  }

  /**
   * Назначает обработчик события ввода для элемента input.
   */
  private setupEventListeners(): void {
    this.input.addEventListener('input', this.handleChange.bind(this));
  }

  /**
   * Обработчик события ввода, который выполняет поиск и отображение результатов.
   * @param event Событие ввода
   */
  private async handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    let matches = states.filter(({ name, abbr }: { name: string, abbr: string }) => {
      const regex = new RegExp(`^${target.value.toLowerCase()}`, 'gi');
      return name.toLowerCase().match(regex) || abbr.toLowerCase().match(regex);
    });

    if (target.value.length === 0) {
      matches = [];
      this.list.innerHTML = ``;
    }

    if (matches.length > 0) {
      this.list.innerHTML = `
        ${matches.map(({ name, abbr, capital, lat, long }: State): string => `
        <li class='border-2 bg-gray-50 rounded grid place-items-center p-3 text-center gap-1.5'>
          <h5 class='font-bold'>${name} (${abbr}):</h5>
          <div class='grid gap-1.5'>
            <p>${capital}</p>
            <p>Lat: ${lat} / Long: ${long}</p>
          </div>
        </li>
        `).join('')}
        `;
    } else {
      this.list.innerHTML = ``;
      if (target.value.length !== 0) {
        this.list.innerHTML = `<li class='text-center font-bold'>No matches</li>`;
      }
    }
  }
}

// Создание экземпляра StateCapitalLookup для инициализации компонента.
new StateCapitalLookup();
