import starRatingEsm from 'star-rating.js';
/**
 * @typedef {object} MockItem - Структура данных элемента макета.
 * @property {string} name - Название рейтинга.
 * @property {number} value - Значение рейтинга.
 */

/**
 * @type {MockItem[]} mock - Список рейтингов.
 */
const mock: {
  name: string,
  value: number,
}[] = [
  {
    name: 'Excellent',
    value: 5,
  },
  {
    name: 'Very Good',
    value: 4,
  },
  {
    name: 'Average',
    value: 3,
  },
  {
    name: 'Poor',
    value: 2,
  },
  {
    name: 'Terrible',
    value: 1,
  },
];

/**
 * Класс StarRatings02 - компонент для отображения рейтингов.
 */
export class StarRatings02 {
  /**
   * Создает экземпляр класса StarRatings02.
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
    div.className = 'rating02';
    div.innerHTML = `
       <h4 class='font-bold text-lg'>Component #2 <br> (star-rating.js)</h4>
        <select data-lib-rating>
          <option value>Select a rating</option>
          ${mock.map(({ name, value }) => `<option value='${value}'>${name}</option>`).join('')}
        </select>

        <h4 class='font-bold text-lg'>Component #3 <br>(Custom Star Ratings)</h4>
        <div>${Array.from({ length: 5 }).map(i => `<i data-star class='fa-regular fa-star'></i>`).join('')}</div>
        <span data-result></span>
    `;
    root.append(div);
  }

  /**
   * Устанавливает обработчики событий.
   */
  private setupEventListeners(): void {
    new starRatingEsm('[data-lib-rating]');
    this.customRating();
  }

  /**
   * Оценка рейтинга пользовательским способом.
   */
  private customRating(): void {
    const ratingStars = [...document.querySelectorAll('.rating02 [data-star]')];
    const ratingResult = document.querySelector('.rating02 [data-result]');

    const printRatingResult = (result, num = 0) => result.textContent = `${num}/5`;
    const executeRating = (stars, result) => {
      const starClassActive = 'fa-solid fa-star';
      const starClassUnactive = 'fa-regular fa-star';
      const starsLength = stars.length;
      let i;
      stars.map((star) => {
        star.addEventListener('click', () => {
          i = stars.indexOf(star);
          if (star.className.indexOf(starClassUnactive) !== -1) {
            printRatingResult(result, i + 1);
            for (i; i >= 0; --i) stars[i].className = starClassActive;
          } else {
            printRatingResult(result, i);
            for (i; i < starsLength; ++i) stars[i].className = starClassUnactive;
          }
        });
      });
    };

    printRatingResult(ratingResult);
    executeRating(ratingStars, ratingResult);
  };
}
