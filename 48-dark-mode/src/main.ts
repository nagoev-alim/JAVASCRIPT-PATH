import './style.scss';
import feather from 'feather-icons';

/**
 * Класс, представляющий приложение для переключения темы (светлая/темная).
 */
class DarkMode {
  /**
   * Кнопка для переключения темы.
   * @type {HTMLButtonElement}
   * @private
   */
  private button: HTMLButtonElement;

  /**
   * Создает экземпляр класса DarkMode и инициализирует его.
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует приложение, создавая DOM-элементы и устанавливая обработчики событий.
   * @private
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает DOM-элементы приложения и добавляет их на страницу.
   * @private
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='grid gap-4'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Dark Mode</h1>
        <button data-toggle>${feather.icons.moon.toSvg()}</button>
      </div>
    `;

    this.button = root.querySelector('[data-toggle]')!;
  }

  /**
   * Устанавливает обработчики событий для элементов приложения.
   * @private
   */
  private setupEventListeners(): void {
    this.storageGet();
    this.button.addEventListener('click', this.toggleTheme.bind(this));
  }

  /**
   * Получает текущую тему из локального хранилища и применяет её к приложению.
   * @private
   */
  private storageGet(): void {
    if (localStorage.getItem('theme')) {
      const isSetTheme = localStorage.getItem('theme') === 'light';
      this.button.innerHTML = isSetTheme ? feather.icons.moon.toSvg() : feather.icons.sun.toSvg();
      document.documentElement.className = `${isSetTheme ? '' : 'dark-theme'}`;
    }
  }

  /**
   * Обрабатывает событие переключения темы.
   * @param {Object} event - Событие клика на кнопке.
   * @param {HTMLButtonElement} event.target - HTML-элемент кнопки.
   * @private
   */
  private toggleTheme({ target }: { target: HTMLButtonElement }): void {
    const isSetTheme = document.documentElement.classList.toggle('dark-theme');
    target.innerHTML = isSetTheme ? feather.icons.sun.toSvg() : feather.icons.moon.toSvg();
    localStorage.setItem('theme', isSetTheme ? 'dark' : 'light');
  }
}

// Создаем экземпляр класса для запуска приложения.
new DarkMode();
