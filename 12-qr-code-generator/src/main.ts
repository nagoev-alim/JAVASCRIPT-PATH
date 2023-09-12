import './style.css';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

/**
 * QRCodeGenerator - класс для создания QR-кодов из введенного текста или URL.
 */
class QRCodeGenerator {
  /**
   * @member {HTMLFormElement | null} form - Форма для ввода текста и настроек QR-кода.
   */
  private form: HTMLFormElement | null = null;

  /**
   * @member {HTMLButtonElement | null} submitBtn - Кнопка для отправки формы и генерации QR-кода.
   */
  private submitBtn: HTMLButtonElement | null = null;

  /**
   * @member {HTMLDivElement | null} qrcode - Элемент для отображения QR-кода.
   */
  private qrcode: HTMLDivElement | null = null;

  /**
   * @member {HTMLLinkElement | null} saveBtn - Ссылка для сохранения изображения QR-кода.
   */
  private saveBtn: HTMLLinkElement | null = null;

  /**
   * @member {HTMLDivElement | null} container - Контейнер для отображения QR-кода и сохраненной ссылки.
   */
  private container: HTMLDivElement | null = null;

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
  private initialize() {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает DOM-структуру интерфейса приложения и присваивает найденные элементы соответствующим полям класса.
   */
  private createDOM() {
    const root = document.querySelector<HTMLDivElement>('#app');
    if (!root) return;

    const sizes: number[] = [100, 200, 300, 400, 500, 600, 700];
    const selectedSize: number = 300;

    root.innerHTML = `
      <div class='border shadow rounded max-w-md w-full p-3 grid gap-4 max-h-[288px] overflow-hidden transition-all' data-container>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>QR Code Generator</h1>
        <p class='text-center'>Paste a url or enter text to create QR code</p>
        <form class='grid gap-3' data-form>
          <input class='border-2 px-3 py-2.5 cursor-pointer' type='text' name='text' placeholder='Enter text or url' />
          <select class='border-2 px-3 py-2.5 cursor-pointer' name='size'>
            ${sizes.map(index => `<option ${index === selectedSize ? 'selected' : ''} value='${index}'>${index}x${index}</option>`).join('')}
          </select>
          <button class='border px-3 py-2.5 hover:bg-neutral-100' type='submit' data-submit>Generate QR Code</button>
        </form>
        <div class=' grid gap-3'>
          <div class='mx-auto' id='qrcode'></div>
          <a class='flex items-center justify-center border px-3 py-2.5 hover:bg-neutral-100' href='#' download='qrcode' data-save>Save Image</a>
        </div>
      </div>
    `;

    this.form = root.querySelector<HTMLFormElement>('[data-form]');
    this.submitBtn = root.querySelector<HTMLButtonElement>('[data-submit]');
    this.qrcode = root.querySelector<HTMLDivElement>('#qrcode');
    this.saveBtn = root.querySelector<HTMLLinkElement>('[data-save]');
    this.container = root.querySelector<HTMLDivElement>('[data-container]');
  }

  /**
   * Настраивает обработчики событий для формы.
   */
  private setupEventListeners() {
    this.form?.addEventListener('submit', this.handleSubmit.bind(this));
  }

  /**
   * Обрабатывает отправку формы и генерирует QR-код.
   * @param {Event} event - Событие отправки формы.
   */
  private handleSubmit(event: Event) {
    if (!this.qrcode || !this.container || !this.submitBtn) return;

    event.preventDefault();
    const form = event.target as HTMLFormElement;
    this.qrcode.innerHTML = ``;
    this.container.classList.remove('max-h-[688px]', 'overflow-auto');
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

    this.submitBtn.textContent = 'Generating QR Code...';

    new QRCode('qrcode', {
      text: text,
      width: size,
      height: size,
    });

    setTimeout(() => {
      if (!this.saveBtn || !this.qrcode || !this.container || !this.submitBtn) return;
      const imgSrc = this.qrcode.querySelector('img')?.src;
      if (imgSrc !== undefined) {
        this.saveBtn.href = imgSrc;
        this.container.classList.add('max-h-[688px]', 'overflow-auto');
        this.submitBtn.textContent = 'Generate QR Code';
      }
    }, 1000);
  }
}

// Создаем экземпляр QRCodeGenerator, инициализируя приложение.
new QRCodeGenerator();
