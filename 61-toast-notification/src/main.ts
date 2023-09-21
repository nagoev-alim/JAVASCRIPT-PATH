import './style.scss';
import feather from 'feather-icons';

/**
 * @property {string} icon - Иконка уведомления.
 * @property {string} text - Текст уведомления.
 * @property {string} color - Цвет уведомления.
 */
interface IType {
  icon: string,
  text: string,
  color: string,
}

/**
 * Класс Toast для создания и управления всплывающими уведомлениями.
 * @class
 */
class Toast {
  /**
   * Элемент списка уведомлений.
   * @private
   * @type {HTMLUListElement}
   */
  private notifications: HTMLUListElement;

  /**
   * Коллекция кнопок для создания уведомлений.
   * @private
   * @type {NodeListOf<HTMLButtonElement>}
   */
  private buttons: NodeListOf<HTMLButtonElement>;

  /**
   * Время, через которое уведомление будет скрыто (в миллисекундах).
   * @private
   * @type {number}
   */
  private timer: number = 5000;

  /**
   * Набор типов уведомлений с соответствующими иконками, текстом и цветами.
   * @private
   * @type {Record<string, IType>}
   */
  private types: Record<string, IType> = {
    success: {
      icon: 'check-circle',
      text: 'Success: This is a success toast.',
      color: 'rgb(10, 191, 48)',
    },
    error: {
      icon: 'x-circle',
      text: 'Error: This is an error toast.',
      color: 'rgb(226, 77, 76)',
    },
    warning: {
      icon: 'alert-triangle',
      text: 'Warning: This is a warning toast.',
      color: 'rgb(233, 189, 12)',
    },
    info: {
      icon: 'alert-circle',
      text: 'Info: This is an information toast.',
      color: 'rgb(52, 152, 219)',
    },
  };

  /**
   * Создает экземпляр класса Toast и инициализирует приложение.
   * @constructor
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует приложение, создавая необходимую структуру DOM и настраивая обработчики событий.
   * @private
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает необходимую структуру DOM для приложения.
   * @private
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='bg-white border shadow rounded max-w-md w-full p-3 grid gap-4 t-notifications'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Toast Notification</h1>
        <ul data-notifications></ul>
        <div class='t-notifications__buttons flex justify-center'>
        <button class='px-3 py-2 text-white bg-green-500 hover:bg-green-400' data-type='success'>Success</button>
        <button class='px-3 py-2 text-white bg-red-500 hover:bg-red-400' data-type='error'>Error</button>
        <button class='px-3 py-2 text-white bg-orange-500 hover:bg-orange-400' data-type='warning'>Warning</button>
        <button class='px-3 py-2 text-white bg-blue-500 hover:bg-blue-400' data-type='info'>Info</button>
        </div>
      </div>
    `;
    this.notifications = document.querySelector('[data-notifications]')!;
    this.buttons = document.querySelectorAll('[data-type]')!;
  }

  /**
   * Настраивает обработчики событий для кнопок создания уведомлений.
   * @private
   */
  private setupEventListeners(): void {
    this.buttons.forEach(btn => btn.addEventListener('click', this.createToast.bind(this)));
  }

  /**
   * Создает всплывающее уведомление при щелчке на кнопке.
   * @param {MouseEvent} event - Событие клика на кнопке.
   * @private
   */
  private createToast(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const type = target.dataset.type;
    if (!type) return;
    const { icon, text, color } = this.types[type];
    const toast = document.createElement('li');
    toast.className = `flex toast ${type}`;
    toast.innerHTML = `
      <div style='color:${color}'>${feather.icons[icon].toSvg()}</div>
      <span class='flex-grow'>${text}</span>
      <button data-delete=''>${feather.icons.x.toSvg()}</button>`;
    this.notifications.appendChild(toast);
    const close = toast.querySelector('[data-delete]') as HTMLButtonElement;
    close.addEventListener('click', () => this.removeToast(toast));
    toast.timeoutId = setTimeout(() => this.removeToast(toast), this.timer);

  }

  /**
   * Удаляет всплывающее уведомление.
   * @param {HTMLElement} toast - Элемент уведомления для удаления.
   * @private
   */
  private removeToast(toast: HTMLElement): void {
    toast.classList.add('hide');
    if (toast.timeoutId) clearTimeout(toast.timeoutId);
    setTimeout(() => toast.remove(), 500);
  };
}

// Создание экземпляра класса Toast для запуска приложения.
new Toast();
