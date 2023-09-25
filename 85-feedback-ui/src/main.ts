import './style.scss';
import { icons } from 'feather-icons';
import { toast } from './utils/toast.ts';
import axios from 'axios';

/**
 * Интерфейс для объекта Review.
 * @typedef {Object} Review
 * @property {string} id - Идентификатор отзыва.
 * @property {string} rating - Рейтинг отзыва.
 * @property {string} review - Текст отзыва.
 */
interface Review {
  id: string;
  rating: string;
  review: string;
}

/**
 * Класс Feedback представляет веб-приложение для управления отзывами.
 */
class Feedback {
  /** @type {Review[]} */
  private reviews = []; // Массив отзывов
  /** @type {string} */
  private readonly URL: string = 'https://63c83f46e52516043f4ee625.mockapi.io/reviews'; // URL для загрузки/сохранения отзывов
  /** @type {HTMLFormElement} */
  private form; // Форма для отправки отзывов
  /** @type {HTMLUListElement} */
  private reviewsEl; // Список отзывов
  /** @type {HTMLDivElement} */
  private loader; // Прелоадер
  /** @type {HTMLParagraphElement} */
  private reviewCount; // Элемент, отображающий количество отзывов
  /** @type {HTMLParagraphElement} */
  private average; // Элемент, отображающий средний рейтинг
  /** @type {boolean} */
  private isEdit: boolean = false; // Флаг редактирования отзыва
  /** @type {Review | undefined} */
  private editItem: Review | undefined; // Редактируемый отзыв

  /**
   * Создает экземпляр класса Feedback и вызывает метод инициализации.
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализация класса Feedback, создание DOM-элементов и установка обработчиков событий.
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает необходимые DOM-элементы для приложения и вставляет их в DOM.
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='grid gap-4'>
        <header class='shadow p-2 sm:p-4 bg-white flex justify-center'>
          <h1 class='font-bold text-2xl'>Feedback UI</h1>
        </header>
        <main class='max-w-3xl w-full mx-auto grid gap-7 p-3'>
          <form class='grid gap-4 bg-white rounded-md border p-5' data-form>
            <h3 class='text-center font-medium text-lg'>How would you rate your service with us?</h3>
            <ul class='flex flex-wrap gap-2 items-center justify-center'>
              ${Array.from({ length: 10 }).map((n, i) => i + 1).map(number => `
                <li>
                  <label>
                    <input class='visually-hidden' type='radio' name='rating' value='${number}'>
                     <span class='font-bold text-lg w-[55px] h-[55px] flex justify-center items-center rounded-full bg-gray-300 hover:bg-neutral-900 hover:text-white cursor-pointer transition-colors '>${number}</span>
                  </label>
                </li>
              `).join('')}
            </ul>
            <div class='grid gap-2 grid-cols-[1fr_auto]'>
              <input class='px-3 py-2 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50' type='text' name='review' placeholder='Write a review'>
              <button class='px-3 py-2 border hover:bg-slate-50' type='submit'>Send</button>
            </div>
          </form>

          <div class='flex gap-3 justify-between flex-wrap'>
            <p class='font-medium' data-review-count>3 reviews</p>
            <p class='font-medium' data-average>Average Rating: 9.3</p>
          </div>

          <div data-loader class='loader'>
            <div class='dot-wave'>
              <div class='dot-wave__dot'></div>
              <div class='dot-wave__dot'></div>
              <div class='dot-wave__dot'></div>
              <div class='dot-wave__dot'></div>
            </div>
          </div>

          <ul class='grid gap-3 hidden' data-reviews></ul>
        </main>
      </div>
    `;
    this.form = root.querySelector('[data-form]')!;
    this.reviewsEl = root.querySelector('[data-reviews]')!;
    this.loader = root.querySelector('[data-loader]')!;
    this.reviewCount = root.querySelector('[data-review-count]')!;
    this.average = root.querySelector('[data-average]')!;
  }

  /**
   * Устанавливает обработчики событий для формы и списка отзывов.
   */
  private setupEventListeners(): void {
    this.fetchData();
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    this.reviewsEl.addEventListener('click', this.handleClick.bind(this));
  }

  /**
   * Выполняет загрузку данных с сервера и отображает их в приложении.
   */
  private async fetchData(): Promise<void> {
    this.loader.classList.remove('hidden');
    try {
      const { data } = await axios.get<Review[]>(this.URL);
      this.reviews = data;
      this.renderHTML(this.reviews);
      this.loader.classList.add('hidden');
    } catch (e) {
      this.loader.classList.add('hidden');
      toast('Something went wrong, open developer console.', 'error');
      console.log(e);
    }
  }

