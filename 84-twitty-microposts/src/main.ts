import './style.scss';
import { icons } from 'feather-icons';
import axios, { AxiosResponse } from 'axios';
import { toast } from './utils/toast.ts';

interface IPost {
  id: string;
  title: string;
  body: string;
}

/**
 * Класс Twitty представляет веб-приложение для управления постами.
 */
class Twitty {
  private posts: IPost[] = [];
  private URL: string = 'https://63c83f46e52516043f4ee625.mockapi.io/posts';
  private form: HTMLFormElement;
  private list: HTMLUListElement;
  private loader: HTMLDivElement;
  private isEdit: boolean = false;
  private editItem: IPost | null = null;

  /**
   * Создает экземпляр класса Twitty и вызывает метод инициализации.
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализация класса Twitty, создание DOM-элементов и установка обработчиков событий.
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
      <div class='max-w-2xl mx-auto w-full grid gap-4'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Twitty</h1>
        <div class='grid gap-3'>
          <form class='grid bg-white p-4 gap-3 border rounded' data-form>
            <input class='px-3 py-2 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50' type='text' name='title' placeholder='Title'>
            <textarea class='min-h-[150px] resize-none px-3 py-2 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50' name='body' placeholder='Body text'></textarea>
            <button class='px-3 py-2 border hover:bg-slate-50' type='submit'>Submit</button>
          </form>
          <div class='result'>
            <div data-loader class='flex justify-center py-4'>
              <div class='dot-wave'>
                <div class='dot-wave__dot'></div>
                <div class='dot-wave__dot'></div>
                <div class='dot-wave__dot'></div>
                <div class='dot-wave__dot'></div>
              </div>
            </div>
            <ul class='grid gap-3 hidden' data-list></ul>
          </div>
        </div>
      </div>
    `;
    this.form = root.querySelector('[data-form]')!;
    this.list = root.querySelector('[data-list]')!;
    this.loader = root.querySelector('[data-loader]')!;
  }

  /**
   * Устанавливает обработчики событий для формы и списка постов.
   */
  private setupEventListeners(): void {
    this.fetchData();
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    this.list.addEventListener('click', this.handleClick.bind(this));
  }

  /**
   * Выполняет загрузку данных с сервера и отображает их в приложении.
   */
  private async fetchData(): Promise<void> {
    this.loader.classList.remove('hidden');
    try {
      const { data }: AxiosResponse<IPost[]> = await axios.get(this.URL);
      this.posts = data;
      this.renderHTML(this.posts);
      this.loader.classList.add('hidden');
    } catch (e) {
      this.loader.classList.add('hidden');
      this.list.classList.add('hidden');
      toast('Something went wrong, open developer console', 'error');
      console.log(e);
    }
  }

  /**
   * Отображает данные в интерфейсе приложения.
   * @param {IPost[]} data - Массив постов для отображения.
   */
  private renderHTML(data: IPost[]): void {
    this.list.innerHTML = ``;
    this.list.classList.remove('hidden');
    for (const { title, body, id } of data) {
      const li = document.createElement('li');
      li.className = 'grid gap-3 relative bg-white p-3 rounded bg-white border';
      li.innerHTML = `
        <h3 class='font-bold text-xl pr-[80px]'>${title}</h3>
        <p>${body}</p>
        <div class='absolute right-3 flex gap-3'>
          <button data-edit='${id}'>${icons.edit.toSvg({ color: '#41b6e6' })}</button>
          <button data-delete='${id}'>${icons.x.toSvg({ color: '#ff585d' })}</button>
        </div>`;
      this.list.append(li);
    }
  }

  /**
   * Обрабатывает отправку формы для создания или обновления поста.
   * @param {Event} event - Объект события отправки формы.
   */
  private async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const title = formData.get('title') as string;
    const body = formData.get('body') as string;
    if (title.trim().length === 0 || body.trim().length === 0) {
      toast('Please fill the fields', 'warning');
      return;
    }
    try {
      if (!this.isEdit) {
        const { status, statusText } = await axios.post(`${this.URL}`, { title, body });
        if (status !== 201 || statusText !== 'Created') {
          toast('Something went wrong, open developer console', 'error');
          return;
        }
        await this.fetchData();
        toast('Post successfully created', 'success');
      } else {
        const { status } = await axios.put(`${this.URL}/${this.editItem!.id}`, { title, body });
        if (status !== 200) {
          toast('Something went wrong, open developer console', 'error');
          return;
        }
        this.posts = this.posts.map(i => i.id === this.editItem!.id ? { ...i, title, body } : i);
        this.renderHTML(this.posts);
        toast('Post successfully updated', 'success');
        this.isEdit = false;
        this.editItem = null;
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
   * Обрабатывает клики на кнопках "Удалить" и "Редактировать" пост.
   * @param {MouseEvent} event - Объект события клика на кнопке.
   */
  private async handleClick(event: MouseEvent): Promise<void> {
    const target = event.target as HTMLButtonElement;
    if (target.matches('[data-delete]') && confirm('Are you sure?')) {
      const postId = target.dataset.delete;
      try {
        const { status, statusText } = await axios.delete(`${this.URL}/${postId}`);
        if (status !== 200 || statusText !== 'OK') {
          toast('Something went wrong, open developer console', 'error');
          return;
        }
        this.posts = this.posts.filter(i => i.id !== postId);
        this.renderHTML(this.posts);
        toast('Post successfully deleted.', 'success');
      } catch (e) {
        toast('Something went wrong, open developer console', 'error');
        console.log(e);
      }
    }

    if (target.matches('[data-edit]')) {
      const postId = target.dataset.edit;
      this.isEdit = true;
      this.editItem = this.posts.find(i => i.id === postId);
      if (this.editItem) {
        this.form.title.value = this.editItem.title;
        this.form.title.focus();
        this.form.body.value = this.editItem.body;
        this.form.querySelector('button')!.textContent = 'Update';
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel update';
        cancelBtn.classList.add('cancel', 'px-3', 'py-2', 'bg-red-500', 'text-white', 'hover:bg-red-400');
        cancelBtn.setAttribute('type', 'button');
        this.form.appendChild(cancelBtn);
        cancelBtn.addEventListener('click', () => {
          this.form.reset();
          cancelBtn.remove();
          this.form.querySelector('button')!.textContent = 'Submit';
        });
      }
    }
  }
}

// Создание экземпляра класса Twitty для запуска приложения.
new Twitty();
