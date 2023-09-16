import './style.scss';

/**
 * Класс для отображения статистических данных.
 */
class StatsDisplay {
  private numbers: NodeListOf<HTMLSpanElement>;

  /**
   * @constructor
   * Создает экземпляр класса StatsDisplay и инициализирует компонент.
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует компонент, создавая DOM-элементы и устанавливая обработчики событий.
   */
  initialize() {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает DOM-структуру для отображения статистики.
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='bg-white border shadow rounded max-w-4xl w-full p-3 grid gap-4'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Our stats</h1>
        <ul class='grid place-items-center text-center gap-3 lg:grid-cols-3'>
          <li>
            <span class='text-4xl font-bold sm:text-8xl' data-value='120'>0</span>
            <p class='font-medium'>Succeeded projects</p>
          </li>
          <li>
            <span class='text-4xl font-bold sm:text-8xl' data-value='140'>0</span>
            <p class='font-medium'>Working hours spent</p>
          </li>
          <li>
            <span class='text-4xl font-bold sm:text-8xl' data-value='150'>0</span>
            <p class='font-medium'>Happy clients</p>
          </li>
        </ul>
      </div>
    `;

    this.numbers = document.querySelectorAll('[data-value]')!;
  }

  /**
   * Устанавливает обработчики событий для элементов с данными.
   */
  private setupEventListeners(): void {
    this.numbers.forEach(n => this.init(n));
  }

  /**
   * Инкрементально увеличивает значение элемента до заданного значения с анимацией.
   * @param {HTMLSpanElement} element - Элемент, значение которого нужно увеличить.
   */
  private init(element: HTMLSpanElement): void {
    const value = parseInt(element.dataset.value);
    const increment = Math.ceil(value / 1000);
    let initialValue = 0;

    const increaseCount = setInterval(() => {
      initialValue += increment;

      if (initialValue > value) {
        element.textContent = `${value}+`;
        clearInterval(increaseCount);
        return;
      }

      element.textContent = `${initialValue}+`;
    }, 45);
  }
}

// Создание экземпляра класса StatsDisplay для запуска компонента.
new StatsDisplay();
