import './style.scss';
import feather from 'feather-icons';
import { toast } from './utils/toast.ts';
import { v4 as uuidv4 } from 'uuid';

interface ITodo {
  label: string,
  complete: boolean,
  id: string
}

/**
 * Класс для управления списком задач (Todo List).
 */
class Todo {
  private form: HTMLFormElement;
  private list: HTMLUListElement;
  private clear: HTMLButtonElement;
  private filter: HTMLInputElement;
  private counter: HTMLSpanElement;
  private todos: ITodo[] = [];

  /**
   * Создает экземпляр класса Todo.
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализация приложения.
   * Создает DOM-элементы, устанавливает обработчики событий и отображает существующие задачи.
   * @private
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает и отображает DOM-элементы для пользовательского интерфейса Todo-приложения.
   * @private
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='bg-white border shadow rounded max-w-md w-full p-3 grid gap-4'>
        <header class='flex flex-wrap gap-2 items-center justify-between'>
          <h2 class='font-bold text-2xl md:text-4xl w-full '>Todo</h2>
          <p class='min-h-[42px] flex gap-1 items-center'>You have <span class='font-bold' data-count>0</span> items</p>
          <button class='px-3 py-2 border hover:bg-slate-50 hidden' data-clear>Clear Completed</button>
        </header>
        <form data-form>
          <label>
            <input class='px-3 py-2 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50' type='text' name='todo' placeholder='Enter task name'>
          </label>
        </form>
         <div class='content hidden grid gap-3'>
          <label>
            <input class='px-3 py-2 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50' type='text' data-filter placeholder='Filter tasks'>
          </label>
          <ul class='grid gap-3' data-todos></ul>
        </div>
      </div>
    `;
    this.form = root.querySelector('[data-form]')!;
    this.list = root.querySelector('[data-todos]')!;
    this.clear = root.querySelector('[data-clear]')!;
    this.filter = root.querySelector('[data-filter]')!;
    this.counter = root.querySelector('[data-count]')!;
  }

  /**
   * Устанавливает обработчики событий для элементов пользовательского интерфейса Todo-приложения.
   * @private
   */
  private setupEventListeners(): void {
    this.storageDisplay();
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    this.list.addEventListener('click', this.handleDelete.bind(this));
    this.list.addEventListener('change', this.handleChange.bind(this));
    this.list.addEventListener('dblclick', this.handleUpdate.bind(this));
    this.filter.addEventListener('input', this.handleFilter.bind(this));
    this.clear.addEventListener('click', this.handleClear.bind(this));
  }

