import './style.scss';

/**
 * Класс Cookies представляет компонент для управления согласием на использование файлов cookie.
 * @class
 */
class Cookies {
  private container: HTMLDivElement;
  private btnAccept: HTMLButtonElement;
  private btnDecline: HTMLButtonElement;

  /**
   * Создает экземпляр класса Cookies и инициализирует его.
   * @constructor
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует компонент, создавая DOM-структуру и устанавливая обработчики событий.
   * @private
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает DOM-структуру компонента.
   * @private
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='fixed bg-white max-w-md p-3 rounded-lg shadow left-5 bottom-5 grid gap-3' data-container>
        <h3 class='flex gap-3 items-center font-bold text-lg'>
          <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke-width='1.5'><path stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' d='M21.8 14c-.927 4.564-4.962 8-9.8 8-5.523 0-10-4.477-10-10 0-5.185 3.947-9.449 9-9.95'/><path stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' d='M6.5 10a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1ZM20.5 4a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1ZM12 19a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM7 15.01l.01-.011M17 15.01l.01-.011M11 12.01l.01-.011M21 9.01l.01-.011M17 6.01l.01-.011M11 2c-.5 1.5.5 3 2.085 3C11 8.5 13 12 18 11.5c0 2.5 2.5 3 3.7 2.514'/></svg>
          Cookies Consent
        </h3>
        <p>This website use cookies to help you have a superior and more relevant browsing experience on the website.</p>
        <a class='text-purple-500' href='#'>Read more</a>
        <div class='flex gap-2 items-center'>
          <button class='px-3 py-2 border hover:bg-purple-400 bg-purple-500 text-white' data-accept>Accept</button>
          <button class='px-3 py-2 border hover:bg-slate-50' data-decline>Decline</button>
        </div>
      </div>
    `;
    this.container = root.querySelector('[data-container]')!;
    this.btnAccept = root.querySelector('[data-accept]')!;
    this.btnDecline = root.querySelector('[data-decline]')!;
  }

  /**
   * Устанавливает обработчики событий, вызывает инициализацию файлов cookie при загрузке страницы.
   * @private
   */
  private setupEventListeners(): void {
    window.addEventListener('load', this.initCookies.bind(this));
  }

  /**
   * Инициализирует согласие на файлы cookie и устанавливает обработчики кнопок.
   * @private
   */
  private initCookies(): void {
    if (document.cookie.includes('customCookies')) {
      this.container.style.display = 'none';
      this.container.className = `hidden`;
      return;
    }
    this.container.classList.remove('hidden');
    [this.btnAccept, this.btnDecline].forEach(button => button.addEventListener('click', this.handleClick.bind(this)));
  }

  /**
   * Обрабатывает событие нажатия кнопки "Accept" или "Decline".
   * @param {MouseEvent} event - Событие нажатия кнопки.
   * @private
   */
  private handleClick(event: MouseEvent): void {
    const target = event.target as HTMLButtonElement;
    this.container.className = `hidden`;
    document.cookie = target.matches('[data-accept]') ? `cookieBy= customCookies; max-age=${60 * 60 * 24 * 30}` : '';
  }
}

// Создаем экземпляр класса Cookies.
new Cookies();
