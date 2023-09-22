import './style.scss';

/**
 * Интерфейс для элемента управления вкладками (заголовка вкладки).
 * @interface
 */
interface TabControlElement extends HTMLLIElement {
  dataset: {
    control?: string;
  };
}

/**
 * Интерфейс для элемента содержимого вкладки.
 * @interface
 */
interface TabContentElement extends HTMLLIElement {
  dataset: {
    content?: string;
  };
}

/**
 * Класс Tabs представляет собой компонент для создания и управления вкладками.
 * @class
 */
class Tabs {
  private tabsH: HTMLDivElement | null = null;
  private tabsV: HTMLDivElement | null = null;

  /**
   * Создает экземпляр класса Tabs и инициализирует его.
   * @constructor
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует компонент, создавая DOM-структуру и устанавливая обработчики событий.
   * @private
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает DOM-структуру для компонента и вставляет ее в корневой элемент с id "app".
   * @private
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='tabs grid gap-3'>
        <h3 class='text-center font-bold text-2xl md:text-4xl'>Tabs Horizontal</h3>
        <div class='tabs-item--horizontal border rounded bg-white grid'>
          <ul class='grid sm:grid-cols-3'>
            ${Array.from({ length: 3 }).map((_, i) => `
              <li data-control='${i + 1}' class='p-3 text-black font-bold border cursor-pointer ${i === 0 ? 'active bg-slate-900 text-white' : ''}'>
                Tab ${i + 1}
              </li>
            `).join('')}
          </ul>
          <ul class='tabs__body relative'>
            ${Array.from({ length: 3 }).map((_, i) => `
              <li data-content='${i + 1}' class='${i === 0 ? 'active' : ''}'>
                <h3 class='font-bold text-lg'>Tab ${i + 1}</h3>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam, sequi!
              </li>
            `).join('')}
          </ul>
        </div>


        <h3 class='text-center font-bold text-2xl md:text-4xl'>Switchable Vertical</h3>
        <div class='tabs-item tabs-item--vertical border rounded bg-white grid sm:grid-cols-[200px_auto] sm:items-start'>
          <ul class='grid sm:border-r-2'>
            ${Array.from({ length: 3 }).map((_, i) => `
              <li data-control='${i + 1}' class='p-3 text-black font-bold border-b cursor-pointer  ${i === 0 ? 'active active bg-slate-900 text-white' : ''}'>
                Tab ${i + 1}
              </li>
            `).join('')}
          </ul>
          <ul class='tabs__body relative'>
            ${Array.from({ length: 3 }).map((_, i) => `
              <li data-content='${i + 1}' class='${i === 0 ? 'active' : ''}'>
                <h3 class='font-bold text-lg'>Tab ${i + 1}</h3>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam, sequi!
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    `;
    this.tabsH = root.querySelector('.tabs-item--horizontal')!;
    this.tabsV = root.querySelector('.tabs-item--vertical')!;
  }

  /**
   * Устанавливает обработчики событий для элементов управления вкладками.
   * @private
   */
  private setupEventListeners(): void {
    this.tabsV?.querySelectorAll('[data-control]').forEach(el => el.addEventListener('click', this.handleClick.bind(this)));
    this.tabsH?.querySelectorAll('[data-control]').forEach(el => el.addEventListener('click', this.handleClick.bind(this)));
  }

  /**
   * Обработчик события клика на элементе управления вкладками.
   * @param {MouseEvent} event - Событие клика.
   * @private
   */
  private handleClick(event: MouseEvent): void {
    const target = event.target as TabControlElement;
    const parentElement = target.parentElement as HTMLUListElement;
    parentElement.querySelectorAll('[data-control]').forEach(el => el.classList.remove('active', 'bg-slate-900', 'text-white'));
    parentElement.nextElementSibling!.querySelectorAll('[data-content]').forEach(el => el.classList.remove('active'));

    if (target.dataset.control) {
      const control = target.dataset.control;
      const contentElement = parentElement.nextElementSibling!.querySelector(`[data-content='${control}']`) as TabContentElement;
      target.classList.add('active', 'bg-slate-900', 'text-white');
      contentElement.classList.add('active');
    }
  }
}

// Создаем экземпляр класса Tabs.
new Tabs();