  /**
   * Обработчик отправки формы для добавления новой задачи.
   * @param {Event} event - Событие отправки формы.
   * @private
   */
  private handleSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const label = formData.get('todo') as string;
    if (label.length === 0) {
      toast('Please fill the field', 'warning');
      return;
    }
    form.reset();
    this.todos = [...this.todos, { label, complete: false, id: uuidv4() }];
    this.renderUI(this.todos);
  }

  /**
   * Обработчик удаления задачи.
   * @param {Object} param - Объект с информацией о событии и целевом элементе.
   * @param {HTMLButtonElement} param.target - Целевой элемент (кнопка удаления).
   * @private
   */
  private handleDelete({ target }: { target: HTMLButtonElement }) {
    if (!target.matches('[data-id]')) return;
    const id = target.dataset.id;
    const label = this.todos.filter(todo => todo.id === id)[0].label;
    if (confirm(`Delete ${label}?`)) {
      this.todos = this.todos.filter(todo => todo.id !== id);
      this.renderUI(this.todos);
    }
  }

  /**
   * Обработчик изменения состояния задачи (выполнено/не выполнено).
   * @param {Object} param - Объект с информацией о событии и целевом элементе.
   * @param {string} param.target.dataset.input - Идентификатор задачи.
   * @param {boolean} param.checked - Состояние задачи (выполнено/не выполнено).
   * @private
   */
  private handleChange({ target: { dataset: { input: id }, checked } }) {
    console.log(id, checked);
    this.todos = this.todos.map(todo => todo.id === id ? { ...todo, complete: checked } : todo);
    this.renderUI(this.todos);
  }

  /**
   * Обработчик редактирования задачи.
   * @param {Object} param - Объект с информацией о событии и целевом элементе.
   * @param {HTMLSpanElement} param.target - Целевой элемент (название задачи для редактирования).
   * @private
   */
  private handleUpdate({ target }: { target: HTMLSpanElement }) {
    if (!target.matches('[data-label]')) return;
    const id = target.dataset.label;
    const currentLabel = this.todos.filter(todo => todo.id === id)[0].label;
    const input = document.createElement('input');
    input.classList.add('w-full');
    input.type = 'text';
    input.value = currentLabel;
    target.after(input);
    target.classList.add('hidden');
    input.addEventListener('change', (event) => {
      event.stopPropagation();
      const label = event.target!.value;
      if (label !== currentLabel) {
        this.todos = this.todos.map(todo => todo.id === id ? { ...todo, label } : todo);
        this.renderUI(this.todos);
      }
      event.target!.style.display = '';
      input.remove();
    });
    input.focus();
  }

  /**
   * Обработчик фильтрации задач по тексту.
   * @param {Object} param - Объект с информацией о событии и целевом элементе.
   * @param {string} param.target.value - Текст для фильтрации задач.
   * @private
   */
  private handleFilter({ target: { value } }: { target: { value: string } }) {
    return Array.from(this.list.children).forEach(todo =>
      todo.style.display = todo.querySelector('[data-label]')!.textContent!.toLowerCase().indexOf(value.trim().toLowerCase()) !== -1 ? 'flex' : 'none',
    );
  }

  /**
   * Обработчик удаления всех выполненных задач.
   * @private
   */
  private handleClear() {
    const count = this.todos.filter(({ complete }) => complete).length;
    if (count === 0) return;
    if (confirm(`Delete ${count} completed items?`)) {
      this.todos = this.todos.filter(({ complete }) => !complete);
      this.renderUI(this.todos);
    }
  }

  /**
   * Отображает задачи на странице.
   * @param {ITodo[]} entries - Массив задач для отображения.
   * @private
   */
  private renderTodos(entries: ITodo[]) {
    document.querySelector('.content')!.className = `${entries.length === 0 ? 'content hidden' : 'content grid gap-3'}`;
    this.list.innerHTML = `
      ${entries.map(({ complete, label, id }) => `
        <li class='flex gap-2 p-1 items-center border rounded ${complete ? 'complete' : ''}'>
          <label class='flex ' for='todo-${id}'>
            <input class='visually-hidden' type='checkbox' data-input='${id}' id='todo-${id}' ${complete ? 'checked' : ''}>
            <span class='checkbox'></span>
          </label>
          <span class='flex-grow break-all ${complete ? 'line-through' : ''}' data-label='${id}'>${label}</span>
          <button data-id='${id}'>${feather.icons.x.toSvg()}</button>
        </li>
      `).join('')}`;

    this.filter.style.display = entries.length > 0 ? 'block' : 'none';
    this.counter.innerText = String(entries.filter((todo) => !todo.complete).length);
    this.clear.className = entries.filter((todo) => todo.complete).length ? 'px-3 py-2 border hover:bg-slate-50 ' : 'hidden';
  }

  /**
   * Метод для рендера пользовательского интерфейса и сохранения задач в локальное хранилище.
   * @param {ITodo[]} entries - Массив задач для отображения и сохранения.
   */
  renderUI = (entries: ITodo[]) => {
    this.storageAdd(entries);
    this.renderTodos(entries);
  };

  /**
   * Отображает задачи, полученные из локального хранилища.
   * @private
   */
  private storageDisplay() {
    this.todos = this.storageGet();
    this.renderTodos(this.todos);
  }

  /**
   * Получает задачи из локального хранилища.
   * @returns {ITodo[]} Массив объектов задач или пустой массив, если задачи отсутствуют.
   * @private
   */
  storageGet = (): ITodo[] | [] => {
    const entries = localStorage.getItem('todos');
    return entries ? JSON.parse(entries) : [];
  };

  /**
   * Добавляет задачи в локальное хранилище.
   * @param {ITodo[]} entries - Массив объектов задач для сохранения.
   * @private
   */
  private storageAdd(entries: ITodo[]) {
    return localStorage.setItem('todos', JSON.stringify(entries));
  };
}

// Создание экземпляра класса Todo при загрузке страницы.
new Todo();
