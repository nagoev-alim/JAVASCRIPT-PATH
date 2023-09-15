import './style.scss';
import feather from 'feather-icons';
import axios from 'axios';
import { toast } from './utils/toast.ts';

/**
 * Модель для имитации данных.
 * @interface
 * @property {string} name - Наименование.
 * @property {string} src - URL изображения.
 */
interface IMock {
  name: string,
  src: string
}

/**
 * Интерфейс для представления пользователя.
 * @interface
 */
interface IUser {
  [key: string]: string;
}

const mock: IMock[] = [
  {
    name: 'name',
    src: feather.icons.user.toSvg(),
  },
  {
    name: 'email',
    src: feather.icons['at-sign'].toSvg(),
  },
  {
    name: 'age',
    src: feather.icons.calendar.toSvg(),
  },
  {
    name: 'street',
    src: feather.icons.map.toSvg(),
  },
  {
    name: 'phone',
    src: feather.icons.phone.toSvg(),
  },
  {
    name: 'password',
    src: feather.icons.lock.toSvg(),
  },
];

/**
 * Генератор случайных пользователей.
 * @class
 */
class RandomUserGenerator {
  /**
   * Элемент изображения.
   * @private
   * @type {HTMLImageElement}
   */
  private image: HTMLImageElement;
  /**
   * Элемент заголовка.
   * @private
   * @type {HTMLSpanElement}
   */
  private title: HTMLSpanElement;
  /**
   * Элемент значения.
   * @private
   * @type {HTMLSpanElement}
   */
  private value: HTMLSpanElement;
  /**
   * Кнопки с иконками.
   * @private
   * @type {NodeListOf<HTMLButtonElement>}
   */
  private icons: NodeListOf<HTMLButtonElement>;
  /**
   * Кнопка генерации.
   * @private
   * @type {HTMLButtonElement}
   */
  private submit: HTMLButtonElement;
  /**
   * URL для запроса данных.
   * @private
   * @type {string}
   */
  private readonly URL: string = 'https://randomuser.me/api/';
  /**
   * Объект текущего пользователя.
   * @public
   * @type {IUser}
   */
  user: IUser = {};

  /**
   * Создает экземпляр класса RandomUserGenerator.
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
      <div class='bg-white border shadow rounded max-w-md w-full p-3 grid gap-4'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Random User Generator</h1>
        <img class='border-2 border-black h-[132px] w-[132px] rounded-full mx-auto' src='#' alt='image' data-image>
        <p class='flex flex-wrap justify-center gap-1'>
          <span data-title></span>
          <span class='font-medium break-all' data-value></span>
        </p>
        <ul class='flex flex-wrap justify-center items-center gap-2'>
            ${mock.map(({ name, src }: IMock) => `
            <li><button class='bg-white border px-3 py-3 hover:bg-slate-100' data-label='${name}'><span class='pointer-events-none'>${src}</span></button></li>`).join('')}
        </ul>
        <button class='px-3 py-2.5 border hover:bg-slate-50' data-submit>Generate</button>
      </div>
    `;

    this.image = root.querySelector('[data-image]')!;
    this.title = root.querySelector('[data-title]')!;
    this.value = root.querySelector('[data-value]')!;
    this.icons = root.querySelectorAll('[data-label]')!;
    this.submit = root.querySelector('[data-submit]')!;
  }

  /**
   * Устанавливает обработчики событий.
   * @private
   */
  private setupEventListeners(): void {
    this.fetchData();
    this.icons.forEach(icon => icon.addEventListener('click', this.iconHandler.bind(this)));
    this.submit.addEventListener('click', this.fetchData.bind(this));
  }

  /**
   * Загружает данные пользователя.
   * @private
   */
  private async fetchData() {
    try {
      const { data: { results } } = await axios.get(this.URL);
      this.user = {
        phone: results[0].phone,
        email: results[0].email,
        image: results[0].picture.large,
        street: `${results[0].location.street.number} ${results[0].location.street.name}`,
        password: results[0].login.password,
        name: `${results[0].name.first} ${results[0].name.last}`,
        age: results[0].dob.age,
      };
      this.renderData();
    } catch (e) {
      console.log(e);
      toast('Something went wrong, open dev console', 'warning');
    }
  }

  /**
   * Обработчик клика по иконке.
   * @private
   * @param {Event} event - Событие клика.
   */
  private iconHandler(event: Event) {
    const target = event.target as HTMLButtonElement;
    const label = (target.dataset as { label?: string })?.label ?? '';
    this.title.textContent = `My ${label} is`;
    this.value.textContent = this.user[label];
    this.icons.forEach(icon => icon.classList.remove('bg-slate-50'));
    target.classList.add('bg-slate-50');
  }

  /**
   * Отображает данные пользователя.
   * @private
   */
  private renderData() {
    this.image.src = this.user.image;
    this.title.textContent = `My ${this.icons[0].dataset.label} is`;
    this.value.textContent = this.user.name;
    this.icons[0].classList.add('bg-slate-50');
  }
}

// Создание экземпляра класса для запуска приложения.
new RandomUserGenerator();