  /**
   * Отображает данные в интерфейсе приложения.
   * @param {Review[]} data - Массив отзывов для отображения.
   */
  private renderHTML(data: Review[]): void {
    this.reviewsEl.innerHTML = ``;
    this.reviewsEl.classList.remove('hidden');
    for (const { review, rating, id } of data) {
      const li = document.createElement('li');
      li.className = 'grid gap-3 relative bg-white rounded-md border p-3 pt-7 px-8 min-h-[100px]';
      li.innerHTML = `
        <div class='absolute -left-[22.5px] -top-[22.5px] translatex-x-1/2 translatex-y-1/2 w-[55px] h-[55px] rounded-full flex justify-center items-center bg-neutral-900 text-white font-bold'>${rating}</div>
        <p class='break-all'>${review}</p>
        <div class='absolute flex gap-2 right-2 top-2'>
          <button data-edit='${id}'>${icons.edit.toSvg({ color: '#41b6e6' })}</button>
          <button data-delete='${id}'>${icons.x.toSvg({ color: '#ff585d' })}</button>
        </div>`;
      this.reviewsEl.append(li);
    }
    const average =
      data.length === 0
        ? 0
        : data.reduce((acc, { rating }) => acc + parseInt(rating), 0) / data.length;
    this.reviewCount.innerHTML = `${data.length} reviews`;
    this.average.innerHTML = `Average Rating: ${average.toFixed(1).replace(/[.,]0$/, '')}`;
  }

  /**
   * Обрабатывает отправку формы для создания или обновления отзыва.
   * @param {Event} event - Объект события отправки формы.
   */
  private async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const rating = formData.get('rating') as string;
    const review = formData.get('review') as string;
    if (review.trim().length === 0 || !rating) {
      toast('Please fill the fields', 'warning');
      return;
    }
    if (review.trim().length < 10) {
      toast('Review must be at least 10 character', 'warning');
      return;
    }
    try {
      if (this.isEdit) {
        const { status, statusText } = await axios.post(this.URL, { rating, review });
        if (status !== 201 || statusText !== 'Created') {
          toast('Something went wrong, open developer console', 'error');
          return;
        }
        await this.fetchData();
        toast('Review successfully added', 'success');
      } else {
        const { status } = await axios.put(`${this.URL}/${this.editItem!.id}`, { rating, review });
        if (status !== 200) {
          toast('Something went wrong, open developer console', 'error');
          return;
        }
        this.reviews = this.reviews.map(i => i.id === this.editItem!.id ? { ...i, rating, review } : i);
        this.renderHTML(this.reviews);
        toast('Review successfully updated', 'success');
        this.form.querySelector('.cancel')!.remove();
        this.form.querySelector('button')!.textContent = 'Submit';
      }
    } catch (e) {
      toast('Something went wrong, open developer console', 'error');
      console.log(e);
    }
    form.reset();
  }

  /**
   * Обрабатывает клики на кнопках "Удалить" и "Редактировать" отзыва.
   * @param {MouseEvent} event - Объект события клика мыши.
   */
  private async handleClick(event: MouseEvent): Promise<void> {
    const target = event.target as HTMLButtonElement;

    if (target.matches('[data-delete]') && confirm('Are you sure?')) {
      const reviewId = target.dataset.delete;
      try {
        const { status, statusText } = await axios.delete(`${this.URL}/${reviewId}`);
        if (status !== 200 || statusText !== 'OK') {
          toast('Something went wrong, open developer console', 'error');
          return;
        }
        this.reviews = this.reviews.filter(i => i.id !== reviewId);
        this.renderHTML(this.reviews);
        toast('Review successfully deleted', 'success');
      } catch (e) {
        toast('Something went wrong, open developer console', 'error');
        console.log(e);
      }
    }

    if (target.matches('[data-edit]')) {
      this.editItem = this.reviews.find(i => i.id === target.dataset.edit);
      if (this.editItem) {
        this.form.review.value = this.editItem.review;
        this.form.review.focus();
        this.form.rating.value = this.editItem.rating;
        document.querySelectorAll('[type="radio"]').forEach(input => {
          if (+input.value === +this.editItem.rating) input.checked = true;
        });
        this.form.querySelector('button')!.textContent = 'Update Review';
        if (document.querySelector('.cancel')) {
          document.querySelector('.cancel')!.remove();
        }
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel update';
        cancelBtn.classList.add('cancel', 'px-3', 'py-2', 'bg-neutral-800', 'text-white', 'hover:bg-neutral-600');
        cancelBtn.setAttribute('type', 'button');
        cancelBtn.addEventListener('click', () => {
          this.form.reset();
          cancelBtn.remove();
          this.form.querySelector('button')!.textContent = 'Submit';
        });
        this.form.appendChild(cancelBtn);
      }
    }
  }
}

// Создаем экземпляр класса Feedback, запуская приложение.
new Feedback();
