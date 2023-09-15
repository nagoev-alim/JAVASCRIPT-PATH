import './style.scss';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import feather from 'feather-icons';

/**
 * Интерфейс для набора генераторов символов
 */
interface Characters {
  lowercase: () => string;
  uppercase: () => string;
  numbers: () => string;
  symbols: () => string;
}

/**
 * Интерфейс для параметров генерации пароля
 */
interface PasswordOptions {
  lowercase: boolean;
  uppercase: boolean;
  numbers: boolean;
  symbols: boolean;
  length: number;
}

/** Класс генератора паролей */
class PasswordGenerator {
  /** Элемент ввода пароля */
  private passwordInput: HTMLInputElement;
  /** Индикатор сложности пароля */
  private passwordIndicator: HTMLDivElement;
  /** Кнопка копирования в буфер */
  private btnClipboard: HTMLButtonElement;
  /** Кнопка генерации пароля */
  private btnGenerate: HTMLButtonElement;
  /** Список чекбоксов опций */
  private option: NodeListOf<HTMLInputElement>;
  /** Ползунок длины пароля */
  private range: HTMLInputElement & { value: number };
  /** Отображение длины пароля */
  private length: HTMLSpanElement;
  /** Набор символов для генерации */
  private characters: Characters = {
    lowercase: () => String.fromCharCode(Math.floor(Math.random() * 26) + 97),
    uppercase: () => String.fromCharCode(Math.floor(Math.random() * 26) + 65),
    numbers: () => String.fromCharCode(Math.floor(Math.random() * 10) + 48),
    symbols: () => {
      const symbols: string = '!@#$%^&*(){}[]=<>,.';
      return symbols[Math.floor(Math.random() * symbols.length)];
    },
  };
  /** Набор генераторов на основе characters */
  private chars: Characters = {
    lowercase: () => this.characters.lowercase(),
    uppercase: () => this.characters.uppercase(),
    numbers: () => this.characters.numbers(),
    symbols: () => this.characters.symbols(),
  };

  /**
   * Конструктор инициализирует компонент
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализация компонента:
   * - Создание DOM элементов
   * - Назначение обработчиков событий
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создание DOM элементов и добавление их на страницу
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='bg-white border shadow rounded max-w-md w-full p-3 grid gap-4'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Password Generator</h1>

        <div class='relative'>
          <input class='w-full border rounded py-2 px-3 pr-8 text-lg tracking-wider' type='text' data-password disabled>
          <button class='absolute right-1 top-1/2 -translate-y-1/2' data-clipboard>${feather.icons.clipboard.toSvg()}</button>
        </div>

        <div class='rounded h-2 bg-gray-100 border indicator' data-indicator></div>

        <div class=''>
          <div class='flex gap-1 justify-between items-center'>
            <span class=''>Password Length</span>
            <span data-length-value>15</span>
          </div>
          <input class='w-full range' type='range' value='15' min='1' max='30' step='1' data-range>
        </div>

        <ul class='grid gap-3 sm:grid-cols-2'>
          <li>
            <label class='flex'>
              <input class='visually-hidden' type='checkbox' data-option='lowercase' checked>
              <span class='checkbox'></span>
              <span class='label'>Lowercase (a-z)</span>
            </label>
          </li>
          <li>
            <label class='flex'>
              <input class='visually-hidden' type='checkbox' data-option='uppercase'>
              <span class='checkbox'></span>
              <span class='label'>Uppercase (A-Z)</span>
            </label>
          </li>
          <li>
            <label class='flex'>
              <input class='visually-hidden' type='checkbox' data-option='numbers'>
              <span class='checkbox'></span>
              <span class='label'>Numbers (0-9)</span>
            </label>
          </li>
          <li>
            <label class='flex'>
              <input class='visually-hidden' type='checkbox' data-option='symbols'>
              <span class='checkbox'></span>
              <span class='label'>Symbols (!-$^+)</span>
            </label>
          </li>
        </ul>
        <button class='px-3 py-2.5 border hover:bg-gray-100' data-generate=''>Generate Password</button>
      </div>
    `;

    this.passwordInput = root.querySelector('[data-password]')!;
    this.passwordIndicator = root.querySelector('[data-indicator]')!;
    this.btnClipboard = root.querySelector('[data-clipboard]')!;
    this.btnGenerate = root.querySelector('[data-generate]')!;
    this.option = root.querySelectorAll('[data-option]')!;
    this.range = root.querySelector('[data-range]')!;
    this.length = root.querySelector('[data-length-value]')!;
  }

  /**
   * Назначение обработчиков на события ввода и клика
   */
  private setupEventListeners(): void {
    this.range.addEventListener('input', this.handleRange.bind(this));
    this.btnGenerate.addEventListener('click', this.handleGenerate);
    this.btnClipboard.addEventListener('click', this.handleClipboard);
  }

  /**
   * Обработчик изменения ползунка диапазона
   * @param event Событие ввода
   */
  private handleRange = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    this.length.textContent = target.value;
  };

  /**
   * Обработчик клика по кнопке генерации пароля
   */
  private handleGenerate = () => {
    const length = +this.range.value;
    let params = null;
    this.option.forEach(option => params = { ...params, [option.dataset.option]: option.checked });
    this.passwordInput.value = this.generatePassword({ ...params, length });
    this.updateIndicator();
  };

  /**
   * Генерирует пароль на основе выбранных параметров
   * @param options Параметры для генерации пароля
   * @returns Сгенерированный пароль
   */
  private generatePassword(options: PasswordOptions): string {
    const charTypes = Object.keys(this.chars).filter(type => options[type]);
    let password = '';
    for (let i = 0; i < options.length; i++) {
      const charType = charTypes[Math.floor(Math.random() * charTypes.length)];
      password += this.chars[charType]();
    }
    return password;
  }

  /**
   * Обновляет визуальный индикатор силы пароля
   */
  private updateIndicator(): void {
    const { passwordIndicator, range } = this;
    let level: 'weak' | 'medium' | 'strong';
    if (+range.value <= 8) {
      level = 'weak';
    } else if (+range.value <= 16) {
      level = 'medium';
    } else {
      level = 'strong';
    }
    passwordIndicator.setAttribute('data-level', level);
  };

  /**
   * Копирует сгенерированный пароль в буфер обмена
   */
  private handleClipboard = (): void => {
    const textarea = document.createElement('textarea');
    const password = this.passwordInput.value;
    if (!password) return;
    textarea.value = password;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
    // navigator.clipboard.writeText(this.DOM.passwordInput.value); // alternative
    Toastify({
      text: '✅ Password copied to clipboard',
      className: 'bg-none shadow-none bg-green-100 text-black border border-green-200',
      duration: 3000,
      gravity: 'bottom',
      position: 'center',
    }).showToast();
  };
}

new PasswordGenerator();
