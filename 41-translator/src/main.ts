import './style.scss';
import feather from 'feather-icons';
import countries from '../src/mock/index';
import { toast } from './utils/toast.ts';
import axios from 'axios';

interface ICountry {
  value: string,
  name: string,
}

/**
 * Класс Translator представляет собой приложение для перевода текста с одного языка на другой.
 * @class
 */
class Translator {
  private btnSubmit: HTMLButtonElement;
  private selectFrom: HTMLSelectElement;
  private textareaFrom: HTMLTextAreaElement;
  private selectTo: HTMLSelectElement;
  private textareaTo: HTMLTextAreaElement;
  private exchangeBtn: HTMLButtonElement;
  private iconFromCopy: HTMLButtonElement;
  private iconFromVolume: HTMLButtonElement;
  private iconToCopy: HTMLButtonElement;
  private iconToVolume: HTMLButtonElement;

  /**
   * Создает новый экземпляр класса Translator и инициализирует приложение.
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
   * Создает и добавляет элементы DOM для интерфейса приложения Translator.
   * @private
   * @returns {void}
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='bg-white border shadow rounded max-w-2xl w-full p-3 grid gap-4'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Translator</h1>
        <div class='grid gap-3'>
          <div class='grid gap-3 md:grid-cols-2'>
            <textarea class='px-3 py-2 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50 resize-none min-h-[130px]' data-text='from' placeholder='Enter text'></textarea>
            <textarea class='px-3 py-2 border rounded w-full focus:outline-none focus:border-blue-400 bg-gray-100 resize-none min-h-[130px]' data-text='to' placeholder='Translation' readonly disabled></textarea>
          </div>

          <ul class='grid gap-3 md:grid-cols-[1fr_auto_1fr]'>
            <li class='grid grid-cols-[auto_1fr] gap-2'>
              <div class='grid grid-cols-2 gap-2'>
                <button class='p-3 border hover:bg-slate-50' data-icon-from-copy><span class='pointer-events-none'>${feather.icons.clipboard.toSvg()}</span></button>
                <button class='p-3 border hover:bg-slate-50' data-icon-from-volume><span class='pointer-events-none'>${feather.icons['volume-2'].toSvg()}</span></button>
              </div>

              <select class='px-3 py-2 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50' data-select='from'>
                 ${countries.map(({ value, name }: ICountry) => value === 'en-GB'
      ? `<option value='${value}' selected>${name}</option>` : `<option value='${value}'>${name}</option>`).join('')}
              </select>
            </li>

            <li class='flex justify-center'>
              <button class='p-3 border hover:bg-slate-50' data-exchange><span class='pointer-events-none'>${feather.icons['refresh-cw'].toSvg()}</span></button>
            </li>

            <li class='grid grid-cols-[1fr_auto] gap-2'>
              <select class='px-3 py-2 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50' data-select='to'>
                ${countries.map(({ value, name }: ICountry) => value === 'ru-RU'
      ? `<option value='${value}' selected>${name}</option>` : `<option value='${value}'>${name}</option>`).join('')}
              </select>

              <div class='grid grid-cols-2 gap-2'>
                <button class='p-3 border hover:bg-slate-50' data-icon-to-copy><span class='pointer-events-none'>${feather.icons.clipboard.toSvg()}</span></button>
                <button class='p-3 border hover:bg-slate-50' data-icon-to-volume><span class='pointer-events-none'>${feather.icons['volume-2'].toSvg()}</span></button>
              </div>
            </li>

          </ul>
        </div>

        <button class='p-3 border hover:bg-slate-50' data-submit>Translate Text</button>
      </div>
    `;

    this.btnSubmit = root.querySelector('[data-submit]')!;
    this.selectFrom = root.querySelector('[data-select="from"]')!;
    this.textareaFrom = root.querySelector('[data-text="from"]')!;
    this.selectTo = root.querySelector('[data-select="to"]')!;
    this.textareaTo = root.querySelector('[data-text="to"]')!;
    this.exchangeBtn = root.querySelector('[data-exchange]')!;
    this.iconFromCopy = root.querySelector('[data-icon-from-copy]')!;
    this.iconFromVolume = root.querySelector('[data-icon-from-volume]')!;
    this.iconToCopy = root.querySelector('[data-icon-to-copy]')!;
    this.iconToVolume = root.querySelector('[data-icon-to-volume]')!;
  }

  /**
   * Настраивает обработчики событий для элементов приложения.
   * @private
   */
  private setupEventListeners(): void {
    this.btnSubmit.addEventListener('click', this.handleSubmit.bind(this));
    this.exchangeBtn.addEventListener('click', this.handleExchange.bind(this));
    this.iconFromCopy.addEventListener('click', this.handleCopy.bind(this));
    this.iconToCopy.addEventListener('click', this.handleCopy.bind(this));
    this.iconFromVolume.addEventListener('click', this.handleSpeech.bind(this));
    this.iconToVolume.addEventListener('click', this.handleSpeech.bind(this));
  }

  /**
   * Обработчик события при нажатии на кнопку "Translate Text".
   * @param {MouseEvent} event - Событие нажатия на кнопку.
   * @returns {Promise<void>} - Промис, который выполняется при успешном переводе.
   * @private
   */
  private async handleSubmit(event: MouseEvent) {
    const target = event.target as HTMLButtonElement;
    const textFrom = this.textareaFrom.value.trim();
    if (textFrom.length === 0) {
      toast('Please fill the field', 'warning');
      return;
    }
    try {
      target.textContent = 'Loading...';
      const { data: { responseData: { translatedText } } } = await axios.get(`https://api.mymemory.translated.net/get?q=${textFrom}&langpair=${this.selectFrom.value}|${this.selectTo.value}`);
      this.textareaTo.value = translatedText;
      target.textContent = 'Translate Text';
    } catch (e) {
      toast('Something went wrong, open dev console', 'error');
      console.log(e);
    }
  }

  /**
   * Обработчик события при нажатии на кнопку обмена языками.
   * @private
   */
  private handleExchange() {
    const tmpText = this.textareaFrom.value;
    const tmpSelect = this.selectFrom.value;
    this.textareaFrom.value = this.textareaTo.value;
    this.textareaTo.value = tmpText;
    this.selectFrom.value = this.selectTo.value;
    this.selectTo.value = tmpSelect;
  }

  /**
   * Обработчик события при нажатии на кнопку копирования текста.
   * @param {MouseEvent} event - Событие нажатия на кнопку копирования.
   * @private
   */
  private handleCopy(event: MouseEvent) {
    const target = event.target as HTMLButtonElement;
    navigator.clipboard.writeText(target.matches('[data-icon-from-copy=""]') ? this.textareaFrom.value : this.textareaTo.value);
    toast('Success copy to clipboard', 'success');
  }

  /**
   * Обработчик события при нажатии на кнопку воспроизведения текста.
   * @param {MouseEvent} event - Событие нажатия на кнопку воспроизведения.
   * @private
   */
  private handleSpeech(event: MouseEvent) {
    const target = event.target as HTMLButtonElement;
    const speechConfig = new SpeechSynthesisUtterance(target.matches('[data-icon-from-volume=""]') ? this.textareaFrom.value : this.textareaTo.value);
    speechConfig.lang = target.matches('[data-icon-from-volume=""]') ? this.selectFrom.value : this.selectTo.value;
    speechSynthesis.speak(speechConfig);
  }
}

// Создаем экземпляр класса Translator для запуска приложения.
new Translator();
