import './style.scss';
import feather from 'feather-icons';
import { toast } from './utils/toast.ts';
import axios from 'axios';

/**
 * Класс QRReader представляет интерфейс для сканирования и чтения QR-кодов.
 * @class
 */
class QRReader {
  /**
   * @private
   * @type {HTMLDivElement}
   */
  private parent: HTMLDivElement;

  /**
   * @private
   * @type {HTMLFormElement}
   */
  private form: HTMLFormElement;

  /**
   * @private
   * @type {HTMLInputElement}
   */
  private formInput: HTMLInputElement;

  /**
   * @private
   * @type {HTMLImageElement}
   */
  private formImg: HTMLImageElement;

  /**
   * @private
   * @type {HTMLParagraphElement}
   */
  private formText: HTMLParagraphElement;

  /**
   * @private
   * @type {HTMLTextAreaElement}
   */
  private textarea: HTMLTextAreaElement;

  /**
   * @private
   * @type {HTMLButtonElement}
   */
  private closeBtn: HTMLButtonElement;

  /**
   * @private
   * @type {HTMLButtonElement}
   */
  private copyBtn: HTMLButtonElement;

  /**
   * Создает экземпляр класса QRReader.
   * @constructor
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует класс, создает DOM-элементы и устанавливает обработчики событий.
   * @private
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает DOM-элементы для интерфейса QR-сканера.
   * @private
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='bg-white border shadow rounded max-w-md w-full p-3 grid gap-4'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>QR Reader</h1>
        <div class='grid gap-3 max-h-[200px] overflow-hidden' data-app>
          <form class='min-h-[200px] grid place-content-center border-2 border-dashed border-black rounded cursor-pointer transition-all' data-form>
            <input type='file' data-file class='visually-hidden'>
            <img src='#' alt='qr-code' data-image class='hidden h-[190px] object-cover'>
            <div class='grid gap-2 place-items-center'>
              ${feather.icons['upload-cloud'].toSvg()}
              <p data-text>Upload QR Code to Read</p>
            </div>
          </form>
          <div class='content flex grid grid-cols-2 gap-3'>
            <textarea class='px-3 py-2 border col-span-2 rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50 resize-none min-h-[150px]' data-textarea spellcheck='false' disabled></textarea>
            <button class='px-3 py-2 border hover:bg-slate-50 ' data-close>Close</button>
            <button class='px-3 py-2 border hover:bg-slate-50 ' data-copy>Copy</button>
          </div>
        </div>
      </div>
    `;
    this.parent = root.querySelector('[data-app]')!;
    this.form = root.querySelector('[data-form]')!;
    this.formInput = root.querySelector('[data-file]')!;
    this.formImg = root.querySelector('[data-image]')!;
    this.formText = root.querySelector('[data-text]')!;
    this.textarea = root.querySelector('[data-textarea]')!;
    this.closeBtn = root.querySelector('[data-close]')!;
    this.copyBtn = root.querySelector('[data-copy]')!;
  }

  /**
   * Устанавливает обработчики событий.
   * @private
   */
  private setupEventListeners(): void {
    this.form.addEventListener('click', () => this.formInput.click());
    this.formInput.addEventListener('change', this.handleChange.bind(this));
    this.copyBtn.addEventListener('click', this.handleCopy.bind(this));
    this.closeBtn.addEventListener('click', this.handleReset.bind(this));
  }

  /**
   * Обработчик события изменения файла в input[type="file"].
   * @param {Event} event - Событие изменения файла.
   * @returns {Promise<void>}
   * @private
   */
  private async handleChange({ target: { files } }: Event): Promise<void> {
    const file = (files as FileList)[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    await this.handleScanner(file, formData);
  }

  /**
   * Обработчик события копирования текста.
   * Копирует текст в буфер обмена и выводит уведомление.
   * @private
   */
  private handleCopy(): void {
    if (this.textarea.value.trim().length === 0) return;
    navigator.clipboard.writeText(this.textarea.value);
    toast('Text copied successfully to clipboard', 'success');
  }

  /**
   * Обработчик события сброса состояния интерфейса.
   * @private
   */
  private handleReset(): void {
    this.formImg.classList.add('hidden');
    this.formImg.src = '#';
    this.form.reset();
    this.form.querySelector('div')?.classList.remove('hidden');
    this.parent.classList.remove('max-h-[420px]');
    this.parent.classList.add('max-h-[200px]');
  }

  /**
   * Обработчик события сканирования QR-кода.
   * @param {File} file - Сканированный файл.
   * @param {FormData} formData - Данные формы с файлом.
   * @returns {Promise<void>}
   * @private
   */
  private async handleScanner(file: File, formData: FormData): Promise<void> {
    this.formText.innerText = 'Scanning QR Code...';

    try {
      const { data } = await axios.post('https://api.qrserver.com/v1/read-qr-code/', formData);
      const { data: text } = data[0].symbol[0];
      this.formText.innerText = text ? 'Upload QR Code to Scan' : 'Couldn\'t scan QR Code';
      if (!text) {
        toast('Couldn\'t scan QR Code', 'warning');
        this.handleReset();
        return;
      }
      this.textarea.value = text;
      this.formImg.src = URL.createObjectURL(file);
      this.formImg.classList.remove('hidden');
      this.form.querySelector('div')?.classList.add('hidden');
      this.parent.classList.add('max-h-[420px]');
    } catch (e) {
      toast('Something went wrong, open dev console', 'error');
      this.formText.innerText = 'Couldn\'t scan QR Code';
      console.log(e);
    }
  }
}

// Создаем экземпляр класса QRReader.
new QRReader();
