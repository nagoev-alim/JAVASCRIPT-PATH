import './style.css'; // Импорт стилей из файла style.css
import Toastify from 'toastify-js'; // Импорт библиотеки Toastify для уведомлений
import 'toastify-js/src/toastify.css'; // Импорт стилей для Toastify
import { addZero } from './utils/addZero'; // Импорт функции addZero из отдельного модуля
import mp3 from './assets/sounds/ringtone.mp3'; // Импорт звукового файла для будильника

class AlarmClock {
  // Приватные свойства класса
  private select: NodeListOf<HTMLSelectElement>;
  private time: HTMLParagraphElement;
  private submit: HTMLButtonElement;
  private body: HTMLDivElement;
  private image: HTMLImageElement;
  private ringtone: HTMLAudioElement;

  private alarmTime: string = ''; // Время будильника
  private isAlarmSet: boolean = false; // Флаг, указывающий, установлен ли будильник

  private readonly ringtoneURL: string = mp3; // URL звукового файла для будильника
  private readonly invalidTimeMessage: string = '⛔️ Please, select a valid time to set alarm!'; // Сообщение об ошибке при неправильном времени

  constructor() {
    this.render(); // Вызов метода render для отрисовки интерфейса

    // Инициализация элементов DOM
    this.select = document.querySelectorAll('[data-select]')!;
    this.time = document.querySelector('[data-time]')!;
    this.submit = document.querySelector('[data-submit]')!;
    this.body = document.querySelector('[data-container]')!;
    this.image = document.querySelector('[data-image]')!;
    this.ringtone = new Audio(this.ringtoneURL); // Создание объекта для воспроизведения звука будильника

    this.setupEventListeners(); // Настройка обработчиков событий
    this.updateTime(); // Обновление времени на интерфейсе
  }

  // Метод для отрисовки интерфейса
  private render(): void {
    const root: HTMLDivElement = document.querySelector('#app')!;
    if (!root) return;

    // Генерация HTML-разметки для интерфейса будильника
    const hourOptions = Array.from({ length: 12 }, (_, i) => addZero(i + 1));
    const minuteOptions = Array.from({ length: 60 }, (_, i) => addZero(i + 1));
    const ampmOptions = ['AM', 'PM'];

    root.innerHTML = `
      <div class='border shadow rounded max-w-md w-full p-4 grid gap-5'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Alarm Clock</h1>
        <div class='grid place-items-center gap-3' data-container>
          <img class='w-[100px] mx-auto' src='https://lh3.googleusercontent.com/drive-viewer/AITFw-w0VHGrXur-i4yRzoIKp820T_4W2IuOi2seZCRgAJcJtn-J0iw8zGyENlR14gD9yMRUvGyN4olXizfW1DhcBdGHZx4n=s1600' alt='Alarm' data-image>
          <p class='font-bold text-2xl text-center md:text-5xl' data-time>00:00:00 PM</p>
          <div class='grid gap-3 w-full sm:grid-cols-3'>
            <select class='border-2 px-4 py-2.5 rounded block w-full cursor-pointer' data-select='hour'>
              <option value='Hour'>Hour</option>
              ${hourOptions.map(option => `<option value='${option}'>${option}</option>`).join('')}
            </select>
            <select class='border-2 px-4 py-2.5 rounded block w-full cursor-pointer' data-select='minute'>
              <option value='Minute'>Minute</option>
              ${minuteOptions.map(option => `<option value='${option}'>${option}</option>`).join('')}
            </select>
            <select class='border-2 px-4 py-2.5 rounded block w-full cursor-pointer' data-select='day'>
              <option value='AM/PM'>AM/PM</option>
              ${ampmOptions.map(option => `<option value='${option}'>${option}</option>`).join('')}
            </select>
          </div>
          <button class='border shadow px-4 py-2.5 w-full hover:bg-gray-100' data-submit>Set Alarm</button>
        </div>
      </div>
    `;
  }

  // Метод для настройки обработчиков событий
  private setupEventListeners(): void {
    this.submit.addEventListener('click', this.handleSetAlarm);
  };

  // Обработчик события установки/сброса будильника
  private handleSetAlarm(): void {
    if (this.isAlarmSet) {
      // Если будильник уже установлен, сбрасываем его
      this.alarmTime = '';
      this.isAlarmSet = false;
      this.ringtone.pause();
      this.body?.classList.remove('disabled');
      if (this.submit) this.submit.innerText = 'Set Alarm';
      this.image?.classList.remove('animate-bounce');
      this.select[0].selectedIndex = this.select[1].selectedIndex = this.select[2].selectedIndex = 0;
    } else {
      // Иначе, устанавливаем будильник
      const time = `${this.select[0].value}:${this.select[1].value} ${this.select[2].value}`;
      if (time.includes('Hour') || time.includes('Minute') || time.includes('AM/PM')) {
        // Проверяем, что время выбрано корректно
        Toastify({
          text: this.invalidTimeMessage,
          className: 'bg-none shadow-none bg-orange-100 text-black border border-orange-200',
          duration: 3000,
          gravity: 'bottom',
          position: 'center',
        }).showToast();
        return;
      }
      this.alarmTime = time;
      this.isAlarmSet = true;
      this.body?.classList.add('disabled');
      if (this.submit) this.submit.innerText = 'Clear Alarm';
    }
  };

  // Метод для обновления времени на интерфейсе и проверки срабатывания будильника
  private updateTime(): void {
    setInterval(() => {
      const date = new Date();
      let h = date.getHours();
      let m = date.getMinutes();
      let s = date.getSeconds();
      let ampm = 'AM';

      if (h >= 12) {
        h = h - 12;
        ampm = 'PM';
      }

      h = h === 0 ? 12 : h;

      if (this.time) {
        this.time.innerText = `${addZero(h)}:${addZero(m)}:${addZero(s)} ${ampm}`;
      }

      if (this.alarmTime === `${addZero(h)}:${addZero(m)} ${ampm}`) {
        // Если текущее время совпадает с временем будильника, воспроизводим звук будильника и анимацию
        this.ringtone.play();
        this.ringtone.loop = true;
        this.image?.classList.add('animate-bounce');
      }
    }, 1000); // Периодическое обновление времени каждую секунду
  };
}

new AlarmClock(); // Создание экземпляра класса и запуск будильника
