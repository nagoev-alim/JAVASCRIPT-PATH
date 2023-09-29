import './style.scss';
import { toast } from './utils/toast.ts';

/**
 * Интерфейс WaterConfig представляет конфигурацию потребления воды.
 */
interface WaterConfig {
  /**
   * Цель потребления воды (количество литров).
   */
  goal: number;

  /**
   * Размер стакана (в миллилитрах).
   */
  size: number;

  /**
   * Количество стаканов.
   */
  count: number;

  /**
   * Высота отображаемых стаканов (в пикселях).
   */
  cupDisplayHeight: number;

  /**
   * Количество заполненных стаканов.
   */
  fulledCups: number;

  /**
   * Общее количество стаканов.
   */
  totalCups: number;
}

/**
 * Класс DrinkWaterTracker представляет собой приложение для отслеживания потребления воды.
 */
class DrinkWaterTracker {
  private form: HTMLFormElement;
  private goal: HTMLSpanElement;
  private cups: HTMLUListElement;
  private container: HTMLDivElement;
  private liters: HTMLSpanElement;
  private percentage: HTMLDivElement;
  private remained: HTMLDivElement;
  private btnReset: HTMLButtonElement;
  private goalLiters: number = 0;
  private cupSize: number = 0;
  private cupCount: number = 0;
  private config: WaterConfig;

  /**
   * Создает экземпляр класса DrinkWaterTracker и инициализирует его.
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует приложение, создавая DOM-элементы и устанавливая обработчики событий.
   * @private
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает DOM-элементы приложения и добавляет их на страницу.
   * @private
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='bg-white border shadow rounded max-w-xl w-full p-3 grid gap-4 drink-water'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Drink Water Tracker</h1>
        <form class='grid gap-3' data-form>
           <input class='px-3 py-2 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50' type='number' name='goal' min='1' max='4' step='1'  placeholder='Goal Liters'>
           <select class='px-3 py-2 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50' name='size'>
            <option value>Select cup size</option>
            ${[100, 200, 300, 400, 500, 1000].map(i => `<option value='${i}'>${i}ml</option>`).join('')}
           </select>
           <button class='px-3 py-2 border hover:bg-slate-50' type='submit'>Submit</button>
        </form>

        <div class='hidden gap-3' data-container>
          <h2 class='text-lg'>Goal: <span class='font-bold' data-goal>0</span> Liters</h2>
          <div class='drink-water__cup drink-water__cup--big'>
            <div class='drink-water__remained' data-remained>
              <span data-liters>1.5L</span>
              <small>Remained</small>
            </div>
            <div class='drink-water__percentage' data-percentage></div>
          </div>
          <p class='drink-water__text'>Select how many glasses of water that you have drank</p>
          <ul class='grid grid-cols-6 gap-3' data-caps></ul>
          <button class='px-3 py-2 border hover:bg-slate-50' data-reset>Reset</button>
        </div>
      </div>
    `;

    this.form = root.querySelector('[data-form]')!;
    this.goal = root.querySelector('[data-goal]')!;
    this.cups = root.querySelector('[data-caps]')!;
    this.container = root.querySelector('[data-container]')!;
    this.liters = root.querySelector('[data-liters]')!;
    this.percentage = root.querySelector('[data-percentage]')!;
    this.remained = root.querySelector('[data-remained]')!;
    this.btnReset = root.querySelector('[data-reset]')!;
  }

  /**
   * Устанавливает обработчики событий для элементов приложения.
   * @private
   */
  private setupEventListeners(): void {
    this.config = this.storageGet();
    this.storageDisplay();
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    this.btnReset.addEventListener('click', this.handleReset.bind(this));
  }

  /**
   * Получает сохраненную конфигурацию потребления воды из локального хранилища.
   * @returns {WaterConfig} - Конфигурация потребления воды.
   * @private
   */
  private storageGet(): WaterConfig {
    const storedData = localStorage.getItem('waterConfig');
    return storedData ? JSON.parse(storedData) : {} as WaterConfig;
  }

  /**
   * Сохраняет текущую конфигурацию потребления воды в локальное хранилище.
   * @private
   */
  private storageAdd(): void {
    localStorage.setItem('waterConfig', JSON.stringify(this.config));
  }

