import './style.scss';

/**
 * Класс MemoryGame01 представляет собой игру "Память" с карточками.
 */
class MemoryGame01 {
  /**
   * @private
   * @type {NodeListOf<HTMLLIElement>}
   * Список всех карточек на игровом поле.
   */
  private cards: NodeListOf<HTMLLIElement>;
  /**
   * @private
   * @type {number}
   * Количество совпавших пар карточек.
   */
  private matched: number = 0;
  /**
   * @private
   * @type {HTMLLIElement | string}
   * Первая выбранная карточка.
   */
  private cardOne: HTMLLIElement | string = '';

  /**
   * @private
   * @type {HTMLLIElement | string}
   * Вторая выбранная карточка.
   */
  private cardTwo: HTMLLIElement | string = '';

  /**
   * @private
   * @type {boolean}
   * Флаг блокировки кликов по карточкам.
   */
  private disableDeck: boolean = false;

  /**
   * Конструктор класса MemoryGame01.
   * Вызывает метод initialize() для начала игры.
   */
  constructor() {
    this.initialize();
  }

  /**
   * @private
   * Метод инициализации игры. Создает игровое поле и устанавливает обработчики событий.
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * @private
   * Метод создания игрового поля в DOM.
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;
    const div = document.createElement('div');
    div.className = 'bg-white border shadow rounded max-w-lg w-full p-3 grid gap-4 game-1 mx-auto';
    div.innerHTML = `
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Memory Card Game</h1>
        <ul class='grid grid-cols-4'>
          ${Array.from({ length: 8 }).map((_, idx) => `
          <li>
            <div class='view front'>
              <img src='picture.png' alt='icon'>
            </div>
            <div class='view back'>
              <img src='img-${idx + 1}.png' alt='card-img'>
            </div>
          </li>
          `).join('')}

          ${Array.from({ length: 8 }).map((_, idx) => `
          <li>
            <div class='view front'>
              <img src='picture.png' alt='icon'>
            </div>
            <div class='view back'>
              <img src='img-${idx + 1}.png' alt='card-img'>
            </div>
          </li>
          `).join('')}
        </ul>
    `;
    root.append(div);
    this.cards = root.querySelectorAll(`.game-1 li`)!;

  }

  /**
   * @private
   * Метод устанавливает обработчики событий для карточек и запускает перемешивание.
   */
  private setupEventListeners(): void {
    this.shuffle();
    this.cards.forEach(card => card.addEventListener('click', this.flip.bind(this)));
  }

  /**
   * @private
   * Метод перемешивает карточки и сбрасывает состояние игры.
   */
  private shuffle(): void {
    this.matched = 0;
    this.disableDeck = false;
    this.cardOne = this.cardTwo = '';
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8].sort(() => Math.random() > 0.5 ? 1 : -1);
    this.cards.forEach((card, i) => {
      card.classList.remove('flip');
      card.querySelector('.back img')!.src = `img-${array[i]}.png`;
      card.addEventListener('click', this.flip);
    });
  }

  /**
   * @private
   * Метод обработки клика по карточке.
   * @param {MouseEvent} event - Событие клика.
   */
  private flip(event: MouseEvent): HTMLLIElement | void {
    const clickedCard = event.target as HTMLLIElement;
    if (this.cardOne !== clickedCard && !this.disableDeck) {
      clickedCard.classList.add('flip');
      if (!this.cardOne) {
        return this.cardOne = clickedCard;
      }
      this.cardTwo = clickedCard;
      this.disableDeck = true;
      this.matchCards(this.cardOne.querySelector('.back img')!.src, this.cardTwo.querySelector('.back img')!.src);
    }
  }

  /**
   * @private
   * Метод сравнивает пару карточек на совпадение.
   * @param {string} img1 - Ссылка на изображение первой карточки.
   * @param {string} img2 - Ссылка на изображение второй карточки.
   */
  private matchCards(img1: string, img2: string): false | undefined {
    if (img1 === img2) {
      this.matched++;
      if (this.matched === 8) {
        setTimeout(() => {
          return this.shuffle();
        }, 1000);
      }
      this.cardOne.removeEventListener('click', this.flip);
      this.cardTwo.removeEventListener('click', this.flip);
      this.cardOne = this.cardTwo = '';
      return this.disableDeck = false;
    }
    setTimeout(() => {
      this.cardOne.classList.add('shake');
      this.cardTwo.classList.add('shake');
    }, 400);
    setTimeout(() => {
      this.cardOne.classList.remove('shake', 'flip');
      this.cardTwo.classList.remove('shake', 'flip');
      this.cardOne = this.cardTwo = '';
      this.disableDeck = false;
    }, 1200);
  }
}

