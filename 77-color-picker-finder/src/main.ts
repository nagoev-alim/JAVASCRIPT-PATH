import './style.scss';
import 'vanilla-colorful';
import { toast } from './utils/toast.ts';
import axios from 'axios';

/**
 * Интерфейс для данных о цвете от API.
 * @interface
 */
interface ColorData {
  name: string; // Название цвета
  hex: string; // HEX-значение цвета
  rgb: {
    r: number; // Красная составляющая (0-255)
    g: number; // Зеленая составляющая (0-255)
    b: number; // Синяя составляющая (0-255)
  };
  hsl: {
    h: number; // Тон (0-360)
    s: number; // Насыщенность (0-100)
    l: number; // Светлота (0-100)
  };
  luminance: number; // Светимость
  luminanceWCAG: number; // Светимость по стандарту WCAG
  lab: {
    l: number; // L-компонента цвета (0-100)
    a: number; // a-компонента цвета (-128-127)
    b: number; // b-компонента цвета (-128-127)
  };
}

/**
 * Класс Picker представляет собой компонент для выбора и анализа цветов.
 * @class
 */
class Picker {
  private submitBtn: HTMLButtonElement;
  private input: HTMLInputElement;
  private result: HTMLDivElement;
  private picker: HTMLElement;

  /**
   * Создает экземпляр класса Picker и инициализирует компонент.
   * @constructor
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует компонент, создавая DOM-элементы и устанавливая обработчики событий.
   * @private
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает DOM-элементы для отображения компонента.
   * @private
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='bg-white border shadow rounded max-w-xl w-full p-3 grid gap-4'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Color Finder</h1>
        <div class='grid gap-3'>
          <div class='grid gap-3'>
            <hex-color-picker color='#1e88e5'></hex-color-picker>
            <input class='text-center font-bold px-3 py-2 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50' type='text' disabled value='#1e88e5' data-input>
            <button class='px-3 py-2 border hover:bg-slate-50' data-submit>Submit</button>
          </div>
          <div class='result grid gap-3'></div>
        </div>
      </div>
    `;
    this.submitBtn = root.querySelector('[data-submit]')!;
    this.input = root.querySelector('[data-input]')!;
    this.result = root.querySelector('.result')!;
    this.picker = root.querySelector('hex-color-picker')!;
  }

  /**
   * Устанавливает обработчики событий для элементов компонента.
   * @private
   */
  private setupEventListeners(): void {
    this.picker.addEventListener('color-changed', ({ detail: { value } }) => this.input.value = value);
    this.submitBtn.addEventListener('click', this.handleSubmit.bind(this));
  }

  /**
   * Обрабатывает отправку формы и анализирует выбранный цвет.
   * @private
   */
  private async handleSubmit(): Promise<void> {
    this.result.classList.remove('open');
    this.submitBtn.textContent = 'Loading...';

    try {
      const { data: { colors } } = await axios.get(`https://api.color.pizza/v1/?values=${this.input.value.split('#')[1]}`);
      const color: ColorData = colors[0];
      this.result.innerHTML = `
        <h3 class='text-center font-bold text-lg'>About <span>${color.hex}</span></h3>
        <img class='w-[200px] border mx-auto' src='https://api.color.pizza/v1/swatch/?color=${this.input.value.split('#')[1]}&name=${color.name}' alt='${color.name}'>
        <div class='table'>
          <p class='grid grid-cols-2'> <span class='p-3 border font-medium'>Color Name</span><span class='p-3 border'>${color.name}</span></p>
          <p class='grid grid-cols-2'> <span class='p-3 border font-medium'>RGB Values</span><span class='p-3 border'>(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})</span></p>
          <p class='grid grid-cols-2'> <span class='p-3 border font-medium'>HSL Values</span><span class='p-3 border'>(${color.hsl.h.toFixed(0)}, ${color.hsl.s.toFixed(0)}%, ${color.hsl.l.toFixed(0)}%)</span></p>
          <p class='grid grid-cols-2'> <span class='p-3 border font-medium'>LAB Values</span><span class='p-3 border'>(${color.lab.l}, ${color.lab.a}, ${color.lab.b})</span></p>
          <p class='grid grid-cols-2'> <span class='p-3 border font-medium'>Luminances</span><span class='p-3 border'>(${color.luminance})</span></p>
          <p class='grid grid-cols-2'> <span class='p-3 border font-medium'>Luminance WCAG</span><span class='p-3 border'>(${color.luminanceWCAG})</span></p>
        </div>
      `;

      setTimeout(() => {
        this.result.classList.add('open');
        this.submitBtn.textContent = 'Submit';
      }, 1200);

    } catch (e) {
      toast('Something went wrong, open developer console', 'error');
      console.log(e);
      this.result.classList.remove('open');
      this.result.innerHTML = '';
      this.submitBtn.textContent = 'Submit';
    }
  }
}

// Создаем экземпляр класса Picker при загрузке страницы.
new Picker();
