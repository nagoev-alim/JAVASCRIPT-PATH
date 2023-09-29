import './style.scss';
import feather from 'feather-icons';
import { passwordStrength, PasswordStrengthResult } from 'check-password-strength';

/**
 * Класс PasswordStrengthCheck для проверки надежности пароля.
 * @class
 */
class PasswordStrengthCheck {
  private input: HTMLInputElement;
  private message: HTMLSpanElement;
  private levels: HTMLDivElement;
  private btnIco: HTMLButtonElement;

  /**
   * Создает экземпляр класса PasswordStrengthCheck и инициализирует приложение.
   * @constructor
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует приложение, создавая необходимый DOM и настраивая обработчики событий.
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
      <div class='bg-white border shadow rounded max-w-md w-full p-3 grid gap-4'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Password Strength Check</h1>
         <div class='relative'>
          <input class='px-3 py-2 pr-9 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50' type='password' data-input placeholder='Type password'>
          <button class='hidden absolute right-1 top-1/2 -translate-y-1/2' data-ico>
            ${feather.icons.eye.toSvg() as string}
          </button>
        </div>
        <div class='grid gap-2 hidden' data-levels>
          <ul class='grid grid-cols-4 gap-2'>
            ${Array.from({ length: 4 }).map(() => `<li class='border-2 h-2'></li>`).join('')}
          </ul>
          <p class='text-center'>Your password is <span class='font-bold' data-message></span></p>
        </div>
      </div>
    `;
    this.input = root.querySelector('[data-input]')!;
    this.message = root.querySelector('[data-message]')!;
    this.levels = root.querySelector('[data-levels]')!;
    this.btnIco = root.querySelector('[data-ico]')!;
  }

  /**
   * Настраивает обработчики событий для кнопок и полей ввода.
   * @private
   */
  private setupEventListeners(): void {
    this.input.addEventListener('input', this.inputHandler.bind(this));
    this.btnIco.addEventListener('click', this.togglePassword.bind(this));
  }

  /**
   * Обработчик события для поля ввода пароля.
   * @param {HTMLInputElement} target - Элемент поля ввода пароля.
   * @private
   */
  private inputHandler({ target }: { target: HTMLInputElement }): void {
    if (target.value.length === 0) {
      this.levels.classList.add('hidden');
      this.btnIco.classList.add('hidden');
    } else {
      const { value: checkType } = passwordStrength(target.value) as PasswordStrengthResult;
      this.message.textContent = checkType.toLowerCase();
      this.levels.className = `grid gap-2  ${checkType.toLowerCase().split(' ').join('-')}`;
      this.btnIco.classList.remove('hidden');
    }
  }

  /**
   * Обработчик события для кнопки переключения видимости пароля.
   * @param {HTMLButtonElement} target - Элемент кнопки.
   * @private
   */
  private togglePassword({ target }: { target: HTMLButtonElement }): void {
    target.classList.toggle('toggle');
    target.innerHTML = target.classList.contains('toggle') ? feather.icons['eye-off'].toSvg() as string : feather.icons.eye.toSvg() as string;
    this.input.type = target.classList.contains('toggle') ? 'text' : 'password';
  }
}

// Создание экземпляра класса PasswordStrengthCheck для запуска приложения.
new PasswordStrengthCheck();
