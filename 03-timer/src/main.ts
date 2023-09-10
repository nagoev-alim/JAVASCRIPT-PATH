import './style.css';
import feather from 'feather-icons';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

/**
 * Класс Timer
 * Этот класс представляет собой интерактивный таймер с пользовательским интерфейсом.
 */
class Timer {
  private form: HTMLFormElement | null = null; // Форма для ввода времени.
  private interval: number | null = null; // Интервал для обновления таймера.
  private secondsRemaining: number = 0; // Оставшееся количество секунд на таймере.
  private minutes: HTMLSpanElement | null = null; // Элемент для отображения минут.
  private seconds: HTMLSpanElement | null = null; // Элемент для отображения секунд.
  private controlBtn: HTMLButtonElement | null = null; // Кнопка управления таймером (Старт/Пауза).
  private resetBtn: HTMLButtonElement | null = null; // Кнопка сброса таймера.

  /**
   * Создает экземпляр класса Timer.
   * Инициализирует таймер и настраивает обработчики событий.
   */
  constructor() {
    this.render(); // Создать и отобразить интерфейс таймера.
    this.setupEventListeners(); // Настроить обработчики событий для взаимодействия пользователя.
  }

  /**
   * Настраивает обработчики событий для формы, кнопки управления и кнопки сброса.
   */
  private setupEventListeners() {
    this.form?.addEventListener('submit', this.handleSubmit.bind(this)); // Обработчик отправки формы.
    this.controlBtn?.addEventListener('click', this.handleControl.bind(this)); // Обработчик клика по кнопке управления.
    this.resetBtn?.addEventListener('click', this.handleReset.bind(this)); // Обработчик клика по кнопке сброса.
  }

  /**
   * Создает интерфейс таймера и инициализирует ссылки на DOM-элементы.
   */
  private render() {
    const root = document.querySelector<HTMLDivElement>('#app');
    if (!root) return;

    // Создание HTML-структуры для интерфейса таймера и его отображение на странице.
    root.innerHTML = `
    <div class='border shadow rounded max-w-md w-full p-4 grid gap-3'>
      <h1 class='text-center font-bold text-2xl md:text-4xl'>Timer</h1>
      <form data-form>
        <label aria-label='Enter number of minutes'>
          <input autocomplete='off' type='number' name='time' placeholder='Enter number of minutes:' class='border w-full block p-3 rounded border-2 focus:outline-none focus:border-blue-300'>
        </label>
      </form>
      <div class='hidden content grid gap-3 place-items-center'>
        <div class='font-bold text-3xl md:text-6xl'>
          <span data-minutes>00</span>
          <span>:</span>
          <span data-seconds>00</span>
        </div>
        <button class='p-2 border shadow hover:bg-slate-100' data-control>${feather.icons.play.toSvg()}</button>
        <button class='p-2 border shadow hover:bg-slate-100' data-reset>Reset Timer</button>
      </div>
    </div>`;

    // Инициализация ссылок на DOM-элементы после их создания.
    this.minutes = root.querySelector<HTMLSpanElement>('[data-minutes]');
    this.seconds = root.querySelector<HTMLSpanElement>('[data-seconds]');
    this.controlBtn = root.querySelector<HTMLButtonElement>('[data-control]');
    this.resetBtn = root.querySelector<HTMLButtonElement>('[data-reset]');
    this.form = root.querySelector<HTMLFormElement>('[data-form]');
  }

  /**
   * Обработчик события отправки формы.
   * @param event Событие отправки формы.
   */
  private handleSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const time = formData.get('time');

    if (time !== null) {
      const numericTime = parseFloat(time as string);
      if (isNaN(numericTime)) {
        Toastify({
          text: '⛔️ Please set a number',
          className: 'bg-none shadow-none bg-orange-100 text-black border border-orange-200',
          duration: 3000,
          gravity: 'bottom',
          position: 'center',
        }).showToast();
        return;
      }
      if (numericTime < 60) {
        this.stop();
        this.secondsRemaining = numericTime * 60;
        this.updateTime();
        document.querySelector<HTMLDivElement>('.content')?.classList.remove('hidden');
        form.classList.add('hidden');
        form.reset();
      }
    }
  }

  /**
   * Останавливает таймер, если он активен.
   */
  private stop() {
    if (!this.interval) return;
    clearInterval(this.interval);
    this.interval = null;
    this.updateControl();
  }

  /**
   * Обновляет отображение времени на таймере.
   */
  private updateTime() {
    if (this.minutes && this.seconds) {
      this.minutes.textContent = Math.floor(this.secondsRemaining / 60).toString().padStart(2, '0');
      this.seconds.textContent = (this.secondsRemaining % 60).toString().padStart(2, '0');
    }
  }

  /**
   * Обновляет состояние кнопки управления (Старт/Пауза).
   */
  private updateControl = () => {
    if (this.controlBtn) {
      this.controlBtn.innerHTML = this.interval === null ? `${feather.icons.play.toSvg()}` : `${feather.icons.pause.toSvg()}`;
    }
  };

  /**
   * Обработчик события клика по кнопке управления.
   */
  private handleControl = () => {
    this.interval === null ? this.start() : this.stop();
  };

  /**
   * Обработчик события клика по кнопке сброса.
   */
  private handleReset = () => {
    this.stop();
    this.secondsRemaining = 0;
    this.updateTime();
    document.querySelector<HTMLDivElement>('.content')?.classList.add('hidden');
    this.form?.classList.remove('hidden');
  };

  /**
   * Запускает таймер, если есть оставшееся время.
   */
  private start() {
    if (this.secondsRemaining === 0) return;
    this.interval = setInterval(() => {
      this.secondsRemaining--;
      this.updateTime();
      if (this.secondsRemaining === 0) this.stop();
    }, 1000);
    this.updateControl();
  }
}

// Создание экземпляра класса Timer для запуска таймера.
new Timer();
