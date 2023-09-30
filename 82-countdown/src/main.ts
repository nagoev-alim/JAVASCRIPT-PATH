import './style.scss';
import { capitalStr } from './utils/capitalStr';
import { addZero } from './utils/addZero';
import { toast } from './utils/toast.ts';

/**
 * Класс Countdown представляет интерактивный счетчик обратного отсчета на веб-странице.
 */
class Countdown {
  private config: HTMLDivElement;
  private display: HTMLDivElement;
  private finish: HTMLDivElement;
  private finishText: HTMLParagraphElement;
  private finishBtn: HTMLButtonElement;
  private form: HTMLFormElement;
  private formDate: HTMLInputElement;
  private d: HTMLParagraphElement;
  private h: HTMLParagraphElement;
  private m: HTMLParagraphElement;
  private s: HTMLParagraphElement;
  private title: HTMLHeadingElement;
  private btnReset: HTMLButtonElement;

  private today: string = new Date().toISOString().split('T')[0];
  private countdownValue: number | Date = Date;
  private interval: number | null = null;
  private countdownName: string | null = null;
  private countdownDate: string | null = null;

  /**
   * Создает экземпляр класса Countdown.
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует класс Countdown, создавая DOM-элементы и настраивая обработчики событий.
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает необходимые DOM-элементы для счетчика обратного отсчета.
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='bg-white border shadow rounded max-w-md w-full p-3 grid gap-4'>
        <h1 class='text-center font-bold text-2xl md:text-4xl' data-title>Countdown</h1>
        <div data-config>
          <form class='grid gap-3' data-form>
            <label class='grid gap-1'>
              <span class='text-sm font-medium'>Name</span>
              <input class='px-3 py-2 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50' type='text' name='name' placeholder='What are you counting down to?'>
            </label>
            <label class='grid gap-1'>
              <span class='text-sm font-medium'>Date</span>
              <input class='px-3 py-2 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50' type='date' name='target' data-date>
            </label>
            <button class='px-3 py-2 border hover:bg-slate-50' type='submit'>Submit</button>
          </form>
        </div>
        <div class='grid gap-3 hidden' data-display>
          <ul class='grid grid-cols-4 gap-2'>
            ${['days', 'hours', 'minutes', 'seconds'].map(i => `
              <li class='grid gap-1 place-items-center'>
                <p class='text-5xl font-bold' data-${i}>00</p>
                <p class='font-bold' >${capitalStr(i)}</p>
              </li>
            `).join('')}
          </ul>
          <button class='px-3 py-2 border hover:bg-slate-50' data-reset>Reset</button>
        </div>
        <div class='grid gap-3 hidden' data-finish>
          <p class='text-center' data-finish-text></p>
          <button class='px-3 py-2 border hover:bg-slate-50' data-finish-btn>New Countdown</button>
        </div>
      </div>
    `;
    this.config = root.querySelector('[data-config]')!;
    this.display = root.querySelector('[data-display]')!;
    this.finish = root.querySelector('[data-finish]')!;
    this.finishText = root.querySelector('[data-finish-text]')!;
    this.finishBtn = root.querySelector('[data-finish-btn]')!;
    this.form = root.querySelector('[data-form]')!;
    this.formDate = root.querySelector('[data-date]')!;
    this.d = root.querySelector('[data-days]')!;
    this.h = root.querySelector('[data-hours]')!;
    this.m = root.querySelector('[data-minutes]')!;
    this.s = root.querySelector('[data-seconds]')!;
    this.title = root.querySelector('[data-title]')!;
    this.btnReset = root.querySelector('[data-reset]')!;
  }

  /**
   * Настраивает обработчики событий для кнопок и формы счетчика.
   */
  private setupEventListeners(): void {
    this.storageDisplay();
    this.formDate.setAttribute('min', this.today);
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    this.btnReset.addEventListener('click', this.handleReset.bind(this));
    this.finishBtn.addEventListener('click', this.handleReset.bind(this));
  }

  /**
   * Отображает сохраненное значение счетчика, если оно было сохранено ранее.
   */
  private storageDisplay(): void {
    const data = this.storageGet();
    if (data !== null) {
      this.countdownName = data.name;
      this.countdownDate = data.date;
      this.countdownValue = new Date(this.countdownDate).getTime();
      this.title.innerHTML = this.countdownName;
      this.display.classList.remove('hidden');
      this.config.classList.add('hidden');
      this.updateCountdown();
    }
  }

  /**
   * Обрабатывает отправку формы для установки нового значения счетчика.
   * @param {Event} event - Событие отправки формы.
   */
  private handleSubmit(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const target = formData.get('target') as string;
    if (!name || !target) {
      toast('Please fill the fields', 'warning');
      return;
    }
    this.countdownName = name;
    this.countdownDate = target;
    this.countdownValue = new Date(this.countdownDate).getTime();
    this.storageAdd({
      name: this.countdownName,
      date: this.countdownDate,
    });
    this.updateCountdown();
  }

  /**
   * Сбрасывает счетчик и возвращает его к исходным значениям.
   */
  private handleReset(): void {
    clearInterval(this.interval!);
    this.display.classList.add('hidden');
    this.finish.classList.add('hidden');
    this.config.classList.remove('hidden');
    this.title.innerHTML = 'Countdown';
    this.form.reset();
    localStorage.clear();
  }

  /**
   * Получает сохраненные данные счетчика из локального хранилища.
   * @returns {object | null} - Сохраненные данные счетчика или null, если данных нет.
   */
  private storageGet(): { name: string; date: string } | null {
    const countdown = localStorage.getItem('countdown');
    return countdown ? JSON.parse(countdown) : null;
  }

  /**
   * Обновляет значение счетчика и отображает обратный отсчет.
   */
  private updateCountdown(): void {
    setTimeout(() => {
      if (typeof this.countdownName === 'string') {
        this.title.innerHTML = this.countdownName;
      }
      this.display.classList.remove('hidden');
      this.config.classList.add('hidden');
    }, 1000);

    this.interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = this.countdownValue - now;
      if (diff < 0) {
        clearInterval(this.interval!);
        this.display.classList.add('hidden');
        this.finish.classList.remove('hidden');
        this.title.innerHTML = 'Countdown Complete 🎊';
        this.finishText.innerHTML = `${this.countdownName} finished on ${this.countdownDate}`;
        this.form.reset();
      } else {
        this.d.innerHTML = addZero(Math.floor(diff / 1000 / 60 / 60 / 24));
        this.h.innerHTML = addZero(Math.floor(diff / 1000 / 60 / 60) % 24);
        this.m.innerHTML = addZero(Math.floor(diff / 1000 / 60) % 60);
        this.s.innerHTML = addZero(Math.floor(diff / 1000) % 60);
      }
    }, 1000);
  }

  /**
   * Сохраняет данные счетчика в локальном хранилище.
   * @param {object} data - Данные счетчика для сохранения.
   */
  private storageAdd(data: { name: string; date: string }): void {
    localStorage.setItem('countdown', JSON.stringify(data));
  }
}

// Создает экземпляр класса для выполнения счетчика обратного отсчета.
new Countdown();
