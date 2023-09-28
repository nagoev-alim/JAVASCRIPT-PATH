import './style.scss';
import axios, { AxiosResponse } from 'axios';
import { toast } from './utils/toast.ts';

/**
 * Интерфейс, представляющий структуру данных о погоде.
 * @interface
 */
interface WeatherData {
  /**
   * Информация о текущих погодных условиях.
   */
  current: {
    /**
     * Состояние погоды в текстовом формате, например, "Ясно".
     * @type {string}
     */
    condition: {
      text: string;
      icon: string;
    };

    /**
     * Флаг, указывающий, является ли день (true) или ночь (false).
     * @type {boolean}
     */
    is_day: boolean;

    /**
     * Температура в градусах Цельсия.
     * @type {number}
     */
    temp_c: number;
  };

  /**
   * Прогноз погоды на несколько дней.
   */
  forecast: {
    /**
     * Массив дней с прогнозами.
     * @type {Array}
     */
    forecastday: {
      /**
       * Дата прогноза в формате "год-месяц-день".
       * @type {string}
       */
      date: string;

      /**
       * Информация о температуре для дня.
       */
      day: {
        /**
         * Минимальная температура в градусах Цельсия.
         * @type {number}
         */
        mintemp_c: number;

        /**
         * Максимальная температура в градусах Цельсия.
         * @type {number}
         */
        maxtemp_c: number;
      };
    }[];
  };

  /**
   * Информация о местоположении.
   */
  location: {
    /**
     * Название города.
     * @type {string}
     */
    name: string;

    /**
     * Регион или штат.
     * @type {string}
     */
    region: string;

    /**
     * Название страны.
     * @type {string}
     */
    country: string;
  };
}

/**
 * Класс для отображения информации о погоде и взаимодействия с ней.
 */
class Weather {
  /**
   * HTML-элемент для отображения деталей о погоде.
   * @private
   */
  private detail: HTMLDivElement;

  /**
   * HTML-форма для ввода города.
   * @private
   */
  private form: HTMLFormElement;

  /**
   * URL для запросов к API погоды.
   * @private
   */
  private readonly URL: string = 'https://api.weatherapi.com/v1/forecast.json?key=2260a9d16e4a45e1a44115831212511&q=';

  /**
   * Конструктор класса Weather.
   * Вызывает метод initialize для инициализации.
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализация класса Weather.
   * Вызывает метод createDOM для создания элементов DOM и setupEventListeners для настройки слушателей событий.
   * @private
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает элементы DOM для отображения информации о погоде.
   * @private
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='bg-white border shadow rounded max-w-md w-full p-3 grid gap-4'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Weather</h1>
        <header>
          <p class='text-center text-lg font-medium'>
            ${new Date().getDate()},
            ${new Date().toLocaleString('en-En', { month: 'short' })},
            ${new Date().getFullYear()}
          </p>
          <form class='grid gap-2' data-form>
            <label class='grid gap-2 place-items-center text-center'>
              <span class='label'>Search for city</span>
              <input class='w-full px-3 py-2 border-2 rounded focus:outline-none focus:border-blue-400' type='text' name='query' placeholder='Enter city name' />
            </label>
            <button class='border px-3 py-2 hover:bg-slate-50' type='submit'>Submit</button>
          </form>
        </header>
        <div class='grid gap-2 place-items-center' data-detail></div>
      </div>
    `;

    this.detail = root.querySelector('[data-detail]')!;
    this.form = root.querySelector('[data-form]')!;
  }

  /**
   * Настраивает слушатели событий, включая получение данных о погоде из локального хранилища.
   * @private
   */
  private setupEventListeners(): void {
    this.storageGet();
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
  }

  /**
   * Получает данные о погоде из локального хранилища (если они есть) и отображает их.
   * @private
   */
  private async storageGet(): Promise<void> {
    if (localStorage.getItem('city')) {
      const button = this.form.querySelector('button')!;
      try {
        button.textContent = 'Loading...';
        const { data }: AxiosResponse<WeatherData> = await axios.get(`${this.URL}${localStorage.getItem('city')}&days=5&aqi=no&alerts=no`);
        button.textContent = 'Submit';
        this.renderData(data);
      } catch (e) {
        toast(`${(e as any).response.data.error.message}`, 'error');
        button.textContent = 'Submit';
        this.form.reset();
        console.error(e);
        return;
      }
    }
  }

  /**
   * Отображает данные о погоде в элементе DOM.
   * @param data - Данные о погоде.
   * @private
   */
  private renderData(data: WeatherData): void {
    if (Object.keys(data).length === 0) return;
    const {
      current: { condition: { text, icon }, is_day, temp_c },
      forecast: { forecastday },
      location: { name, region, country },
    } = data;
    this.detail.innerHTML = `
      <h3 class='text-lg font-bold text-center'>
        <span>${name}</span> ${region}, ${country}
      </h3>
      <p class=''>${text}</p>
      <img src='${icon}' alt='${text}'>
      <p class='text-xl font-medium'>${is_day ? 'Day' : 'Night'}</p>
      <p class='text-2xl font-bold'><span>${temp_c}</span><sup>&deg</sup></p>
      <ul class='grid gap-2 sm:grid-cols-3 sm:gap-5'>
        ${forecastday.map(({ date, day: { mintemp_c, maxtemp_c } }) => `
          <li class='grid gap-1 place-items-center'>
            <p>${date}</p>
            <div>
              <p><span class='font-bold'>Min:</span> ${mintemp_c}<sup>&deg</sup></p>
              <p><span class='font-bold'>Max:</span> ${maxtemp_c}<sup>&deg</sup></p>
            </div>
          </li>`).join('')}
      </ul>
    `;
  }

  /**
   * Обрабатывает отправку формы для поиска города и получения данных о погоде.
   * @param event - Событие отправки формы.
   * @private
   */
  private async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const city = formData.get('query') as string | undefined;
    const button = this.form.querySelector('button')!;
    if (typeof city === 'string') {
      if (city.length === 0) {
        toast('Please fill the field', 'warning');
        return;
      }
      try {
        button.textContent = 'Loading...';
        const { data }: AxiosResponse<WeatherData> = await axios.get(`${this.URL}${city}&days=5&aqi=no&alerts=no`);
        button.textContent = 'Submit';
        this.renderData(data);
        localStorage.setItem('city', city);
      } catch (e) {
        toast(`${(e as any).response.data.error.message}`, 'error');
        button.textContent = 'Submit';
        form.reset();
        return;
      }

      form.reset();
    }
  }
}

// Создание экземпляра класса Weather при загрузке страницы.
new Weather();
