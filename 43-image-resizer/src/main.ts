import './style.scss';
import feather from 'feather-icons';
import { toast } from './utils/toast.ts';

/**
 * Класс для работы с ресайзом изображений.
 */
class ImageResizer {
  private upload: HTMLDivElement;
  private uploadImg: HTMLImageElement;
  private inputUpload: HTMLInputElement;
  private inputWidth: HTMLInputElement;
  private inputHeight: HTMLInputElement;
  private inputRatio: HTMLInputElement;
  private inputQuality: HTMLInputElement;
  private btnDownload: HTMLButtonElement;
  private imageRatio: number;

  /**
   * Создает экземпляр класса Classname и вызывает метод initialize.
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует класс, создавая DOM-элементы и настраивая обработчики событий.
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает DOM-элементы для интерфейса приложения.
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='bg-white border shadow rounded max-w-md w-full p-3 grid gap-4'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Image Resizer</h1>
        <div class='grid gap-4 h-[250px] overflow-hidden transition-all'>

          <div class='h-[250px] grid place-items-center cursor-pointer rounded-md border-2 border-dashed' data-upload>
            <div class='grid place-items-center gap-2 w-full relative overflow-hidden'>
            <input type='file' accept='image/*' class='visually-hidden' data-upload-input>
            <div>${feather.icons.image.toSvg({ width: 48, height: 48 })}</div>
            <img class='visually-hidden absolute top-0 left-0 bottom-0 right-0 w-full h-full' src='#' alt='image' data-image>
            <p class='font-medium'>Browse File to Upload</p>
            </div>
          </div>

          <div class='grid grid-cols-2 gap-4'>
            <label class='grid gap-1'>
              <span class='text-sm font-medium'>Width</span>
              <input class='px-3 py-2 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50' type='number' data-width>
            </label>
            <label class='grid gap-1'>
              <span class='text-sm font-medium'>Height</span>
              <input class='px-3 py-2 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50' type='number' data-height>
            </label>
            <label class='flex flex-wrap items-center gap-1'>
              <input class='visually-hidden' type='checkbox' data-ratio checked>
              <span class='checkbox'></span>
              <span class='text-sm font-medium'>Lock aspect ratio</span>
            </label>
            <label class='flex flex-wrap items-center gap-1'>
              <input class='visually-hidden' type='checkbox' data-quality>
              <span class='checkbox'></span>
              <span class='text-sm font-medium'>Reduce quality</span>
            </label>
            <button class='px-3 py-2 border hover:bg-slate-50 col-span-2' data-download>Download Image</button>
          </div>

        </div>
      </div>
    `;

    this.upload = root.querySelector('[data-upload]')!;
    this.uploadImg = root.querySelector('[data-image]')!;
    this.inputUpload = root.querySelector('[data-upload-input]')!;
    this.inputWidth = root.querySelector('[data-width]')!;
    this.inputHeight = root.querySelector('[data-height]')!;
    this.inputRatio = root.querySelector('[data-ratio]')!;
    this.inputQuality = root.querySelector('[data-quality]')!;
    this.btnDownload = root.querySelector('[data-download]')!;
  }

  /**
   * Настраивает обработчики событий для элементов интерфейса.
   */
  private setupEventListeners(): void {
    this.upload.addEventListener('click', () => this.inputUpload.click());
    this.inputUpload.addEventListener('change', this.handleLoadFile.bind(this));
    this.btnDownload.addEventListener('click', this.handleDownload.bind(this));
    this.inputWidth.addEventListener('keyup', this.handleKeyUp.bind(this));
    this.inputHeight.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  /**
   * Обрабатывает событие загрузки файла изображения.
   * @param {Event} event - Событие загрузки файла.
   */
  private handleLoadFile(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    const file = files[0];
    if (!file) return;

    this.uploadImg.classList.remove('visually-hidden');
    this.uploadImg.src = URL.createObjectURL(file);

    this.uploadImg.addEventListener('load', () => {
      this.inputWidth.value = String(this.uploadImg.naturalWidth);
      this.inputHeight.value = String(this.uploadImg.naturalHeight);
      this.imageRatio = this.uploadImg.naturalWidth / this.uploadImg.naturalHeight;
      this.upload.parentElement!.classList.add('h-[435px]');
      this.uploadImg.nextElementSibling!.classList.add('hidden');
      this.inputUpload.nextElementSibling!.classList.add('hidden');
      this.inputUpload.parentElement!.classList.add('h-full');
    });
  }

  /**
   * Обрабатывает событие скачивания обработанного изображения.
   */
  private handleDownload() {
    this.btnDownload.textContent = 'Downloading...';

    const canvas = document.createElement('canvas');
    const a = document.createElement('a');
    const ctx = canvas.getContext('2d');
    const imgQuality = this.inputQuality.checked ? 0.6 : 1.0;

    canvas.width = Number(this.inputWidth.value);
    canvas.height = Number(this.inputHeight.value);

    setTimeout(() => {
      ctx!.drawImage(this.upload.querySelector('img')!, 0, 0, canvas.width, canvas.height);
      a.href = canvas.toDataURL('image/jpeg', imgQuality);
      a.download = new Date().getTime().toString();
      a.click();

      this.btnDownload.textContent = 'Download Image';
      toast('Image successfully downloaded', 'success');
    }, 1000);
  }

  /**
   * Обрабатывает событие нажатия клавиши при вводе ширины или высоты изображения.
   * @param {KeyboardEvent} event - Событие нажатия клавиши.
   */
  private handleKeyUp(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;
    if (target.matches('[data-width="')) {
      this.inputHeight.value = String(Math.floor(this.inputRatio.checked ? Number(this.inputWidth.value) / this.imageRatio : Number(this.inputHeight.value)));
    }
    if (target.matches('[data-height="')) {
      this.inputWidth.value = String(Math.floor(this.inputRatio.checked ? Number(this.inputHeight.value) * this.imageRatio : Number(this.inputWidth.value)));
    }
  }
}

new ImageResizer();
