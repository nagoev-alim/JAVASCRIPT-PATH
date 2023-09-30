import './style.scss';
import feather from 'feather-icons';
import { capitalStr } from './utils/capitalStr.ts';

interface IOption {
  brightness: string,
  saturation: string,
  inversion: string,
  grayscale: string,
  rotate: number,
  flipHorizontal: number,
  flipVertical: number,
}

/**
 * Класс для редактирования изображений.
 */
class ImageEditor {
  private inputFile: HTMLInputElement;
  private filterOptions: NodeListOf<HTMLButtonElement>;
  private filterSliderName: HTMLParagraphElement;
  private filterSliderValue: HTMLParagraphElement;
  private filterSliderInput: HTMLInputElement;
  private rotateOptions: NodeListOf<HTMLButtonElement>;
  private preview: HTMLImageElement;
  private btnReset: HTMLButtonElement;
  private btnChoose: HTMLButtonElement;
  private btnSave: HTMLButtonElement;

  private imgName: null | string = null;
  private isDisable: boolean = true;
  private options: IOption = {
    brightness: '100',
    saturation: '100',
    inversion: '0',
    grayscale: '0',
    rotate: 0,
    flipHorizontal: 1,
    flipVertical: 1,
  };

  /**
   * Создает экземпляр класса ImageEditor.
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует класс и создает необходимые элементы в DOM.
   * @private
   */
  initialize() {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает DOM-элементы и размещает их на странице.
   * @private
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='bg-white border shadow rounded max-w-4xl w-full p-3 grid gap-4'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Image Editor</h1>
        <div class='grid md:grid-cols-[0.3fr_0.7fr] gap-3'>
          <div class='grid gap-2'>
            <div class='grid gap-2'>
              <p class='font-medium'>Filters</p>
              <div class='grid gap-2 grid-cols-2'>
                ${['brightness', 'saturation', 'inversion', 'grayscale'].map((el, idx) => `
                  <button data-option='${el}' class='px-3 py-2 border ${idx === 0 ? 'active bg-neutral-400 text-white hover:bg-neutral-500' : ''}'>${capitalStr(el)}</button>
                `).join('')}
              </div>
              <div class='grid gap-2'>
                <div class='flex items-center justify-between'>
                  <p class='font-medium' data-slider-name>Brighteness</p>
                  <p class='font-bold' data-slider-value>100%</p>
                </div>
                <input type='range' value='100' min='0' max='200' data-slider-input>
              </div>
            </div>
            <div class='grid gap-2'>
              <p class='font-medium'>Rotate & Flip</p>
              <div class='grid gap-2 grid-cols-4'>
                <button class='p-3 border hover:bg-slate-50' data-rotate='left'>${feather.icons['rotate-ccw'].toSvg()}</button>
                <button class='p-3 border hover:bg-slate-50' data-rotate='right'>${feather.icons['rotate-cw'].toSvg()}</button>
                <button class='p-3 border hover:bg-slate-50' data-rotate='horizontal'>${feather.icons['minimize-2'].toSvg()}</button>
                <button class='p-3 border hover:bg-slate-50' data-rotate='vertical'>${feather.icons['minimize-2'].toSvg()}</button>
              </div>
            </div>
          </div>
          <div class='grid place-content-center bg-gray-200 max-h-[600px] min-h-[400px] h-full rounded-md relative'>
            <img src='#' alt='preview-img' draggable='false' class='absolute w-full h-full object-contain hidden' data-preview>
            <div class='grid gap-2 place-items-center'>
              ${feather.icons.image.toSvg()}
              <p>Choose Image Or Edit</p>
            </div>
          </div>
        </div>
        <div class='flex gap-3'>
          <button class='px-3 py-2 border hover:bg-slate-50' data-reset>Reset Filters</button>
          <div class='ml-auto'><input type='file' accept='image/*' class='visually-hidden' data-input></div>
          <button class='px-3 py-2 border hover:bg-slate-50' data-choose>Choose Image</button>
          <button class='px-3 py-2 border hover:bg-slate-50' data-save>Save Image</button>
        </div>
      </div>
    `;

    this.inputFile = root.querySelector('[data-input]')!;
    this.filterOptions = root.querySelectorAll('[data-option]')!;
    this.filterSliderName = root.querySelector('[data-slider-name]')!;
    this.filterSliderValue = root.querySelector('[data-slider-value]')!;
    this.filterSliderInput = root.querySelector('[data-slider-input]')!;
    this.rotateOptions = root.querySelectorAll('[data-rotate]')!;
    this.preview = root.querySelector('[data-preview]')!;
    this.btnReset = root.querySelector('[data-reset]')!;
    this.btnChoose = root.querySelector('[data-choose]')!;
    this.btnSave = root.querySelector('[data-save]')!;
  }

  /**
   * Устанавливает обработчики событий для элементов интерфейса.
   * @private
   */
  private setupEventListeners(): void {
    this.filterSliderInput.addEventListener('input', this.handleSliderChange.bind(this));
    this.filterOptions.forEach(filter => filter.addEventListener('click', this.handleFilterOptionClick.bind(this)));
    this.rotateOptions.forEach(filter => filter.addEventListener('click', this.handleRotateOptionClick.bind(this)));
    this.inputFile.addEventListener('change', this.handleFileChange.bind(this));
    this.btnReset.addEventListener('click', this.handleReset.bind(this));
    this.btnSave.addEventListener('click', this.handleSave.bind(this));
    this.btnChoose.addEventListener('click', () => this.inputFile.click());
  }

  /**
   * Обрабатывает изменение положения слайдера для фильтров.
   * @param {Object} event - Событие изменения слайдера.
   */
  private handleSliderChange({ target: { value } }: { target: { value: string } }): void {
    if (this.isDisable) return;
    this.filterSliderValue.innerHTML = `${value}%`;
    switch (document.querySelector('[data-option].active')!.dataset.option) {
      case 'brightness':
        this.options.brightness = value;
        break;
      case 'saturation':
        this.options.saturation = value;
        break;
      case 'inversion':
        this.options.inversion = value;
        break;
      default:
        this.options.grayscale = value;
        break;
    }
    this.applyFilter();
  }

  /**
   * Применяет выбранный фильтр к изображению.
   * @private
   */
  private applyFilter(): void {
    if (this.isDisable) return;
    this.preview.classList.remove('hidden');
    this.preview.nextElementSibling!.classList.add('hidden');
    this.preview.style.transform = `rotate(${this.options.rotate}deg) scale(${this.options.flipHorizontal}, ${this.options.flipVertical})`;
    this.preview.style.filter = `brightness(${this.options.brightness}%) saturate(${this.options.saturation}%) invert(${this.options.inversion}%) grayscale(${this.options.grayscale}%)`;
  }

  /**
   * Обрабатывает клик на кнопке выбора фильтра.
   * @param {MouseEvent} event - Событие клика на кнопке.
   */
  private handleFilterOptionClick(event: MouseEvent): void {
    const target = event.target as HTMLButtonElement;
    if (this.isDisable) return;
    this.filterOptions.forEach(el => el.classList.remove('active', 'bg-neutral-400', 'text-white', 'hover:bg-neutral-500'));
    target.classList.add('active', 'bg-neutral-400', 'text-white', 'hover:bg-neutral-500');

    this.filterSliderName.innerText = target.innerText;
    switch (target.dataset.option) {
      case 'brightness':
        this.filterSliderName.max = '200';
        this.filterSliderInput.value = this.options.brightness;
        this.filterSliderValue.innerText = `${this.options.brightness}%`;
        break;
      case 'saturation':
        this.filterSliderName.max = '200';
        this.filterSliderInput.value = this.options.saturation;
        this.filterSliderValue.innerText = `${this.options.saturation}%`;
        break;
      case 'inversion':
        this.filterSliderName.max = '100';
        this.filterSliderInput.value = this.options.inversion;
        this.filterSliderValue.innerText = `${this.options.inversion}%`;
        break;
      default:
        this.filterSliderName.max = '100';
        this.filterSliderInput.value = this.options.grayscale;
        this.filterSliderValue.innerText = `${this.options.grayscale}%`;
        break;
    }
  }

  /**
   * Обрабатывает клик на кнопке поворота изображения.
   * @param {MouseEvent} event - Событие клика на кнопке.
   */
  private handleRotateOptionClick(event: MouseEvent): void {
    if (this.isDisable) return;
    const target = event.target as HTMLButtonElement;
    switch (target.dataset.rotate) {
      case 'left':
        this.options.rotate -= 90;
        break;
      case 'right':
        this.options.rotate += 90;
        break;
      case 'horizontal':
        this.options.flipHorizontal = this.options.flipHorizontal === 1 ? -1 : 1;
        break;
      default:
        this.options.flipVertical = this.options.flipVertical === 1 ? -1 : 1;
        break;
    }

    this.applyFilter();
  }

  /**
   * Обрабатывает изменение выбранного файла изображения.
   * @param {Object} event - Событие изменения файла в input.
   */
  private handleFileChange({ target: { files } }: { target: { files: FileList } }): void {
    let file = files[0];
    if (!file) {
      return;
    }
    this.preview.src = URL.createObjectURL(file);
    this.preview.addEventListener('load', () => {
      this.isDisable = false;
      this.btnReset.click();
      this.imgName = file.name.replace(/^.*[\\\/]/, '');
    });
  }

  /**
   * Сбрасывает все настройки фильтров к исходным значениям.
   * @private
   */
  private handleReset(): void {
    if (this.isDisable) return;
    this.options.brightness = '100';
    this.options.saturation = '100';
    this.options.inversion = '0';
    this.options.grayscale = '0';
    this.options.rotate = 0;
    this.options.flipHorizontal = 1;
    this.options.flipVertical = 1;
    this.filterOptions[0].click();
    this.applyFilter();
  }

  /**
   * Сохраняет отредактированное изображение.
   * @param {MouseEvent} event - Событие клика на кнопке сохранения.
   */
  private handleSave(event: MouseEvent): void {
    if (this.isDisable) return;
    const target = event.target as HTMLButtonElement;
    target.innerText = 'Saving image...';
    target.classList.add('disabled');
    setTimeout(() => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.width = this.preview.naturalWidth;
      canvas.height = this.preview.naturalHeight;
      ctx.filter = `brightness(${this.options.brightness}%) saturate(${this.options.saturation}%) invert(${this.options.inversion}%) grayscale(${this.options.grayscale}%)`;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      if (this.options.rotate !== 0) {
        ctx.rotate(this.options.rotate * Math.PI / 180);
      }
      ctx.scale(this.options.flipHorizontal, this.options.flipVertical);
      ctx.drawImage(this.preview, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
      const link = document.createElement('a');
      if (typeof this.imgName === 'string') {
        link.download = this.imgName;
      }
      link.href = canvas.toDataURL();
      link.click();
      target.innerText = 'Save Image';
      target.classList.remove('disabled');
    });
  }
}

// Создаем экземпляр класса ImageEditor при загрузке страницы.
new ImageEditor();
