import './style.css';
import feather from 'feather-icons';

/**
 * Представляет модальное окно с функцией открытия и закрытия.
 */
class ModalWindow {
  private overlay: HTMLDivElement | null = null;
  private btnClose: NodeListOf<HTMLButtonElement> | null = null;
  private btnOpen: HTMLButtonElement | null = null;

  /**
   * Создает новый экземпляр ModalWindow.
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует модальное окно.
   * @private
   */
  private initialize() {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает элементы DOM для модального окна.
   * @private
   */
  private createDOM() {
    const root = document.querySelector<HTMLDivElement>('#app');
    if (!root) return;
    root.innerHTML = `
      <div class='border shadow rounded max-w-md w-full p-3 grid gap-4'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Modal Window</h1>
        <div class='text-center'>
          <button class='border max-w-max p-2' data-open>Open Modal</button>
        </div>
        <div class='fixed bg-neutral-900/50 top-0 left-0 w-full h-full grid place-items-center p-3 hidden' data-overlay>
          <section class='bg-white p-4 rounded max-w-md relative grid gap-4' data-modal>
            <button class='absolute top-2 right-2' data-close>
              <span class='pointer-events-none'>${feather.icons.x.toSvg()}</span>
            </button>
            <h2 class='text-2xl font-bold'>Title</h2>
            <p>“It's only after we've lost everything that we're free to do anything.”― Chuck Palahniuk, Fight Club</p>
            <button class='border max-w-max p-2' data-close>Close Modal</button>
          </section>
        </div>
      </div>
    `;

    this.overlay = root.querySelector<HTMLDivElement>('[data-overlay]');
    this.btnClose = root.querySelectorAll('[data-close]') as NodeListOf<HTMLButtonElement>;
    this.btnOpen = root.querySelector<HTMLButtonElement>('[data-open]');
  }

  /**
   * Устанавливает обработчики событий для модального окна.
   * @private
   */
  private setupEventListeners(): void {
    this.btnOpen?.addEventListener('click', this.handleClick.bind(this));
    this.overlay?.addEventListener('click', this.handleClick.bind(this));
    this.btnClose?.forEach(btn => btn.addEventListener('click', this.handleClick.bind(this)));
    document.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  /**
   * Обрабатывает события клика на модальном окне.
   * @param {MouseEvent} event - Событие клика.
   * @private
   */
  private handleClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.matches('[data-open]')) {
      this.overlay?.classList.remove('hidden');
    } else if (target.matches('[data-close]') || target.matches('[data-overlay]')) {
      this.overlay?.classList.add('hidden');
    }
  }

  /**
   * Обрабатывает события нажатия клавиш, в частности клавишу "Escape", для закрытия модального окна.
   * @param {KeyboardEvent} event - Событие нажатия клавиши.
   * @private
   */
  private handleKeydown(event: KeyboardEvent): void {
    const key = event.key;
    if (key === 'Escape') this.overlay?.classList.add('hidden');
  }
}

// Создаем новый экземпляр ModalWindow.
new ModalWindow();
