import './style.scss';

/**
 * Класс PriceSlider представляет собой слайдер цен, который позволяет пользователю выбирать диапазон цен.
 */
class PriceSlider {
  private inputRange: NodeListOf<HTMLInputElement>;
  private inputPrice: NodeListOf<HTMLInputElement>;
  private progress: HTMLDivElement;
  private priceGap: number = 1000;

  /**
   * Создает экземпляр класса PriceSlider и инициализирует его.
   * @constructor
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует слайдер, создавая необходимые DOM-элементы и устанавливая обработчики событий.
   * @private
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает DOM-элементы для слайдера и вставляет их в корневой элемент с идентификатором 'app'.
   * @private
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='bg-white border shadow rounded max-w-md w-full p-3 grid gap-4 price-slider'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Price Slider</h1>
        <p>Use slider or enter min and max price</p>
        <div>
          <label class='grid gap-2'>
            <span>Min</span>
            <input class='px-3 py-2 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50' type='number' data-price='min' value='1800'>
          </label>
          <span class='separator'></span>
          <label class='grid gap-2'>
            <span>Max</span>
            <input class='px-3 py-2 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50' type='number' data-price='max' value='7800'>
          </label>
        </div>
        <div class='slider'>
          <div class='slider__progress' data-progress=''></div>
        </div>
        <div class='ranges'>
          <input class='ranges__input' type='range' data-range-price='min' min='0' max='10000' value='1800' step='100'>
          <input class='ranges__input' type='range' data-range-price='max' min='0' max='10000' value='7800' step='100'>
        </div>
      </div>
    `;

    this.inputRange = root.querySelectorAll('[data-range-price]')!;
    this.inputPrice = root.querySelectorAll('[data-price]')!;
    this.progress = root.querySelector('[data-progress]')!;
  }

  /**
   * Устанавливает обработчики событий для элементов слайдера.
   * @private
   */
  private setupEventListeners(): void {
    this.inputRange.forEach(range => range.addEventListener('input', this.handleRange.bind(this)));
    this.inputPrice.forEach(range => range.addEventListener('input', this.handlePrice.bind(this)));
  }

  /**
   * Обработчик события изменения значения ползунка слайдера.
   * @param {Event} event - Событие изменения значения ползунка.
   * @private
   */
  private handleRange({ target: { dataset: { rangePrice } } }: { target: { dataset: { rangePrice: string } } }) {
    const minVal = parseInt(this.inputRange[0].value);
    const maxVal = parseInt(this.inputRange[1].value);

    if (maxVal - minVal < this.priceGap) {
      if (rangePrice === 'min') {
        this.inputRange[0].value = String(maxVal - this.priceGap);
      } else {
        this.inputRange[1].value = String(minVal + this.priceGap);
      }
    } else {
      this.inputPrice[0].value = String(minVal);
      this.inputPrice[1].value = String(maxVal);
      this.progress.style.left = (minVal / Number(this.inputRange[0].max)) * 100 + '%';
      this.progress.style.right = 100 - (maxVal / Number(this.inputRange[1].max)) * 100 + '%';
    }
  }

  /**
   * Обработчик события изменения значений минимальной и максимальной цен.
   * @param {Event} event - Событие изменения значений цен.
   * @private
   */
  private handlePrice({ target: { dataset: { price } } }: { target: { dataset: { price: string } } }) {
    const minVal = parseInt(this.inputPrice[0].value);
    const maxVal = parseInt(this.inputPrice[1].value);

    if ((maxVal - minVal >= this.priceGap) && maxVal <= 10000) {
      if (price === 'min') {
        this.inputRange[0].value = String(minVal);
        this.progress.style.left = (minVal / Number(this.inputRange[0].max)) * 100 + '%';
      } else {
        this.inputRange[1].value = String(maxVal);
        this.progress.style.right = 100 - (maxVal / Number(this.inputRange[1].max)) * 100 + '%';
      }
    }
  }

}

new PriceSlider();
