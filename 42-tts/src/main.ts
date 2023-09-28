import './style.scss';
import { toast } from './utils/toast';

/**
 * Класс TTS (Text To Speech) представляет собой приложение для преобразования текста в речь с использованием браузерной Web Speech API.
 * @class
 */
class TTS {
  private textarea: HTMLTextAreaElement;
  private select: HTMLSelectElement;
  private form: HTMLFormElement;
  private synth: SpeechSynthesis | null = null;
  private isSpeaking: boolean = true;

  /**
   * Создает новый экземпляр класса TTS и инициализирует приложение.
   * @constructor
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует приложение, создавая и добавляя элементы DOM.
   * @private
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает и добавляет элементы DOM для интерфейса приложения Text To Speech.
   * @private
   * @returns {void}
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='bg-white border shadow rounded max-w-md w-full p-3 grid gap-4'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Text To Speech</h1>
        <form class='grid gap-3' data-form>
        <label class='grid gap-1'>
          <span class='font-medium'>Enter Text</span>
          <textarea class='px-3 py-2 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50 resize-none min-h-[150px]' name='text'></textarea>
        </label>
        <label class='grid gap-1'>
          <span class='font-medium'>Select Voice</span>
          <select class='px-3 py-2 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50' name='voices' data-form-select></select>
        </label>
        <button class='px-3 py-2 border hover:bg-slate-50'>Convert To Speech</button>
      </form>
      </div>
    `;

    this.textarea = root.querySelector('textarea')!;
    this.select = root.querySelector('[data-form-select]')!;
    this.form = root.querySelector('[data-form]')!;
  }

  /**
   * Настраивает обработчики событий для элементов приложения.
   * @private
   */
  private setupEventListeners(): void {
    // Инициализируем объект Web Speech API для синтеза речи
    this.synth = speechSynthesis;
    // Получаем доступ к доступным голосам и добавляем их в выпадающий список
    this.getVoices();
    // Обработчик события, срабатывающий при изменении доступных голосов
    if (this.synth) {
      this.synth.addEventListener('voiceschanged', this.getVoices.bind(this));
    }
    // Обработчик события отправки формы
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
  }

  /**
   * Получает и добавляет доступные голоса в выпадающий список.
   * @private
   */
  private getVoices(): void {
    if (!this.synth) return;
    for (let { name, lang } of this.synth.getVoices()) {
      let option = `<option value='${name}' ${name === 'Google US English' ? 'selected' : ''}>${name} (${lang})</option>`;
      this.select.insertAdjacentHTML('beforeend', option);
    }
  }

  /**
   * Обработчик события при отправке формы.
   * @param {Event} event - Событие отправки формы.
   * @private
   */
  private handleSubmit(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const text = formData.get('text') as string;
    const formBtn = this.form.querySelector('button')!;

    // Проверяем, что текст не пустой
    if (text.trim().length === 0 || !text) {
      toast('Please enter or paste something', 'warning');
      return;
    }

    // Проверяем, что синтез речи не активен
    if (this.synth && !this.synth.speaking) {
      this.textToSpeech(text);
    }

    // Если текст слишком длинный, то устанавливаем интервал для возобновления или приостановки речи
    if (text.length > 80) {
      setInterval(() => {
        if (this.synth && !this.synth.speaking && !this.isSpeaking) {
          this.isSpeaking = true;
          formBtn.innerText = 'Convert To Speech';
        } else {
        }
      }, 500);
      if (this.isSpeaking) {
        if (this.synth) {
          this.synth.resume();
          this.isSpeaking = false;
          formBtn.innerText = 'Pause Speech';
        }
      } else {
        if (this.synth) {
          this.synth.pause();
          this.isSpeaking = true;
          formBtn.innerText = 'Resume Speech';
        }
      }
    } else {
      formBtn.innerText = 'Convert To Speech';
    }
  }

  /**
   * Осуществляет синтез речи на основе предоставленного текста и выбранного голоса.
   * @param {string} text - Текст для синтеза речи.
   * @private
   */
  private textToSpeech(text: string): void {
    if (!this.synth) return;
    let utterance = new SpeechSynthesisUtterance(text);
    for (let voice of this.synth.getVoices()) {
      if (voice.name === this.select.value) {
        utterance.voice = voice;
      }
    }
    this.synth.speak(utterance);
  }
}

// Создаем экземпляр класса TTS для запуска приложения.
new TTS();
