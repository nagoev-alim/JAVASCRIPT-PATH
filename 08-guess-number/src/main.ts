import './style.css';
import { getRandomNumber } from './utils/getRandomNumber';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import confetti from 'canvas-confetti';

/**
 * Класс GuessNumber представляет игру "Угадай число".
 */
class GuessNumber {
  private form: HTMLFormElement | null = null;
  private input: HTMLInputElement | null = null;
  private output: HTMLUListElement | null = null;
  private username: string = '';
  private attemptsQuantity: number = 0;
  private secret: number = getRandomNumber(1, 100);

  /**
   * Создает экземпляр класса GuessNumber и инициализирует игру.
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует игру, создавая DOM-элементы и устанавливая обработчики событий.
   */
  private initialize() {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает DOM-элементы для игры.
   */
  private createDOM() {
    const root = document.querySelector<HTMLDivElement>('#app');
    if (!root) return;

    root.innerHTML = `
      <div class='p-4 text-yellow-400 grid gap-3'>
        <h1 class='font-bold text-2xl md:text-5xl'>🎲 Угадай число</h1>
        <ul class='grid gap-2' data-output></ul>
        <form data-form>
          <label>
            <input class='bg-transparent outline-none border-b-2 border-yellow-400 px-3 py-2.5 ' type='text' name='guess' data-input>
          </label>
        </form>
      </div>
    `;
    this.form = root.querySelector<HTMLFormElement>('[data-form]');
    this.input = root.querySelector<HTMLInputElement>('[data-input]');
    this.output = root.querySelector<HTMLUListElement>('[data-output]');
  }

  /**
   * Устанавливает обработчики событий для ввода и формы.
   */
  private setupEventListeners(): void {
    this.input?.focus();
    this.showMessage('👨 Введите ваше имя:');
    this.form?.addEventListener('submit', this.handleSubmit.bind(this));
    console.log(`Загаданное число: ${this.secret}`);
  }

  /**
   * Отображает сообщение в интерфейсе.
   * @param {string} message - Сообщение для отображения.
   */
  private showMessage(message: string) {
    const li = document.createElement('li');
    li.classList.add('text-xl');
    li.innerHTML = message;
    this.output?.appendChild(li);
  }

  /**
   * Обрабатывает случай, когда введенное значение недопустимо.
   */
  private handleInvalidInput() {
    Toastify({
      text: '⛔️ Пожалуйста, заполните поле',
      className: 'bg-none shadow-none bg-orange-100 text-black border border-orange-200',
      duration: 2000,
      gravity: 'bottom',
      position: 'center',
    }).showToast();
  }

  /**
   * Обрабатывает отправку формы.
   * @param {Event} event - Событие отправки формы.
   */
  private handleSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const value = form.guess.value.trim();

    if (!value) {
      this.handleInvalidInput();
      return;
    }

    if (!this.username) {
      this.username = value;
      this.output!.innerHTML = ''; // Очистить предыдущие сообщения
      this.showMessage(`👨 ${value}, there is a number between 0 and 100. Try to guess it in the fewest number of tries. After each attempt, there will be a message with the text - 'Few', 'Many' or 'Right'.'`);
      this.input!.value = '';
      this.input!.setAttribute('type', 'number');
      return;
    }

    const guess = Number.parseInt(value);
    if (isNaN(guess)) {
      this.handleInvalidInput();
      return;
    }

    this.showMessage(value);
    this.attemptsQuantity++;

    if (guess !== this.secret) {
      this.showMessage(guess > this.secret ? '⬇️ Many. Try again 😸' : '⬆️ Few. Try again 😸');
    } else {
      this.showMessage(`🎊 Right. The number you've guessed: ${guess}`);
      this.showMessage(`🎉 Number of attempts: ${this.attemptsQuantity}`);
      confetti({
        angle: getRandomNumber(55, 125),
        spread: getRandomNumber(50, 70),
        particleCount: getRandomNumber(50, 100),
        origin: { y: 0.6 },
      });
      form.remove();
    }

    this.input!.value = '';
  }
}

new GuessNumber();
