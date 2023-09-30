import '../style.scss';
import feather from 'feather-icons';

/**
 * Класс ImageSlider представляет интерактивный слайдер изображений на веб-странице.
 */
export class ImageSlider {
  /**
   * Индекс текущего слайда.
   * @type {number}
   */
  private slideIndex: number = 1;

  /**
   * Флаг, указывающий, происходит ли анимация перемещения слайдов.
   * @type {boolean}
   */
  private isMoving: boolean = false;

  /**
   * Ссылка на элемент слайдера.
   * @type {HTMLUListElement}
   */
  private slider: HTMLUListElement;

  /**
   * Коллекция кнопок навигации.
   * @type {NodeListOf<HTMLButtonElement>}
   */
  private nav: NodeListOf<HTMLButtonElement>;

  /**
   * Создает экземпляр класса ImageSlider и вызывает метод инициализации.
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализация класса ImageSlider, создание DOM-элементов и установка обработчиков событий.
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает необходимые DOM-элементы для слайдера и вставляет их в DOM.
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;
    const div = document.createElement('div');
    div.className = 'image-slider grid p-3 gap-3';

    div.innerHTML = `
        <h2 class='font-bold text-4xl'>Image Slider</h2>
          <div class='progress'></div>
          <ul class='nav'>
            <button data-nav='prev'>${feather.icons['arrow-left'].toSvg()}</button>
            <button data-nav='next'>${feather.icons['arrow-right'].toSvg()}</button>
          </ul>
          <ul class='slides' data-slides></ul>
    `;
    root.append(div);
    this.slider = root.querySelector('.image-slider [data-slides]')!;
    this.nav = root.querySelectorAll('.image-slider [data-nav]')!;
  }

  /**
   * Устанавливает обработчики событий для кнопок навигации, события `transitionend` и клавиатурных событий.
   */
  private setupEventListeners(): void {
    this.initSlider();
    this.nav.forEach(btn => btn.addEventListener('click', this.moveSlider.bind(this)));
    this.slider.addEventListener('transitionend', this.handleSlideChange.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  /**
   * Инициализирует слайдер, создавая DOM-структуру слайдов и отображая их.
   */
  private async initSlider(): Promise<void> {
    const data = Array.from({ length: 6 }, (v, i) => i + 1);
    data.push(data[0]);
    data.unshift(data[data.length - 2]);
    this.slider.innerHTML = `${data.map((i) => `<li><img src='https://via.placeholder.com/400/${['ea7070', 'fdc4b6', 'e59572', '2694ab', '9dd3a8', 'd9d9f3'][Math.floor(Math.random() * ['#ea7070', '#fdc4b6', '#e59572', '#2694ab', '#9dd3a8', '#d9d9f3'].length)]}/333333/?text=Image ${i}' alt=''></li>`).join('')}`;
    this.moveSlides();
  }


  private moveSlides(): void {
    const root = document.querySelector('.image-slider')!;
    this.slider.style.transform = `translateX(-${this.slideIndex * 100}%)`;
    const slidesArray = [...this.slider.querySelectorAll('img')];
    root.setProperty('--slide-progress', `${(100 / (slidesArray.length - 3)) * (this.slideIndex - 1)}%`);
  }

  /**
   * Перемещает слайды в соответствии с текущим индексом слайда.
   */
  private handleSlideChange(): void {
    const root = document.querySelector('.image-slider')!;
    const slidesArray = [...this.slider.querySelectorAll('img')];
    this.isMoving = false;
    root.style.setProperty('--slide-progress--transition', `${this.slideIndex === slidesArray.length - 1 ? 'none' : 'all 400ms cubic-bezier(0.82, 0.02, 0.39, 1.01)'}`);

    if (this.slideIndex === 0) this.slideIndex = slidesArray.length - 2;
    if (this.slideIndex === slidesArray.length - 1) this.slideIndex = 1;
    this.slider.style.transition = 'none';
    this.moveSlides();
  }

  /**
   * Обрабатывает событие `transitionend`, управляет логикой перемещения слайдов и анимацией.
   */
  private handleKeyUp({ key }: { key: string }): void {
    if (this.isMoving) return;
    switch (key) {
      case 'ArrowLeft':
        this.moveHandler();
        break;
      case 'ArrowRight':
        this.moveHandler('next');
        break;
      default:
        break;
    }
  }

  /**
   * Обрабатывает нажатие кнопок навигации "предыдущий" и "следующий" слайд.
   * @param {object} event - Объект события нажатия кнопки навигации.
   */
  private moveSlider({ target: { dataset: { nav } } }: { target: { dataset: { nav: string } } }): void {
    switch (nav) {
      case 'next':
        if (this.isMoving) return;
        this.moveHandler(nav);
        break;
      case 'prev':
        if (this.isMoving) return;
        this.moveHandler();
        break;
      default:
        break;
    }
  }

  /**
   * Обрабатывает перемещение слайдов и управление анимацией.
   * @param {string} direction - Направление перемещения слайдов ('prev' для предыдущего, 'next' для следующего).
   */
  private moveHandler(direction?: string): void {
    this.isMoving = true;
    this.slider.style.transition = `transform 450ms ease-in-out`;
    direction !== 'next' ? (this.slideIndex -= 1) : (this.slideIndex += 1);
    this.moveSlides();
  }

}
