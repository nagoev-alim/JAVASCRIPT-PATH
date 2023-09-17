import './style.scss';

/**
 * Класс представляет страницу верификации для подтверждения адреса электронной почты.
 * Позволяет пользователям вводить шестизначный код верификации.
 */
class VerifyAccount {
  /**
   * Коллекция элементов для ввода шестизначного кода верификации.
   * @type {NodeListOf<HTMLInputElement>}
   * @private
   */
  private inputs: NodeListOf<HTMLInputElement>;
  /**
   * Создает экземпляр класса VerifyAccount.
   * Инициализирует страницу верификации.
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует страницу верификации, создавая DOM-элементы и настраивая обработчики событий.
   * @private
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает DOM-элементы для страницы верификации.
   * @private
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='bg-white border shadow rounded max-w-3xl w-full p-3 grid gap-4 text-center'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Verify Account</h1>
        <p>We emailed you the six-digit code to johndoe@email.com. Enter the code below to confirm your email address.</p>
        <div class='flex justify-center items-center flex-wrap gap-2'>
          ${Array.from({ length: 6 }).map(() => `<input class='h-[40px] md:h-[80px] w-[40px] md:w-[80px] font-bold text-center text-6xl px-1 py-1 border-2 rounded focus:outline-none focus:border-blue-400'  type='number' data-code placeholder='0' min='0' max='9' required>`).join('')}
        </div>
        <p>This is design only. We didn't actually send you an email as we don't have your email, right?</p>
      </div>
    `;
    this.inputs = root.querySelectorAll('[data-code]')!;
  }

  /**
   * Настраивает обработчики событий, устанавливает фокус на первом поле ввода и обрабатывает события нажатия клавиш.
   * @private
   */
  private setupEventListeners(): void {
    this.inputs[0].focus();
    this.inputs.forEach((input, idx) => input.addEventListener('keydown', (event) => this.handleKeydown(event, idx)));
  }

  /**
   * Обрабатывает события нажатия клавиш на полях ввода. Очищает ввод при нажатии на числовую клавишу и обрабатывает клавишу "Backspace".
   * @param {KeyboardEvent} event - Событие клавиатуры.
   * @param {number} elementId - Индекс поля ввода.
   * @private
   */
  private handleKeydown(event: KeyboardEvent, elementId: number): void {
    const key = event.key;
    const keyNumber = parseInt(key);

    if (!isNaN(keyNumber) && keyNumber >= 0 && keyNumber <= 9) {
      this.inputs[elementId].value = '';
      if (elementId !== 5) {
        setTimeout(() => this.inputs[elementId + 1].focus(), 10);
      }
    } else if (key === 'Backspace') {
      if (elementId !== 0) {
        setTimeout(() => this.inputs[elementId - 1].focus(), 10);
      }
    }
  }
}

// Создание экземпляра VerifyAccount для инициализации страницы верификации.
new VerifyAccount();
