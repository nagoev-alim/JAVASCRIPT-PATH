import '../style.scss';
import feather from 'feather-icons';
import { toast } from '../utils/toast.ts';
import axios from 'axios';
import { getRandomNumber } from '../utils/getRandomNumber.ts';

/**
 * Класс ReviewSlider представляет интерактивный слайдер отзывов на веб-странице.
 */
export class ReviewSlider {
  /**
   * Массив отзывов.
   * @type {object[] | null}
   */
  private reviews = null;

  /**
   * Индекс текущего слайда.
   * @type {number}
   */
  private slideIndex: number = 0;

  /**
   * URL для загрузки отзывов.
   * @type {string}
   */
  private readonly URL: string = 'https://jsonplaceholder.typicode.com/users?_start=0&_limit=5';

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
   * Создает экземпляр класса ReviewSlider и вызывает инициализацию.
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализация класса ReviewSlider, создание DOM-элементов и установка обработчиков событий.
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает необходимые DOM-элементы для слайдера.
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;
    const div = document.createElement('div');
    div.className = 'review-slider p-3 gap-3';
    div.innerHTML = `
        <h2 class='font-bold text-4xl'>Review Slider</h2>
        <div class='header'>
          <h3 class='font-bold text-xl'>What Our Clients Say</h3>
          <p>We partner with some pretty amazing people! Here’s what they say about us.</p>
        </div>
        <div class='body'>
          <ul class='nav'>
            <button class='px-3 py-2 border hover:bg-slate-50' data-nav='prev'>${feather.icons['arrow-left'].toSvg()}</button>
            <button class='px-3 py-2 border hover:bg-slate-50' data-nav='next'>${feather.icons['arrow-right'].toSvg()}</button>
          </ul>
          <ul class='slides' data-slides></ul>
        </div>
    `;
    root.append(div);
    this.slider = root.querySelector('.review-slider [data-slides]')!;
    this.nav = root.querySelectorAll('.review-slider [data-nav]')!;
  }

  /**
   * Устанавливает обработчики событий для кнопок навигации.
   */
  private setupEventListeners(): void {
    this.initSlider();
    this.nav.forEach(btn => btn.addEventListener('click', this.moveSlider.bind(this)));
  }

  /**
   * Инициализирует слайдер, загружая отзывы с сервера.
   */
  private async initSlider() {
    try {
      const { data } = await axios.get(this.URL);
      if (data.length === 0) {
        toast('Something went wrong, open developer console', 'error');
        return;
      }
      this.reviews = data;
      this.slider.innerHTML = `
      ${this.reviews?.map(({ id, name, address: { street, city } }) => `
        <li class='place-content-center gap-2'>
          <img class='rounded-full overflow-hidden' src='https://randomuser.me/api/portraits/men/${id}.jpg' alt='${name}'>
          <h3 class='font-bold'>${name}</h3>
          <p>${street}, ${city}</p>
          <p class='flex gap-2'>${Array.from({ length: getRandomNumber(1, 5) }).map(() => feather.icons.star.toSvg()).join('')}</p>
          <p>doloribus at sed quis culpa deserunt consectetur qui praesentium accusamus fugiat dicta voluptatem rerum ut voluptate autem voluptatem repellendus aspernatur dolorem in</p>
        </li>
      `).join('')}
      `;
    } catch (e) {
      toast('Something went wrong, open developer console', 'error');
      console.log(e);
    }
  }

  /**
   * Обрабатывает движение слайдера.
   * @param {object} event - Событие клика на кнопке навигации.
   */
  private moveSlider({ target: { dataset: { nav } } }: { target: { dataset: { nav: string } } }) {
    switch (nav) {
      case 'next':
        this.slideIndex === this.reviews?.length - 1 ? this.slideIndex = 0 : this.slideIndex++;
        break;
      case 'prev':
        this.slideIndex === 0 ? this.slideIndex = this.reviews?.length - 1 : this.slideIndex--;
        break;
      default:
        break;
    }
    this.slider.style.transform = `translate(${-100 * this.slideIndex}%)`;
  }
}