  /**
   * Отображает данные о потреблении воды на основе сохраненной конфигурации.
   * @private
   */
  private storageDisplay(): void {
    if (localStorage.getItem('waterConfig')) {
      this.goalLiters = this.config.goal;
      this.cupSize = this.config.size;
      this.cupCount = this.config.count;

      this.renderCups({ size: this.cupSize.toString() });
      this.form.classList.add('hidden');
      this.container.classList.remove('hidden');
      this.container.classList.add('grid');

      this.bigCupHandler();

      for (let i = 0; i < this.config.fulledCups; i++) {
        document.querySelectorAll('[data-cups-item]')[i].classList.add('full');
      }
    }
  }

  /**
   * Рендерит список стаканов в зависимости от размера и количества.
   * @param {Object} options - Опции рендеринга (размер стакана).
   * @private
   */
  private renderCups({ size }: { size: string }): void {
    this.cups.innerHTML = '';
    this.goal.textContent = `${this.goalLiters}`;
    this.liters.textContent = `${this.goalLiters}L`;
    console.log(this.cupCount);
    for (let i = 0; i < this.cupCount; i++) {
      const li = document.createElement('li');
      li.classList.add('drink-water__cup');
      li.setAttribute('data-cups-item', '');
      li.innerHTML = `${size} ml`;
      this.cups.appendChild(li);
    }

    const cups = document.querySelectorAll('[data-cups-item]');

    cups.forEach((cup, idx) => cup.addEventListener('click', () => this.fillCups(idx, cups)));
  }

  /**
   * Обрабатывает событие заполнения стакана.
   * @param {number} idx - Индекс заполняемого стакана.
   * @param {NodeListOf<Element>} cups - Список стаканов.
   * @private
   */
  private fillCups(idx: number, cups: NodeListOf<Element>): void {
    if (idx === this.cupCount && cups[idx].classList.contains('full')) {
      idx--;
    } else if (cups[idx].classList.contains('full') && (cups[idx].nextElementSibling !== null && !cups[idx].nextElementSibling.classList.contains('full'))) {
      idx--;
    }

    cups.forEach((cup, jdx) => jdx <= idx ? cup.classList.add('full') : cup.classList.remove('full'));

    this.config = {
      ...this.config,
      cupDisplayHeight: document.querySelector('.drink-water__cup--big')!.offsetHeight,
      fulledCups: document.querySelectorAll('.drink-water__cup.full').length,
      totalCups: document.querySelectorAll('[data-cups-item]').length,
    };

    this.storageAdd();
    this.bigCupHandler();
  };

  /**
   * Обновляет отображение большого стакана и процентов заполнения.
   * @private
   */
  private bigCupHandler(): void {
    if (this.config.fulledCups === 0) {
      this.percentage.style.visibility = 'hidden';
      this.percentage.style.height = '0';
    } else {
      this.percentage.style.visibility = 'visible';
      this.percentage.style.height = `${this.config.fulledCups / this.config.totalCups * this.config.cupDisplayHeight}px`;
      this.percentage.innerText = `${(this.config.fulledCups / this.config.totalCups * 100).toFixed(1)}%`;
    }

    if ((this.config.fulledCups !== 0 && this.config.totalCups !== 0) && this.config.fulledCups === this.config.totalCups) {
      this.remained.style.visibility = 'hidden';
      this.remained.style.height = '0';
    } else {
      this.remained.style.visibility = 'visible';
      this.liters.innerText = `${(this.goalLiters - (this.cupSize * this.config.fulledCups / 1000)).toFixed(1)}L`;
    }
  }

  /**
   * Обрабатывает отправку формы с целью и размером стакана.
   * @param {Event} event - Событие отправки формы.
   * @private
   */
  private handleSubmit(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const goal = formData.get('goal') as string;
    const size = formData.get('size') as string;

    if (!goal && goal.trim().length === 0 || !size) {
      toast('Please fill the fields', 'warning');
      return;
    }

    this.goalLiters = Number(goal);
    this.cupSize = Number(size);
    console.log(this.goalLiters, this.cupSize);
    this.cupCount = (this.goalLiters / this.cupSize * 1000).toFixed(0);
    this.config = {
      goal: this.goalLiters,
      size: this.cupSize,
      count: Number(this.cupCount),
      cupDisplayHeight: document.querySelector('.drink-water__cup--big')!.offsetHeight,
      fulledCups: 0,
      totalCups: 0,
    };

    this.renderCups({ size });
    form.reset();
    form.classList.add('hidden');
    this.container.classList.remove('hidden');
    this.container.classList.add('grid');
    this.storageAdd();
  }

  /**
   * Обрабатывает событие сброса данных о потреблении воды.
   * @private
   */
  private handleReset(): void {
    localStorage.clear();
    location.reload();
  }
}

new DrinkWaterTracker();
