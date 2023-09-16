import './style.scss';
import codes from '../src/mock/index.ts';
import 'leaflet/dist/leaflet.css';
import L, { Icon, IconOptions } from 'leaflet';
import axios from 'axios';
import pinIco from '/pin.svg';
import { toast } from './utils/toast.ts';

/**
 * Интерфейс для представления кода и его имени.
 */
interface ICode {
  name: string;
  value: string;
}

/**
 * Интерфейс для представления информации о местоположении.
 */
interface IPlace {
  latitude: number;
  longitude: number;
  state: string;
  placeName: string;
}

/**
 * Главный класс ZipCode для управления приложением.
 */
class ZipCode {
  private form: HTMLFormElement;
  private formBtn: HTMLButtonElement;
  private target: HTMLDivElement;
  private mapTarget: HTMLDivElement;
  private info: HTMLDivElement;
  private readonly URL: string = 'https://api.zippopotam.us/';
  private map: L.Map;
  private marker: Icon<IconOptions>;

  /**
   * Инициализирует приложение ZipCode.
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует приложение, создавая DOM-элементы и настраивая обработчики событий.
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает необходимые DOM-элементы для приложения.
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='bg-white border shadow rounded max-w-md w-full p-3 grid gap-4'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>ZipCode App</h1>
        <form class='grid gap-3' data-form>
          <select class='border-2 px-3 py-2 w-full focus:outline-none focus:border-blue-400' name='source'>
            <option value>Select Country</option>
            ${codes.map(({ name, value }: ICode) => `<option value='${value}'>${name}</option>`).join('')}
          </select>
          <input class='border-2 px-3 py-2 w-full focus:outline-none focus:border-blue-400' type='text' name='zip' placeholder='Zip Code'>
          <button class='border-2 px-3 py-2 hover:bg-slate-50' type='submit' data-submit>Submit</button>
        </form>
        <div class='hidden' data-target>
          <div class='grid gap-3 mb-3' data-info></div>
          <div class='min-h-[300px]' data-map></div>
        </div>
      </div>
    `;

    this.form = root.querySelector('[data-form]')!;
    this.formBtn = root.querySelector('[data-submit]')!;
    this.target = root.querySelector('[data-target]')!;
    this.mapTarget = root.querySelector('[data-map]')!;
    this.info = root.querySelector('[data-info]')!;
  }

  /**
   * Настраивает обработчики событий для отправки формы и инициализации карты.
   */
  private setupEventListeners(): void {
    this.map = L.map(this.mapTarget, {
      center: [51.505, -0.09],
      zoom: 13,
    });
    this.marker = L.icon({
      iconUrl: pinIco,
      iconSize: [30, 40],
    });
    this.mapConfig();
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
  }

  /**
   * Настраивает карту с плитками и начальным маркером.
   */
  private mapConfig(): void {
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(this.map);
    L.marker([51.505, -0.09], { icon: this.marker }).addTo(this.map);
  }

  /**
   * Обрабатывает отправку формы, получает данные и обновляет интерфейс.
   * @param event - Событие отправки формы.
   */
  private handleSubmit(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const source = formData.get('source') as string | undefined;
    const zip = formData.get('zip') as string | undefined;
    if (!source || !zip) {
      toast('Please select country and enter zipcode', 'warning');
      return;
    }
    this.fetchData({ source, zip });
  }

  /**
   * Асинхронно получает данные из API на основе выбранной страны и почтового индекса.
   * @param param - Значения source (страна) и zip (почтовый индекс).
   */
  private async fetchData({ source, zip }: { source: string, zip: string }): Promise<void> {
    try {
      const { data: { places } } = await axios(`${this.URL}${source}/${zip}`);
      const { latitude, longitude, state, ['place name']: placeName } = places[0];
      this.renderData({ latitude, longitude, state, placeName });
    } catch (e) {
      console.log(e);
      toast('Something went wrong', 'error');
      return;
    }
  }

  /**
   * Отображает полученные данные на интерфейсе.
   * @param param - Информация о местоположении.
   */
  private renderData({ latitude, longitude, state, placeName }: IPlace): void {
    this.mapUpdate(latitude, longitude);
    if (this.target.classList.contains('hidden')) {
      this.target.classList.remove('hidden');
    }
    this.info.innerHTML = `
      <h5 class='font-bold text-center'>About Place</h5>
      <p class='grid grid-cols-2'>
        <span class='border font-medium p-2'>Latitude:</span>
        <span class='border p-2'>${latitude}</span>
      </p>
      <p class='grid grid-cols-2'>
        <span class='border font-medium p-2'>Longitude:</span>
        <span class='border p-2'>${longitude}</span>
      </p>
      <p class='grid grid-cols-2'>
        <span class='border font-medium p-2'>State:</span>
        <span class='border p-2'>${state}</span>
      </p>
      <p class='grid grid-cols-2'>
        <span class='border font-medium p-2'>Place Name:</span>
        <span class='border p-2'>${placeName}</span>
      </p>
    `;
  }

  /**
   * Обновляет карту до указанных координат широты и долготы.
   * @param latitude - Широта местоположения.
   * @param longitude - Долгота местоположения.
   */
  private mapUpdate(latitude: number, longitude: number): void {
    this.map.setView([latitude, longitude], 8, { animation: true });
    L.marker([latitude, longitude], { icon: this.marker }).addTo(this.map);
  }
}

// Создание экземпляра ZipCode
new ZipCode();
