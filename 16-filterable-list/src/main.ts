/**
 * Представляет компонент "Фильтруемый список".
 */
import './style.css';
import { faker } from '@faker-js/faker';

class FilterableList {
  private input: HTMLInputElement | null = null;
  private list: HTMLUListElement | null = null;
  private users: string[] = [];

  /**
   * Инициализирует компонент "Фильтруемый список".
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует компонент, создавая DOM-элементы и настраивая обработчики событий.
   */
  private initialize() {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает необходимые DOM-элементы для компонента.
   */
  private createDOM() {
    const root = document.querySelector<HTMLDivElement>('#app');
    if (!root) return;

    root.innerHTML = `
      <div class='border shadow rounded max-w-xl w-full p-3 grid gap-4'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>A Filterable List</h1>
        <input class='px-3 py-2.5 border-2 focus:outline-none focus:border-blue-400 rounded' type='text' data-query placeholder='Поиск по имени'>
        <ul data-list></ul>
      </div>
    `;

    this.input = root.querySelector('[data-query]') as HTMLInputElement;
    this.list = root.querySelector('[data-list]') as HTMLUListElement;
  }

  /**
   * Настраивает обработчики событий для элемента ввода.
   */
  private setupEventListeners() {
    if (!this.input) return;
    this.renderUsers();
    this.input.addEventListener('keyup', this.handleKeyUp);
  }

  /**
   * Отображает список пользователей на основе случайных данных.
   */
  private renderUsers() {
    if (!this.list) return;
    Array.from({ length: 100 }).forEach(() => this.users.push(`${faker.name.firstName()} ${faker.name.lastName()} ${faker.name.jobArea()}`));
    this.list.innerHTML = `${this.users.sort().map(user =>
      `<li class='flex gap-1 border p-2'>
        <span class='text-lg'>${user.split(' ')[0]} ${user.split(' ')[1]}</span>
        <span class='font-medium ml-auto'>${user.split(' ')[2]}</span>
        <div data-name class='hidden'>${user}</div>
      </li>`
    ).join('')}`;
  }

  /**
   * Обрабатывает событие keyup на элементе ввода для фильтрации списка пользователей.
   * @param {Event} event - Событие keyup.
   */
  private handleKeyUp(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.value.trim().length === 0) {
      document.querySelectorAll('[data-name]')
        .forEach(name => {
          if (name && name.parentElement) {
            name.parentElement.style.display = 'flex';
          }
        });
    }

    setTimeout(() => {
      document.querySelectorAll('[data-name]').forEach(name => {
        if (name && name.parentElement && name.textContent) {
          name.parentElement.style.display = name.textContent.toLowerCase().indexOf(target.value.toLowerCase()) > -1 ? 'flex' : 'none';
        }
      });
    }, 100);
  }
}

// Создаем экземпляр компонента "Фильтруемый список".
new FilterableList();
