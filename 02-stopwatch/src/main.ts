// Импортируем стили и функцию capitalStr из модулей.
import './style.css';
import { capitalStr } from './utils/capitalStr';

// Создаем класс StopWatch для управления таймером.
class StopWatch {
  // Приватные свойства класса для элементов DOM и управления таймером.
  private buttons: NodeListOf<HTMLButtonElement>;
  private minutes: HTMLSpanElement;
  private seconds: HTMLSpanElement;
  private time: number = 0;
  private flag: boolean = false;
  private interval: number | null = null;

  // Конструктор класса, вызывает методы render() и setupEventListeners() при создании экземпляра.
  constructor() {
    this.render(); // Создаем интерфейс таймера.
    this.setupEventListeners(); // Настраиваем обработчики событий для кнопок.
  }

  // Метод render() отвечает за создание интерфейса таймера и его отображение на странице.
  private render():void {
    const root: HTMLDivElement = document.querySelector('#app')!; // Находим корневой элемент.
    if (!root) return; // Если корневой элемент не найден, завершаем функцию.

    // Создаем HTML-структуру для таймера и вставляем её в корневой элемент.
    root.innerHTML = `
      <div class='border shadow rounded max-w-sm mx-auto w-full p-4 md:p-8'>
        <div class='grid gap-3'>
          <h1 class='text-center font-bold text-2xl md:text-4xl leading-none'>StopWatch</h1>
          <div class='text-center font-bold text-2xl  md:text-7xl leading-none'>
            ${['minutes', 'seconds'].map((el, idx) => `<span data-${el}>00</span>${idx === 0 ? ':' : ''}`).join('')}
          </div>
          <div class='grid gap-2 sm:grid-cols-3'>
            ${['start', 'pause', 'reset'].map(el => `<button class='button shadow font-bold border' data-type='${el}'>${capitalStr(el)}</button>`).join('')}
          </div>
        </div>
      </div>`;

    // Типизируем элементы DOM после их создания.
    this.minutes = root.querySelector('[data-minutes]')!;
    this.seconds = root.querySelector('[data-seconds]')!;
    this.buttons = root.querySelectorAll('[data-type]')!;
  }

  // Метод setupEventListeners() назначает обработчики событий для кнопок таймера.
  private setupEventListeners():void {
    if (!this.buttons) return;
    this.buttons.forEach((button) => {
      button.addEventListener('click', () => this.handleClick(button)); // Добавляем обработчик для каждой кнопки.
    });
  }

  // Метод handleClick() обрабатывает клики на кнопках и вызывает соответствующие методы.
  private handleClick(button: HTMLButtonElement):void {
    const { type } = button.dataset; // Получаем тип кнопки из атрибута data-type.
    if (type) {
      switch (type) {
        case 'start':
          this.start(); // Запускаем таймер.
          break;
        case 'pause':
          this.pause(); // Приостанавливаем таймер.
          break;
        case 'reset':
          this.reset(); // Сбрасываем таймер.
          break;
      }
    }
  }

  // Метод start() запускает таймер.
  private start():void {
    if (this.flag) return; // Если таймер уже запущен, выходим из метода.
    this.flag = true; // Устанавливаем флаг запуска таймера.
    this.interval = setInterval(() => {
      this.time++; // Увеличиваем счетчик времени.
      const minutes = Math.floor(this.time / 60);
      const seconds = this.time % 60;
      if (this.minutes && this.seconds) {
        // Обновляем отображение минут и секунд в формате mm:ss.
        this.minutes.textContent = (minutes < 10 ? `0${minutes}` : minutes.toString());
        this.seconds.textContent = (seconds < 10 ? `0${seconds}` : seconds.toString());
      }
    }, 1000); // Обновляем каждую секунду.
  }

  // Метод pause() приостанавливает таймер.
  private pause():void {
    if (!this.flag || !this.interval) return; // Если таймер не запущен или интервал не установлен, выходим из метода.
    this.flag = false; // Сбрасываем флаг запуска таймера.
    clearInterval(this.interval); // Останавливаем интервал обновления времени.
  }

  // Метод reset() сбрасывает таймер.
  private reset():void {
    this.pause(); // Приостанавливаем таймер.
    this.time = 0; // Сбрасываем счетчик времени.
    if (this.minutes && this.seconds) {
      this.minutes.textContent = this.seconds.textContent = '00'; // Сбрасываем отображение минут и секунд.
    }
  }
}

// Создаем экземпляр класса StopWatch при загрузке страницы.
new StopWatch();
