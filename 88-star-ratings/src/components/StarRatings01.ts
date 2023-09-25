import { toast } from '../utils/toast.ts';

/**
 * @typedef {object} MockItem - Структура данных элемента макета.
 * @property {string} name - Название продукта.
 * @property {string} value - Значение продукта.
 */

/**
 * @type {MockItem[]} mock - Список продуктов.
 */
const mock: {
  name: string,
  value: string,
}[] = [
  {
    name: 'sony',
    value: 'Sony 4K TV',
  },
  {
    name: 'samsung',
    value: 'Samsung 4K TV',
  },
  {
    name: 'vizio',
    value: 'Vizio 4K TV',
  },
  {
    name: 'panasonic',
    value: 'Panasonic 4K TV',
  },
  {
    name: 'phillips',
    value: 'Phillips 4K TV',
  },
];
/**
 * Класс StarRatings01 - компонент для оценки продуктов.
 */
export class StarRatings01 {
  /**
   * @type {HTMLSelectElement} selectInput - Выбор продукта.
   */
  private selectInput: HTMLSelectElement;

  /**
   * @type {HTMLInputElement} numberInput - Ввод оценки продукта.
   */
  private numberInput: HTMLInputElement;

  /**
   * @type {Record<string, number>} ratings - Оценки продуктов.
   */
  private ratings: Record<string, number> = {
    sony: 3.1,
    samsung: 2.4,
    vizio: 3.3,
    panasonic: 4.6,
    phillips: 1.1,
  };

  /**
   * @type {number} starsTotal - Максимальное количество звезд.
   */
  private starsTotal: number = 5;

  /**
   * @type {string | null} product - Текущий выбранный продукт.
   */
  private product: string | null = null;

  /**
   * Создает экземпляр класса StarRatings01.
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует компонент.
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает структуру DOM для компонента.
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;
    const div = document.createElement('div');
    div.className = 'rating01'
    div.innerHTML = `
        <header>
          <h4 class='font-bold text-lg'>Component #1</h4>
          <select class='px-3 py-2 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50' data-select>
            <option value='0' disabled selected>Select Product</option>
            ${mock.map(({ name, value }) => `<option value='${name}'>${value}</option>`).join('')}
          </select>
          <input class='px-3 py-2 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50' type='number' step='0.1' max='5' placeholder='Rate 1 - 5' data-number disabled>
        </header>

        <table class='table'>
          <thead>
            <tr>
              <th>4K Television</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
          ${mock.map(({ name, value }) => `
            <tr data-name='${name}'>
              <td>${value}</td>
              <td>
                <div class='stars-outer'>
                  <div class='stars-inner'></div>
                </div>
                <span class='number-rating'></span>
              </td>
            </tr>
            `).join('')}
          </tbody>
        </table>
    `;
    root.append(div)
    this.selectInput = div.querySelector('.rating01 [data-select]')!;
    this.numberInput = div.querySelector('.rating01 [data-number]')!;
  }
  /**
   * Устанавливает обработчики событий.
   */
  private setupEventListeners(): void {
    this.getRatings();
    this.selectInput.addEventListener('change', this.handleSelect.bind(this));
    this.numberInput.addEventListener('blur', this.handleNumber.bind(this));
  }
  /**
   * Получает и отображает оценки продуктов.
   */
  private getRatings():void {
    for (let rating in this.ratings) {
      const starPercentage = (this.ratings[rating] / this.starsTotal) * 100;
      document.querySelector(`[data-name="${rating}"] .stars-inner`)!.style.width = `${Math.round(starPercentage / 10) * 10}%`;
      document.querySelector(`[data-name="${rating}"] .number-rating`)!.innerHTML = this.ratings[rating];
    }
  }
  /**
   * Обрабатывает выбор продукта.
   *
   * @param {Event} event - Событие выбора.
   */
  private handleSelect({ target: { value } }: { target: { value: string } }):void {
    this.product = value;
    this.numberInput.disabled = false;
    this.numberInput.value = this.ratings[this.product].toString();
  }
  /**
   * Обрабатывает ввод оценки продукта.
   *
   * @param {Event} event - Событие ввода.
   */
  private handleNumber({ target: { value } }: { target: { value: string } }):void {
    if (parseInt(value) > 5) {
      toast('Please rate 1 - 5', 'warning');
      return;
    }
    this.ratings[this.product] = value;
    this.getRatings();
  }
}