/**
 * Класс MemoryGame02 представляет собой игру "Память" с карточками и таймером.
 */
class MemoryGame02 {
  /**
   * @private
   * @type {NodeListOf<HTMLLIElement>}
   * Список всех карточек на игровом поле.
   */
  private cards: NodeListOf<HTMLLIElement>;

  /**
   * @private
   * @type {HTMLSpanElement}
   * Элемент, отображающий оставшееся время.
   */
  private timeEl: HTMLSpanElement;

  /**
   * @private
   * @type {HTMLSpanElement}
   * Элемент, отображающий количество попыток (флипов).
   */
  private flipEl: HTMLSpanElement;

  /**
   * @private
   * @type {HTMLButtonElement}
   * Кнопка для перезапуска игры.
   */
  private refreshBtn: HTMLButtonElement;

  /**
   * @private
   * @type {number}
   * Максимальное время игры в секундах.
   */
  private maxTime: number = 20;

  /**
   * @private
   * @type {number}
   * Оставшееся время игры в секундах.
   */
  private timeLeft: number = 20;

  /**
   * @private
   * @type {number}
   * Количество совершенных попыток (флипов).
   */
  private flips: number = 0;

  /**
   * @private
   * @type {number}
   * Количество совпавших пар карточек.
   */
  private matchedCard: number = 0;

  /**
   * @private
   * @type {boolean}
   * Флаг блокировки кликов по карточкам.
   */
  private disableDeck: boolean = false;

  /**
   * @private
   * @type {boolean}
   * Флаг активности игры.
   */
  private isPlaying: boolean = false;

  /**
   * @private
   * @type {HTMLLIElement | string}
   * Первая выбранная карточка.
   */
  private cardOne: HTMLLIElement | string = '';

  /**
   * @private
   * @type {HTMLLIElement | string}
   * Вторая выбранная карточка.
   */
  private cardTwo: HTMLLIElement | string = '';

  /**
   * @private
   * @type {number | null}
   * Идентификатор таймера.
   */
  private timer: number | null;

  /**
   * Конструктор класса MemoryGame02.
   * Вызывает метод initialize() для начала игры.
   */
  constructor() {
    this.initialize();
  }

  /**
   * @private
   * Метод инициализации игры. Создает игровое поле и устанавливает обработчики событий.
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * @private
   * Метод создания игрового поля в DOM.
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;
    const div = document.createElement('div');
    div.className = 'bg-white border shadow rounded max-w-lg w-full p-3 grid gap-4 game-2 mx-auto';
    div.innerHTML = `
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Memory Card Game</h1>
        <ul>
          ${Array.from({ length: 6 }).map((_, idx) => `
          <li>
            <div class='view front'>
              <img src='picture.png' alt='icon'>
            </div>
            <div class='view back'>
              <img src='img-${idx + 1}.png' alt='card-img'>
            </div>
          </li>
          `).join('')}

          ${Array.from({ length: 6 }).map((_, idx) => `
          <li>
            <div class='view front'>
              <img src='picture.png' alt='icon'>
            </div>
            <div class='view back'>
              <img src='img-${idx + 1}.png' alt='card-img'>
            </div>
          </li>
          `).join('')}
        </ul>

        <div class='grid sm:grid-cols-3 sm:items-center'>
          <p class='time font-medium'>Time: <span class='font-bold' data-time>0s</span></p>
          <p class='flips font-medium'>Flips: <span class='font-bold' data-flip>3</span></p>
          <button class='px-3 py-2 border hover:bg-slate-50' data-refresh>Refresh</button>
        </div>
    `;
    root.append(div);
    this.cards = root.querySelectorAll(`.game-2 li`)!;
    this.timeEl = root.querySelector('[data-time]')!;
    this.flipEl = root.querySelector('[data-flip]')!;
    this.refreshBtn = root.querySelector('[data-refresh]')!;
  }

  /**
   * @private
   * Метод устанавливает обработчики событий для кнопки обновления и карточек, а также запускает перемешивание.
   */
  private setupEventListeners(): void {
    this.shuffle();
    this.refreshBtn.addEventListener('click', this.shuffle.bind(this));
    this.cards.forEach(c => c.addEventListener('click', this.flip.bind(this)));
  }

