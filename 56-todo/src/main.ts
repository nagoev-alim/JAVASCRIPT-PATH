import './style.scss';
import feather from 'feather-icons';
import axios, { AxiosResponse } from 'axios';
import { toast } from './utils/toast.ts';

/**
 * @property {boolean} completed - Отмечена ли задача как выполненная.
 * @property {number} [id] - Уникальный идентификатор задачи.
 * @property {string} title - Заголовок задачи.
 * @property {number} userId - Уникальный идентификатор пользователя, связанного с задачей.
 */
interface ITodo {
  completed: boolean,
  id?: number,
  title: string,
  userId: number
}

/**
 * @property {number} id - Уникальный идентификатор пользователя.
 * @property {string} name - Имя пользователя.
 */
interface IUser {
  id: number,
  name: string
}

/**
 * Класс Todo для управления задачами и пользователями.
 * @class
 */
class Todo {
  private form: HTMLFormElement;
  private list: HTMLUListElement;
  private select: HTMLSelectElement;
  private readonly URL: string = 'https://jsonplaceholder.typicode.com/';
  private todos: ITodo[] = [];
  private users: IUser[] = [];

  /**
   * Создает экземпляр класса Todo.
   * @constructor
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует приложение, создавая необходимый DOM и настраивая обработчики событий.
   * @private
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает необходимую структуру DOM для приложения.
   * @private
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='bg-white border shadow rounded max-w-lg w-full p-3 grid gap-4'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Todo</h1>
         <div class='grid gap-3'>
          <form class='grid gap-3' autocomplete='off' data-form>
            <label>
              <input class='px-3 py-2 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50' name='todo' type='text' placeholder='New todo'>
            </label>
            <select class='px-3 py-2 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50' name='user' data-select>
              <option disabled selected>Select user</option>
            </select>
            <button class='px-3 py-2 border hover:bg-slate-50' type='submit'>Add Todo</button>
          </form>
          <ul class='grid gap-3' data-list></ul>
        </div>
      </div>
    `;
    this.form = root.querySelector('[data-form]')!;
    this.list = root.querySelector('[data-list]')!;
    this.select = root.querySelector('[data-select]')!;
  }

  /**
   * Настраивает обработчики событий для формы и списка задач.
   * @private
   */
  private setupEventListeners(): void {
    this.fetchData();
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    this.list.addEventListener('change', this.handleChange.bind(this));
    this.list.addEventListener('click', this.handleDelete.bind(this));
  }

  /**
   * Асинхронно загружает данные о задачах и пользователях с сервера.
   * @private
   */
  private async fetchData() {
    try {
      const [todos, users] = await Promise.all([
        axios.get<ITodo[]>(`${this.URL}todos?_limit=15`),
        axios.get<IUser[]>(`${this.URL}users`),
      ]);
      this.todos = todos.data;
      this.users = users.data;
      this.renderData('todos', this.todos);
      this.renderData('users', this.users);
    } catch (e) {
      console.log(e);
      toast('Something wrong', 'error');
    }
  }

  /**
   * Отображает данные на странице в зависимости от типа.
   * @param {string} type - Тип данных (todos, users, todo).
   * @param {ITodo[] | IUser[] | ITodo} entries - Массив задач, массив пользователей или объект задачи.
   * @private
   */
  private renderData(type: string, entries: ITodo[] | IUser[]) {
    switch (type) {
      case 'todos':
        this.list.innerHTML = `
        ${entries.map(({ userId, id, title, completed }: ITodo) => {
          return `
            <li class='flex gap-1.5 items-start border p-1 rounded' data-id='${id}'>
              <label class='flex'>
                ${completed ? `<input class='visually-hidden' type='checkbox' checked data-checkbox>` : `<input class='visually-hidden' type='checkbox' data-checkbox>`}
                <span class='checkbox'></span>
              </label>
              <p class='grid gap-1 flex-grow'>${title}<span class='text-sm font-bold'>(${this.getUserName(userId)})</span></p>
              <button class='shrink-0' data-delete='${id}'>${feather.icons.x.toSvg()}</button>
            </li>
          `;
        }).join('')}`;
        break;

      case 'users':
        this.select.innerHTML = `
        <option disabled selected>Select user</option>
        ${entries.map(({ id, name }: IUser) => {
          return `<option value='${id}'>${name}</option>`;
        }).join('')}`;
        break;

      case 'todo':
        const todo = document.createElement('li');
        todo.className = 'flex gap-1.5 items-start border p-1 rounded';
        todo.dataset.id = (entries as ITodo).id.toString();
        todo.innerHTML = `
        <label class='flex'>
          <input class='visually-hidden' type='checkbox' data-checkbox>
          <span class='checkbox'></span>
        </label>
        <p class='grid gap-1 flex-grow'>${entries.title}<span class='text-sm font-bold'>${this.getUserName(entries.userId)}</span></p>
        <button class='shrink-0' data-delete='${entries.id}'>${feather.icons.x.toSvg()}</button>`;
        this.list.prepend(todo);
        break;
      default:
        break;
    }
  }

  /**
   * Получает имя пользователя по его идентификатору.
   * @param {number} userId - Идентификатор пользователя.
   * @returns {string} - Имя пользователя.
   * @private
   */
  private getUserName(userId: number): string {
    return this.users.find((user) => user.id === userId)!.name;
  }

  /**
   * Обрабатывает отправку формы для создания новой задачи.
   * @param {Event} event - Объект события.
   * @private
   */
  private handleSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const user = formData.get('user') as string;
    const todo = formData.get('todo') as string;
    this.createTodo({ userId: Number(user), title: todo, completed: false });
    form.reset();
  }

  /**
   * Асинхронно создает новую задачу на сервере.
   * @param {ITodo} entry - Новая задача.
   * @private
   */
  private async createTodo(entry: ITodo) {
    try {
      const response: AxiosResponse<{ id: number }> = await axios.post(`${this.URL}todos`, { ...entry });
      const createdTodo: ITodo = { ...entry, id: response.data.id };
      this.renderData('todo', createdTodo);
    } catch (e) {
      toast('Something went wrong, open dev console', 'error');
      console.log(e);
    }
  }

  /**
   * Обрабатывает изменение состояния задачи (отмечена/не отмечена выполненной).
   * @param {MouseEvent} event - Объект события мыши.
   * @private
   */
  private async handleChange(event: MouseEvent) {
    const target = event.target as HTMLInputElement;
    const id = target.closest('li')!.dataset.id;
    const completed = target.checked;
    try {
      await axios.patch(`${this.URL}todos/${id}`, { completed });
    } catch (e) {
      toast('Something went wrong, open dev console', 'error');
      console.log(e);
    }
  }

  /**
   * Обрабатывает удаление задачи.
   * @param {{ target: HTMLButtonElement }} param0 - Объект события и целевой элемент (кнопка).
   * @private
   */
  private async handleDelete({ target }: { target: HTMLButtonElement }) {
    if (target.tagName === 'BUTTON' && confirm('Are you sure to delete?')) {
      const todoId = Number(target.dataset.delete);
      try {
        const { status } = await axios.delete(`${this.URL}todos/${todoId}`);
        if (status === 200) {
          this.todos = this.todos.filter(({ id }) => id !== todoId);
          this.renderData('todos', this.todos);
        }
      } catch (e) {
        toast('Something went wrong, open dev console', 'error');
        console.log(e);
      }
    }
  }
}

// Создание экземпляра класса Todo для запуска приложения.
new Todo();
