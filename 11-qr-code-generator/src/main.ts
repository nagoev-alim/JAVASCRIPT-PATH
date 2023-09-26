import './style.css';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

/**
 * Класс QRCodeGenerator представляет генератор QR-кода и управляет его интерфейсом.
 */
class QRCodeGenerator {
  private form: HTMLFormElement | null = null;
  private qrcode: HTMLImageElement | null = null;
  private submitBtn: HTMLButtonElement | null = null;
  private saveBtn: HTMLButtonElement | null = null;
  private container: HTMLDivElement | null = null;

  /**
   * Создает экземпляр класса QRCodeGenerator и инициализирует его.
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует элементы DOM и устанавливает обработчики событий.
   */
  private initialize() {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает элементы DOM для интерфейса генератора QR-кода.
   */
  private createDOM() {
    const root:HTMLDivElement = document.querySelector('#app')!;
    if (!root) return;

    root.innerHTML = `
      <div class='border shadow rounded max-w-md w-full p-3 grid gap-4'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>QR Code Generator</h1>
        <p>Paste a url or enter text to create QR code</p>
        <form class='grid gap-3' data-form>
          <input class='border-2 px-3 py-2.5 cursor-pointer' type='text' name='text' placeholder='Enter text or url' />
          <select class='border-2 px-3 py-2.5 cursor-pointer' name='size'>
            ${[100, 200, 300, 400, 500, 600, 700].map(
      (index) =>
        `<option ${
          index === 300 ? 'selected' : ''
        } value='${index}'>${index}x${index}</option>`,
    ).join('')}
          </select>
          <button class='border px-3 py-2.5 hover:bg-neutral-100' type='submit' data-submit>Generate QR Code</button>
        </form>

        <div class='hidden grid gap-3' data-container>
          <img class='mx-auto' src='' alt='QR Code' data-code>
          <button class='border px-3 py-2.5 hover:bg-neutral-100' data-save>Save</button>
        </div>
      </div>
    `;

    this.form = root.querySelector<HTMLFormElement>('[data-form]');
    this.qrcode = root.querySelector<HTMLImageElement>('[data-code]');
    this.submitBtn = root.querySelector<HTMLButtonElement>('[data-submit]');
    this.saveBtn = root.querySelector<HTMLButtonElement>('[data-save]');
    this.container = root.querySelector<HTMLDivElement>('[data-container]');
  }

  /**
   * Устанавливает обработчики событий для формы и кнопки "Save".
   */
  private setupEventListeners(): void {
    this.form?.addEventListener('submit', this.handleSubmit.bind(this));
    this.saveBtn?.addEventListener('click', this.handleSave.bind(this));
  }

  /**
   * Обрабатывает событие отправки формы для создания QR-кода.
   * @param {Event} event - Событие отправки формы.
   */
  private handleSubmit(event: Event) {
    event.preventDefault();
    if (!this.submitBtn || !this.qrcode || !this.container) return;
    const form = event.target as HTMLFormElement;
    const { text, size } = Object.fromEntries(new FormData(form).entries());
    if (!text) {
      Toastify({
        text: '⛔️ Please enter a valid URL',
        className: 'bg-none shadow-none bg-orange-100 text-black border border-orange-200',
        duration: 3000,
        gravity: 'bottom',
        position: 'center',
      }).showToast();
      return;
    }
    this.submitBtn.textContent = 'Generating QR Code';
    this.qrcode.src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${text}`;
    this.qrcode.addEventListener('load', () => {
      this.container!.classList.remove('hidden');
      this.submitBtn!.textContent = 'Generate QR Code';
    });
  }

  /**
   * Обрабатывает событие нажатия кнопки "Save" для сохранения QR-кода.
   */
  private async handleSave() {
    if (!this.qrcode) return;
    const image = await fetch(this.qrcode.src);
    const imageBlob = await image.blob();
    const imageURL = URL.createObjectURL(imageBlob);
    const link = document.createElement('a');
    link.href = imageURL;
    link.download = 'QRCode';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Создаем экземпляр класса QRCodeGenerator для инициализации приложения.
new QRCodeGenerator();
