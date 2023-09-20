import './style.scss';

/**
 * Класс для бронирования мест в кинотеатре.
 */
class Booking {
  /**
   * Контейнер для отображения мест.
   */
  private container: HTMLDivElement;

  /**
   * Список мест, представленных кнопками.
   */
  private seats: NodeListOf<HTMLButtonElement>;

  /**
   * Элемент для отображения количества выбранных мест.
   */
  private count: HTMLSpanElement;

  /**
   * Элемент для отображения общей стоимости выбранных мест.
   */
  private total: HTMLSpanElement;

  /**
   * Выпадающий список с выбором фильма и цены.
   */
  private select: HTMLSelectElement;

  /**
   * Цена за билет.
   */
  private ticketPrice: number;

  /**
   * Создает новый экземпляр класса Booking и инициализирует его.
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализация компонентов.
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает DOM-элементы и добавляет их на страницу.
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='bg-white border shadow rounded max-w-md w-full p-3 grid gap-4 seat-booking'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Movie Seat Booking</h1>

        <div class='header'>
          <label class='grid gap-1'>
            <span class='font-medium text-sm'>Pick a movie:</span>
            <select class='px-3 py-2 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50' data-select>
              <option value='10'>The Guard ($10)</option>
              <option value='12'>Harry Potter ($12)</option>
              <option value='8'>Detachment ($8)</option>
              <option value='9'>Sing Street ($9)</option>
            </select>
          </label>
        </div>

        <ul class='grid grid-cols-3 gap-2'>
          ${[...Array(3).keys()].map(row => `
            <li class='flex items-center gap-2'>
              <div class='seat ${row === 1 ? 'selected' : ''} ${row === 2 ? 'occupied' : ''}'></div>
              <small>
                  ${row === 0 ? 'N/A' : ''}
                  ${row === 1 ? 'Selected' : ''}
                  ${row === 2 ? 'Occupied' : ''}
              </small>
            </li>
          `).join('')}
        </ul>

        <div class='container grid justify-center gap-3' data-booking>
          <div class='screen'></div>
          ${[...Array(6).keys()].map(row => `
            <div class='row grid gap-2.5 justify-items-center grid-cols-8'>
              ${row === 0 ? `${[...Array(8).keys()].map(() => `<button class='seat'></button>`).join('')}` : ''}
              ${row === 1 ? `${[...Array(8).keys()].map(index => index === 3 || index === 4 ? `<button class='seat occupied'></button>` : `<button class='seat'></button>`).join('')}` : ''}
              ${row === 2 ? `${[...Array(8).keys()].map(index => index === 6 || index === 7 ? `<button class='seat occupied'></button>` : `<button class='seat'></button>`).join('')}` : ''}
              ${row === 3 ? `${[...Array(8).keys()].map(() => `<button class='seat'></button>`).join('')}` : ''}
              ${row === 4 ? `${[...Array(8).keys()].map(index => index === 3 || index === 4 ? `<button class='seat occupied'></button>` : `<button class='seat'></button>`).join('')}` : ''}
              ${row === 5 ? `${[...Array(8).keys()].map(index => index === 4 || index === 5 || index === 6 ? `<button class='seat occupied'></button>` : `<button class='seat'></button>`).join('')}` : ''}
            </div>
          `).join('')}
        </div>

        <p class='text-center'>
          You have selected <span class='font-bold' data-count>0</span> seats for a price of $<span class='font-bold' data-total>0</span>
        </p>
      </div>
    `;

    this.container = root.querySelector('[data-booking]')!;
    this.seats = root.querySelectorAll('.row .seat:not(.occupied)')!;
    this.count = root.querySelector('[data-count]')!;
    this.total = root.querySelector('[data-total]')!;
    this.select = root.querySelector('[data-select]')!;
  }

  /**
   * Настраивает обработчики событий.
   */
  private setupEventListeners(): void {
    this.ticketPrice = Number(this.select.value);
    this.storageGetData();
    this.updateSelected();
    this.container.addEventListener('click', this.containerHandler.bind(this));
    this.select.addEventListener('change', this.selectHandler.bind(this));
  }

  /**
   * Загружает данные о выбранных местах из локального хранилища.
   */
  private storageGetData(): void {
    const selectedSeats = JSON.parse(localStorage.getItem('seats') || '[]') as number[];
    if (selectedSeats !== null && selectedSeats.length > 0) {
      this.seats.forEach((seat, index) => {
        if (selectedSeats.indexOf(index) > -1) seat.classList.add('selected');
      });
    }
    const selectedMovieIndex = localStorage.getItem('movieIndex');
    if (selectedMovieIndex !== null) this.select.selectedIndex = Number(selectedMovieIndex);
  }

  /**
   * Обновляет информацию о выбранных местах и их стоимости.
   */
  private updateSelected() {
    const selectedSeats = document.querySelectorAll('.row .seat.selected');
    localStorage.setItem('seats', JSON.stringify([...selectedSeats].map(seat => [...this.seats].indexOf(seat))));
    this.count.innerText = selectedSeats.length.toString();
    console.log(selectedSeats.length);
    console.log(this.ticketPrice);
    this.total.innerText = (selectedSeats.length * this.ticketPrice).toString();
  }

  /**
   * Обработчик клика по контейнеру с местами.
   * @param {Event} event - Событие клика.
   */
  private containerHandler(event: Event): void {
    const target = event.target as HTMLDivElement;
    if (target.classList.contains('seat') && !target.classList.contains('occupied')) {
      target.classList.toggle('selected');
      this.updateSelected();
    }
  }

  /**
   * Обработчик изменения выбранного фильма в выпадающем списке.
   * @param {{target: {selectedIndex: number, value: string}}} param - Параметры события.
   */
  private selectHandler({ target: { selectedIndex, value } }: {
    target: { selectedIndex: number; value: string; }
  }): void {
    this.ticketPrice = Number(value);
    this.storageSaveMovie(selectedIndex);
    this.updateSelected();
  }

  /**
   * Сохраняет индекс выбранного фильма в локальное хранилище.
   * @param {number} index - Индекс выбранного фильма.
   */
  private storageSaveMovie(index: number): void {
    localStorage.setItem('movieIndex', index.toString());
  }
}

// Создание экземпляра класса Booking при загрузке страницы.
new Booking();
