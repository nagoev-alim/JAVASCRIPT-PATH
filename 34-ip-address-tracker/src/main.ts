import './style.scss';
import 'leaflet/dist/leaflet.css';
import L, { Icon, IconOptions } from 'leaflet';
import pinIco from '/pin.svg';
import axios from 'axios';
import { toast } from './utils/toast.ts';

/**
 * Интерфейс для структуры объектов в массиве `mock`.
 * @interface
 */
interface IMock {
  name: string,
  value: string,
  dataType: string,
}

/**
 * Массив моковых данных для отображения информации об IP-адресе.
 * @type {IMock[]}
 */
const mock: IMock[] = [
  {
    name: 'IP Address',
    value: '101.11.201.22',
    dataType: 'ip',
  },
  {
    name: 'Location',
    value: 'TW Taiwan',
    dataType: 'location',
  },
  {
    name: 'Timezone',
    value: 'UTC +08:00',
    dataType: 'timezone',
  },
  {
    name: 'ISP',
    value: 'Taiwan Mobile Co., Ltd.',
    dataType: 'isp',
  },
];

/**
 * Главный класс приложения для отслеживания информации об IP-адресах.
 */
class IPAddressTracker {
  private form: HTMLFormElement;
  private mapEl: HTMLDivElement;
  private ipField: HTMLParagraphElement;
  private locationField: HTMLParagraphElement;
  private timezoneField: HTMLParagraphElement;
  private ispField: HTMLParagraphElement;
  private map: L.Map;
  private marker: Icon<IconOptions>;

  /**
   * Создает экземпляр класса IPAddressTracker.
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализация приложения.
   * Создает DOM-структуру, настраивает обработчики событий и запускает загрузку данных.
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает структуру DOM-элементов для приложения и отображает ее на странице.
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='bg-white border shadow rounded max-w-md w-full p-3 grid gap-4'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>IP Address Tracker</h1>
        <form data-form>
          <input class='px-3 py-2 border rounded w-full bg-slate-50 focus:outline-none focus:border-blue-400' type='text' name='query' placeholder='Search for any IP address or domain'>
        </form>
        <ul class='grid gap-3 place-items-center text-center sm:grid-cols-2'>
          ${mock.map(({ name, value, dataType }) => `
            <li class='grid gap-1'>
              <p class='font-bold'>${name}</p>
              ${dataType === 'timezone' ? `<p>UTC <span data-${dataType}>${value}</span></p>` : `<p data-${dataType}>${value}</p>`}
            </li>
          `).join('')}
        </ul>
        <div class='map min-h-[300px]' data-map></div>
      </div>
    `;

    this.form = root.querySelector('[data-form]')!;
    this.mapEl = root.querySelector('[data-map]')!;
    this.ipField = root.querySelector('[data-ip]')!;
    this.locationField = root.querySelector('[data-location]')!;
    this.timezoneField = root.querySelector('[data-timezone]')!;
    this.ispField = root.querySelector('[data-isp]')!;
  }

  /**
   * Настраивает обработчики событий, инициализирует карту и отправляет запрос на получение данных об IP-адресе.
   */
  private setupEventListeners(): void {
    this.map = L.map(this.mapEl, {
      center: [51.505, -0.09],
      zoom: 13,
    });
    this.marker = L.icon({
      iconUrl: pinIco,
      iconSize: [30, 40],
    });
    this.fetchData(this.storageGet());
    this.mapConfig();
    this.form.addEventListener('submit', this.handleSubmit);
  }

  /**
   * Сохраняет IP-адрес в локальное хранилище.
   * @param {string} ip - IP-адрес для сохранения.
   */
  private storageSet(ip: string): void {
    localStorage.setItem('ip-address', JSON.stringify(ip));
  };

  /**
   * Получает IP-адрес из локального хранилища.
   * @returns {string} - IP-адрес или значение по умолчанию, если отсутствует.
   */
  private storageGet(): string {
    const storedValue = localStorage.getItem('ip-address') as string;
    return storedValue ? JSON.parse(storedValue) : '101.11.201.22';
  }

  /**
   * Отправляет запрос на сервер для получения данных об IP-адресе и обновляет интерфейс приложения.
   * @param {string} address - IP-адрес для запроса.
   */
  private async fetchData(address: string): Promise<void> {
    try {
      const {
        data: {
          ip,
          isp,
          location: { country, region, timezone, lat, lng },
        },
      } = await axios.get(`https://geo.ipify.org/api/v2/country,city?apiKey=at_D5MQsxItBHTAuuGXJEefzDtDNm2QH&ipAddress=${address}`);

      this.ipField.textContent = ip;
      this.locationField.textContent = `${country} ${region}`;
      this.timezoneField.textContent = timezone;
      this.ispField.textContent = isp;

      this.map.setView([lat, lng]);
      L.marker([lat, lng], { icon: this.marker }).addTo(this.map);

      if (window.matchMedia('(max-width: 992px)').matches) this.addOffset();

    } catch (e) {
      console.log(e);
      toast('Something wrong, look console', 'error');
    }
  };

  /**
   * Добавляет смещение к карте для улучшенного отображения на маленьких экранах.
   */
  private addOffset(): void {
    const offsetY = this.map.getSize().y * 0.15;
    this.map.panBy([0, -offsetY], { animate: false });
  };

  /**
   * Настраивает параметры карты и отображает маркеры.
   */
  private mapConfig(): void {
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(this.map);
    L.marker([51.505, -0.09], { icon: this.marker }).addTo(this.map);
  };

  /**
   * Обрабатывает отправку формы, валидирует IP-адрес и обновляет данные.
   * @param {Event} event - Событие отправки формы.
   */
  private handleSubmit(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const ip = formData.get('query') as string;
    if (!/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip)) {
      toast('You have entered an invalid IP address', 'warning');
      return;
    }
    this.storageSet(ip);
    this.fetchData(ip);
  }
}

// Запуск приложения при загрузке страницы.
new IPAddressTracker();
