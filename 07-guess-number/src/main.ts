import './style.css';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import confetti from 'canvas-confetti';
import { getRandomNumber } from './utils/getRandomNumber';

class GuessNumber {
  // Приватные свойства класса
  private form: HTMLFormElement;
  private alert: HTMLDivElement;
  private secret: number = getRandomNumber(1, 10); // Генерация секретного числа
  private attempts: number = 3; // Количество попыток
  /**
   * Конструктор класса `GuessNumber`.
   */
  constructor() {
    this.initialize(); // Инициализация объекта при создании
  }

  /**
   * Инициализация игры.
   */
  private initialize(): void {
    this.createDOM(); // Создание DOM-структуры
    this.setupEventListeners(); // Настройка обработчиков событий
    console.log(`The number that was guessed is ${this.secret}`); // Вывод секретного числа в консоль
  }

  /**
   * Создает DOM-структуру игры.
   */
  private createDOM(): void {
    const root: HTMLDivElement = document.querySelector('#app')!;
    if (!root) return;

    // Вставка HTML-разметки в корневой элемент
    root.innerHTML = `
      <div class='border shadow rounded max-w-md w-full p-3 grid gap-4'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Guess Number</h1>
        <p>Guess the number is a game in which you have to guess the number given by the computer between 0 and 10. Use as few tries as possible. Good luck!</p>
        <form data-form>
          <label aria-label='Enter the number'>
            <input class='border-2 w-full px-3 py-2.5' type='number' name='guess' placeholder='Enter the number' min='1' max='10'>
          </label>
        </form>
        <div class='hidden' data-alert></div>
      </div>
    `;

    // Получение ссылок на элементы DOM
    this.form = document.querySelector<HTMLFormElement>('[data-form]')!;
    this.alert = document.querySelector<HTMLDivElement>('[data-alert]')!;
  }

  /**
   * Настраивает обработчики событий.
   */
  private setupEventListeners(): void {
    // Обработчик отправки формы
    this.form?.addEventListener('submit', this.handleSubmit.bind(this));
  }

  /**
   * Обрабатывает отправку формы.
   * @param event Событие отправки формы.
   */
  private handleSubmit(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const guess = parseInt(formData.get('guess') || '0', 10);

    // Проверка введенного числа
    if (guess < 0 || guess > 10) {
      // Отображение сообщения об ошибке с использованием библиотеки Toastify
      Toastify({
        text: '⛔️ Please enter a number from 0 to 10!',
        className: 'bg-none shadow-none bg-orange-100 text-black border border-orange-200',
        duration: 2000,
        gravity: 'bottom',
        position: 'center',
      }).showToast();
      return;
    }

    if (guess === this.secret) {
      // Если число угадано
      form.remove(); // Удаление формы
      this.showMessage('success', 'You guessed it 🥳!'); // Отображение сообщения об успехе
      // Создание эффекта конфетти
      confetti({
        angle: getRandomNumber(55, 125),
        spread: getRandomNumber(50, 70),
        particleCount: getRandomNumber(50, 100),
        origin: { y: 0.6 },
      });
      this.restart(); // Возможность начать игру заново
    } else {
      // Если число не угадано
      this.attempts--; // Уменьшение количества оставшихся попыток
      if (this.attempts === 0) {
        form.remove(); // Удаление формы
        this.showMessage('lost', `You lost 🥲! The number you guessed - ${this.secret}`); // Отображение сообщения о поражении
        this.restart(); // Возможность начать игру заново
      } else {
        this.showMessage('error', `Try again. Attempts left ${this.attempts}`); // Отображение сообщения об ошибке
        form.reset(); // Сброс введенных данных в форме
      }
    }
  }

  /**
   * Перезапускает игру.
   */
  private restart(): void {
    document.querySelector('[data-restart]')?.addEventListener('click', function() {
      return location.reload(); // Перезагрузка страницы для начала новой игры
    });
  };

  /**
   * Отображает сообщения для пользователя.
   * @param type Тип сообщения ('error', 'lost', 'success').
   * @param text Текст сообщения.
   */
  private showMessage(type: string, text: string): void {
    const input = document.querySelector('input')!;
    if (this.alert || input) {
      this.alert!.textContent = text;
      switch (type) {
        case 'error':
          // Отображение сообщения об ошибке с использованием библиотеки Toastify
          Toastify({
            text: `⛔️ ${text}`,
            className: 'bg-none shadow-none bg-orange-100 text-black border border-orange-200',
            duration: 2000,
            gravity: 'bottom',
            position: 'center',
          }).showToast();
          input!.disabled = true;
          setTimeout(() => {
            input!.disabled = false;
            input!.focus();
          }, 2000);
          break;
        case 'lost':
          this.alert?.classList.remove('hidden');
          this.alert?.classList.add('text-center', 'text-orange-400', 'font-bold');
          // Добавление кнопки для начала игры заново
          this.alert?.insertAdjacentHTML('afterend', `<button class='border bg-orange-400 text-white px-3 py-2.5' data-restart>Play again?</button>`);
          break;
        case 'success':
          this.alert?.classList.remove('hidden');
          this.alert?.classList.add('text-center', 'text-green-400', 'font-bold');
          // Добавление кнопки для начала игры заново
          this.alert?.insertAdjacentHTML('afterend', `<button class='border bg-green-400 text-white px-3 py-2.5' data-restart>Play again?</button>`);
          break;
        default:
          break;
      }
    }
  }
}

// Создание объекта игры
new GuessNumber();
