import './style.css';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

/**
 * QRCodeGenerator - класс для создания QR-кодов из введенного текста или URL.
 */
class QRCodeGenerator {
  /**
   * @member {HTMLFormElement} form - Форма для ввода текста и настроек QR-кода.
   */
  private form: HTMLFormElement;

  /**
   * @member {HTMLButtonElement} submitBtn - Кнопка для отправки формы и генерации QR-кода.
   */
  private submitBtn: HTMLButtonElement;

  /**
   * @member {HTMLCanvasElement} qrcode - Элемент для отображения QR-кода.
   */
  private qrcode: HTMLCanvasElement;

  /**
   * @member {HTMLLinkElement} saveBtn - Ссылка для сохранения изображения QR-кода.
   */
  private saveBtn: HTMLLinkElement;

  /**
   * @member {HTMLDivElement} container - Контейнер для отображения QR-кода и сохраненной ссылки.
   */
  private container: HTMLDivElement;

  /**
   * Создает экземпляр QRCodeGenerator и инициализирует его.
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует объект QRCodeGenerator.
   * Вызывает методы createDOM() и setupEventListeners() для настройки интерфейса и обработки событий.
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает DOM-структуру интерфейса приложения и присваивает найденные элементы соответствующим полям класса.
   */
  private createDOM(): void {
    const root: HTMLDivElement = document.querySelector('#app')!;
    if (!root) return;

    const sizes: number[] = [100, 200, 300, 400, 500, 600, 700];
    const selectedSize: number = 300;

    root.innerHTML = `
      <div class='border shadow rounded max-w-md w-full p-3 grid gap-4 max-h-[340px] overflow-hidden transition-all' data-container>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>QR Code Generator</h1>
        <p class='text-center'>Paste a url or enter text to create QR code</p>
        <form class='grid gap-3' data-form>
          <input class='border-2 px-3 py-2.5 cursor-pointer rounded' type='text' name='text' placeholder='Enter text or url' />
          <input class='cursor-pointer w-full h-10 rounded' type='color' name='color' value='#000'>
          <select class='border-2 px-3 py-2.5 cursor-pointer' name='size'>
            ${sizes.map(index => `<option ${index === selectedSize ? 'selected' : ''} value='${index}'>${index}x${index}</option>`).join('')}
          </select>
          <button class='border px-3 py-2.5 hover:bg-neutral-100' type='submit' data-submit>Generate QR Code</button>
        </form>
        <div class=' grid gap-3'>
          <canvas class='mx-auto' id='qrcode'></canvas>
          <a class='flex items-center justify-center border px-3 py-2.5 hover:bg-neutral-100' href='#' download='qrcode' data-save>Save Image</a>
        </div>
      </div>
    `;

    this.form = root.querySelector('[data-form]')!;
    this.submitBtn = root.querySelector('[data-submit]')!;
    this.qrcode = root.querySelector('#qrcode')!;
    this.saveBtn = root.querySelector('[data-save]')!;
    this.container = root.querySelector('[data-container]')!;
  }

  /**
   * Настраивает обработчики событий для формы.
   */
  private setupEventListeners(): void {
    this.form?.addEventListener('submit', this.handleSubmit.bind(this));
  }

  /**
   * Обрабатывает отправку формы и генерирует QR-код.
   * @param {Event} event - Событие отправки формы.
   */
  private handleSubmit(event: Event): void {
    if (!this.qrcode || !this.container || !this.submitBtn) return;

    event.preventDefault();
    const form = event.target as HTMLFormElement;
    this.qrcode.innerHTML = ``;
    this.container.classList.remove('max-h-[730px]', 'overflow-auto');
    const { text, size, color } = Object.fromEntries(new FormData(form).entries());

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

    this.submitBtn.textContent = 'Generating QR Code...';

    const qrCode = new QRious({
      element: this.qrcode,
      backgroundAlpha: 1,
      foreground: `${color}`,
      foregroundAlpha: 0.8,
      level: 'H',
      size: Number(size),
      value: text,
    });

    setTimeout(() => {
      if (!this.saveBtn || !this.container || !this.submitBtn) return;
      this.saveBtn.href = qrCode.toDataURL();
      this.submitBtn.textContent = 'Generate QR Code';
      this.container.classList.add('max-h-[730px]', 'overflow-auto');
    }, 1000);
  }
}

// Создаем экземпляр QRCodeGenerator, инициализируя приложение.
new QRCodeGenerator();