  /**
   * @private
   * Метод перемешивает карточки и сбрасывает состояние игры.
   */
  private shuffle(): void {
    this.timeLeft = this.maxTime;
    this.flips = this.matchedCard = 0;
    this.cardOne = this.cardTwo = '';
    clearInterval(this.timer);
    this.timeEl.innerText = String(this.timeLeft);
    this.flipEl.innerText = String(this.flips);
    this.disableDeck = this.isPlaying = false;
    const array = [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6].sort(() => Math.random() > 0.5 ? 1 : -1);
    this.cards.forEach((card, i) => {
      card.classList.remove('flip');
      setTimeout(() => {
        card.querySelector('.back img')!.src = `img-${array[i]}.png`;
      }, 500);
      card.addEventListener('click', this.flip);
    });
  }

  /**
   * @private
   * Метод обработки клика по карточке.
   * @param {MouseEvent} event - Событие клика.
   * @returns {HTMLLIElement | void} - Выбранная карточка или ничего.
   */
  private flip(event: MouseEvent): HTMLLIElement | void {
    const clickedCard = event.target as HTMLLIElement;
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.timer = setInterval(this.initTimer.bind(this), 1000);
    }
    if (clickedCard !== this.cardOne && !this.disableDeck && this.timeLeft > 0) {
      this.flips++;
      this.flipEl.innerText = String(this.flips);
      clickedCard.classList.add('flip');
      if (!this.cardOne) {
        return this.cardOne = clickedCard;
      }
      this.cardTwo = clickedCard;
      this.disableDeck = true;
      this.matchCards(this.cardOne.querySelector('.back img')!.src, this.cardTwo.querySelector('.back img')!.src);
    }
  }

  /**
   * @private
   * Метод сравнивает две карточки на совпадение.
   * @param {string} img1 - Ссылка на изображение первой карточки.
   * @param {string} img2 - Ссылка на изображение второй карточки.
   */
  private matchCards(img1: string, img2: string): false | void {
    if (img1 === img2) {
      this.matchedCard++;
      if (this.matchedCard === 6 && this.timeLeft > 0) {
        return clearInterval(this.timer);
      }
      this.cardOne.removeEventListener('click', this.flip);
      this.cardTwo.removeEventListener('click', this.flip);
      this.cardOne = this.cardTwo = '';
      return this.disableDeck = false;
    }
    setTimeout(() => {
      this.cardOne.classList.add('shake');
      this.cardTwo.classList.add('shake');
    }, 400);
    setTimeout(() => {
      this.cardOne.classList.remove('shake', 'flip');
      this.cardTwo.classList.remove('shake', 'flip');
      this.cardOne = this.cardTwo = '';
      this.disableDeck = false;
    }, 1200);
  }

  /**
   * @private
   * Метод инициализирует таймер обратного отсчета.
   */
  private initTimer(): void {
    if (this.timeLeft <= 0) {
      return clearInterval(this.timer);
    }
    this.timeLeft--;
    this.timeEl.innerText = String(this.timeLeft);
  }
}

// Создаем экземпляр игры.
new MemoryGame01();
// Создаем экземпляр игры.
new MemoryGame02();
