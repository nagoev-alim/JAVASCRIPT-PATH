import './style.scss';
import { v4 as uuidv4 } from 'uuid';
import feather from 'feather-icons';

/**
 * Интерфейс для представления тренировок.
 * @interface
 */
interface IWork {
  date: string;
  workout: string;
  duration: number;
  id: string;
}

/**
 * Класс для отслеживания тренировок.
 * @class
 */
class WorkoutTracker {
  /**
   * Кнопка "Добавить запись".
   * @private
   * @type {HTMLButtonElement}
   */
  private button: HTMLButtonElement;

  /**
   * Массив записей о тренировках.
   * @private
   * @type {IWork[]}
   */
  private entries: IWork[] = [];

  /**
   * Создает экземпляр класса WorkoutTracker.
   * @constructor
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует класс.
   * @private
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает DOM элементы.
   * @private
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='bg-white border shadow rounded max-w-2xl w-full p-3 grid'>
        <h1 class='text-center font-bold text-2xl md:text-4xl mb-3'>Workout Tracker</h1>
        <div class='header grid grid-cols-3'>
          <div class='p-3 text-center bg-neutral-900 text-white border font-medium'>Date</div>
          <div class='p-3 text-center bg-neutral-900 text-white border font-medium'>Workout</div>
          <div class='p-3 text-center bg-neutral-900 text-white border font-medium'>Duration</div>
        </div>
        <div class='main mb-3'></div>
        <div class='footer'>
          <button class='px-3 py-2 border hover:bg-slate-50 w-full'>Add Entry</button>
        </div>
      </div>
    `;
    this.button = root.querySelector('button')!;
  }

  /**
   * Настраивает обработчики событий.
   * @private
   */
  private setupEventListeners(): void {
    this.entries = this.storageGet();
    this.updateView();
    this.button.addEventListener('click', this.handleSubmit.bind(this));
  }

  /**
   * Получает записи о тренировках из локального хранилища.
   * @private
   * @returns {IWork[]} Массив записей о тренировках.
   */
  private storageGet(): IWork[] | [] {
    const entries = localStorage.getItem('workout');
    return entries ? JSON.parse(entries) : [];
  }

  /**
   * Сохраняет записи о тренировках в локальном хранилище.
   * @private
   */
  private storageSet(): void {
    return localStorage.setItem('workout', JSON.stringify(this.entries));
  }

  /**
   * Обновляет отображение записей о тренировках.
   * @private
   */
  private updateView(): void {
    const body = document.querySelector('.main')!;
    body.querySelectorAll('.row').forEach(row => row.remove());
    for (const entry of this.entries) {
      const row = document.createElement('div');
      row.classList.add('row', 'grid', 'grid-cols-3');
      row.innerHTML = `
        <div class='date border p-1'>
          <input class='px-3 py-2 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50' type='date'>
        </div>
        <div class='type border p-1'>
          <select class='px-3 py-2 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50'>
              <option value='walking'>Walking</option>
              <option value='running'>Running</option>
              <option value='outdoor-cycling'>Outdoor Cycling</option>
              <option value='indoor-cycling'>Indoor Cycling</option>
              <option value='swimming'>Swimming</option>
              <option value='yoga'>Yoga</option>
          </select>
        </div>
        <div class='duration flex border p-1'>
          <div>
            <input class='w-[50px] px-3 py-2 border rounded focus:outline-none focus:border-blue-400 bg-slate-50' type='number'>
            <span class='text-sm'>minutes</span>
          </div>
          <button class='ml-auto' data-id='${entry.id}'>${feather.icons.x.toSvg()}</button>
        </div>
      `;

      const fieldDate = row.querySelector('[type="date"]')!;
      const fieldSelect = row.querySelector('select')!;
      const fieldNumber = row.querySelector('[type="number"]')!;
      const buttonDelete = row.querySelector('button')!;

      fieldDate.value = entry.date;
      fieldSelect.value = entry.workout;
      fieldNumber.value = entry.duration;

      fieldDate.addEventListener('change', ({ target: { value } }) => {
        entry.date = value;
        this.storageSet();
      });

      fieldSelect.addEventListener('change', ({ target: { value } }) => {
        entry.workout = value;
        this.storageSet();
      });

      fieldNumber.addEventListener('change', ({ target: { value } }) => {
        entry.duration = value;
        this.storageSet();
      });

      buttonDelete.addEventListener('click', ({ target: { dataset: { id: rowID } } }) => {
        if (confirm('Are you sure you want to delete it?')) {
          this.entries = this.entries.filter(({ id }) => id !== rowID);
          this.storageSet();
          this.updateView();
        }
      });

      body.appendChild(row);
    }
  }

  /**
   * Обработчик для кнопки "Добавить запись".
   * @private
   */
  private handleSubmit(): void {
    const date = `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date().getDay().toString().padStart(2, '0')}`;
    this.entries.push({ date, workout: 'walking', duration: 30, id: uuidv4() });
    this.storageSet();
    this.updateView();
  }
}

// Создаем экземпляр класса WorkoutTracker.
new WorkoutTracker();
