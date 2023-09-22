import './style.scss';
import feather from 'feather-icons';
import { toast } from './utils/toast.ts';
import axios, { AxiosResponse } from 'axios';

interface ShortenResponse {
  ok: boolean;
  result: {
    full_short_link: string;
  };
}

/**
 * Класс Shortener представляет функциональность сокращения URL-ссылок.
 * @class
 */
class Shortener {
  private form: HTMLFormElement;
  private inputResult: HTMLInputElement;
  private btnCopy: HTMLButtonElement;

  /**
   * Создает экземпляр класса Shortener и инициализирует его.
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
      <div class='bg-white border shadow rounded max-w-md w-full p-3 grid gap-4 max-h-[175px] overflow-hidden transition-all' data-parent>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>URL Shortener</h1>
        <form class='grid gap-2' data-form>
          <input class='px-3 py-2 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50' type='text' name='url' placeholder='Paste a link to shorten it'>
          <button class='px-3 py-2 border hover:bg-slate-50' type='submit'>Submit</button>
        </form>
        <div class='result grid grid-cols-[1fr_60px] gap-1.5'>
          <input class='px-3 py-2 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50 text-gray-600' disabled type='text' data-result>
          <button class='px-3 py-2 border hover:bg-slate-50' data-copy>${feather.icons.clipboard.toSvg()}</button>
        </div>
      </div>
    `;
    this.form = root.querySelector('[data-form]')!;
    this.inputResult = root.querySelector('[data-result]')!;
    this.btnCopy = root.querySelector('[data-copy]')!;
  }

  /**
   * Устанавливает обработчики событий для формы и кнопки копирования.
   * @private
   */
  private setupEventListeners(): void {
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    this.btnCopy.addEventListener('click', this.handleCopy.bind(this));
  }

  /**
   * Обрабатывает событие отправки формы.
   * @param {Event} event - Событие отправки формы.
   * @private
   */
  private async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const url = formData.get('url') as string;

    if (!/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/.test(url) || url.length === 0) {
      toast('Please select validate URL.', 'warning');
      this.handleChangeClass(false);
      return;
    }

    try {
      form.querySelector('button')!.textContent = 'Loading...';
      const {
        data: {
          ok,
          result: { full_short_link },
        },
      }: AxiosResponse<ShortenResponse> = await axios.get(`https://api.shrtco.de/v2/shorten?url=${url}`);

      if (!ok) {
        toast('Something went wrong, open dev console', 'error');
        this.handleChangeClass(false);
        return;
      }
      this.inputResult.value = full_short_link;
      this.handleChangeClass(true);
    } catch (e) {
      toast('Something went wrong, open dev console', 'error');
      this.handleChangeClass(false);
      console.log(e);
    }
  }

  /**
   * Обрабатывает событие копирования URL.
   * @private
   */
  private handleCopy(): void {
    if (this.inputResult.value.trim().length === 0) return;
    navigator.clipboard.writeText(this.inputResult.value);
    toast('URL copied successfully to clipboard.', 'success');
  }

  /**
   * Изменяет классы элементов DOM в зависимости от успешности операции.
   * @param {boolean} type - Флаг успешной операции.
   * @private
   */
  private handleChangeClass(type: boolean): void {
    document.querySelector('[data-parent]')!.classList.toggle('max-h-[235px]', type);
    this.form.querySelector('button')!.textContent = 'Submit';
  }
}

// Создаем экземпляр класса Shortener.
new Shortener();
