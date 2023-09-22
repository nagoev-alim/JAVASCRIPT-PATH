import './style.scss';
import feather from 'feather-icons';

/**
 * Класс Calendar представляет динамический календарь.
 * @class
 */
class Calendar {
  private date: Date = new Date();
  private currYear: number = '';
  private currMonth: number = 0;
  private months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  private days: HTMLUListElement;
  private currentDate: HTMLParagraphElement;
  private controls: NodeListOf<HTMLButtonElement>;

  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует календарь, создавая DOM-структуру и устанавливая обработчики событий.
   * @private
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает DOM-структуру для календаря.
   * @private
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='bg-white border shadow rounded max-w-md w-full p-3 grid gap-4'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Dynamic Calendar</h1>
        <div class='content grid gap-2'>
          <header class='grid grid-cols-[auto_93px] gap-1 items-center'>
            <p class='font-medium text-lg pl-2' data-currentDate>January 2023</p>
            <div class='grid grid-cols-[42px_42px] gap-2'>
              <button class='p-2 border hover:bg-slate-50' data-control='prev'>${feather.icons['chevron-left'].toSvg()}</button>
              <button class='p-2 border hover:bg-slate-50' data-control='next'>${feather.icons['chevron-right'].toSvg()}</button>
            </div>
          </header>
          <div>
            <ul class='grid grid-cols-7 text-center gap-1.5'>${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(m => `<li class='font-medium p-2'>${m}</li>`).join('')}</ul>
            <ul class='grid grid-cols-7 text-center gap-1.5' data-days></ul>
          </div>
        </div>
      </div>
    `;
    this.days = root.querySelector('[data-days]')!;
    this.currentDate = root.querySelector('[data-currentDate]')!;
    this.controls = root.querySelectorAll('[data-control]')!;
  }

  /**
   * Устанавливает обработчики событий для элементов управления календарем.
   * @private
   */
  private setupEventListeners(): void {
    this.currYear = this.date.getFullYear();
    this.currMonth = this.date.getMonth();
    this.render();
    this.controls.forEach(icon => icon.addEventListener('click', this.handleClick.bind(this)));
  }

  /**
   * Рендерит календарь на основе текущего года и месяца.
   * @private
   */
  private render() {
    let firstDayOfMonth = new Date(this.currYear, this.currMonth, 1).getDay();
    let lastDateOfMonth = new Date(this.currYear, this.currMonth + 1, 0).getDate();
    let lastDayOfMonth = new Date(this.currYear, this.currMonth, lastDateOfMonth).getDay();
    let lastDateOfLastMonth = new Date(this.currYear, this.currMonth, 0).getDate();
    let tag = '';

    for (let i = firstDayOfMonth; i > 0; i--) {
      tag += `<li class='p-2 inactive text-gray-400'>${lastDateOfLastMonth - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDateOfMonth; i++) {
      tag += `<li class='p-2 ${i === this.date.getDate() && this.currMonth === new Date().getMonth() && this.currYear === new Date().getFullYear() ? 'active bg-slate-900 text-white rounded-md' : ''}'>${i}</li>`;
    }

    for (let i = lastDayOfMonth; i < 6; i++) {
      tag += `<li class='p-2 inactive text-gray-400'>${i - lastDayOfMonth + 1}</li>`;
    }

    this.currentDate.innerText = `${this.months[this.currMonth]} ${this.currYear}`;
    this.days.innerHTML = tag;
  }

  /**
   * Обработчик клика на элементе управления календарем.
   * @param {MouseEvent} event - Событие клика.
   * @private
   */
  private handleClick(event: MouseEvent) {
    const target = event.target as HTMLButtonElement;
    this.currMonth = target.dataset.control === 'prev' ? this.currMonth - 1 : this.currMonth + 1;

    if (this.currMonth < 0 || this.currMonth > 11) {
      this.date = new Date(this.currYear, this.currMonth);
      this.currYear = this.date.getFullYear();
      this.currMonth = this.date.getMonth();
    } else {
      this.date = new Date();
    }

    this.render();
  }
}

// Создаем экземпляр класса Calendar.

new Calendar();
