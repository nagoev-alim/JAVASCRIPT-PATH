import './style.scss';
import feather from 'feather-icons';
import { toast } from './utils/toast.ts';

/**
 * Класс ColorGenerator для создания и управления генератором цветов.
 */
class ColorGenerator {
  /**
   * Массив опций для генерации цвета.
   * @type {(string | number)[]}
   * @private
   */
  private options: (string | number)[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'];

  /**
   * Корневой элемент приложения.
   * @type {HTMLDivElement}
   * @private
   */
  private parent: HTMLDivElement;

  /**
   * Элемент, отображающий текущий цвет.
   * @type {HTMLParagraphElement}
   * @private
   */
  private current: HTMLParagraphElement;

  /**
   * Элемент-палитра для отображения текущего цвета.
   * @type {HTMLDivElement}
   * @private
   */
  private area: HTMLDivElement;

  /**
   * Кнопка для генерации нового цвета.
   * @type {HTMLButtonElement}
   * @private
   */
  private btnGenerate: HTMLButtonElement;

  /**
   * Кнопка для копирования текущего цвета в буфер обмена.
   * @type {HTMLButtonElement}
   * @private
   */
  private btnCopy: HTMLButtonElement;

  /**
   * Создает экземпляр класса ColorGenerator и инициализирует приложение.
   * @constructor
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует приложение, создавая необходимый DOM и настраивая обработчики событий.
   * @private
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает необходимую структуру DOM для приложения.
   * @private
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='max-w-md w-full p-3 grid gap-4 color-generator'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Color Generator</h1>
        <div class='bg-white border shadow p-2 max-w-max  mx-auto rounded grid gap-2 place-content-center text-center'>
          <div class='w-[170px] h-[170px] border bg-[#A1B5C1]' data-area></div>
          <p class='font-bold ' data-current>#A1B5C1</p>
        </div>
        <div class='grid place-items-center gap-3'>
          <button class='px-3 py-2 bg-purple-500 font-medium text-white hover:bg-purple-400' data-pick>Generate color</button>
          <button class='px-3 py-2 font-medium bg-green-500 text-white hover:bg-green-400' data-copy>Click to copy</button>
        </div>
        <p class='text-center'>Or just press the <span class='font-bold'>"Spacebar"</span> to generate new palettes.</p>
      </div>
    `;
    this.parent = root.querySelector('.color-generator')!;
    this.current = root.querySelector('[data-current]')!;
    this.area = root.querySelector('[data-area]')!;
    this.btnGenerate = root.querySelector('[data-pick]')!;
    this.btnCopy = root.querySelector('[data-copy]')!;
  }

  /**
   * Настраивает обработчики событий для кнопок и клавиши пробела.
   * @private
   */
  private setupEventListeners(): void {
    this.btnGenerate.addEventListener('click', this.handleSetColor.bind(this));
    this.btnCopy.addEventListener('click', this.handleCopyColor.bind(this));
    document.addEventListener('keydown', ({ code }) => code === 'Space' ? this.handleCopyColor() : false);
  }

  /**
   * Обработчик события для установки нового цвета.
   * @private
   */
  private handleSetColor(): void {
    this.current.textContent = this.area.style.backgroundColor = this.handleGenerate();
  }

  /**
   * Генерирует случайный цвет в формате "#RRGGBB".
   * @returns {string} Сгенерированный цвет.
   * @private
   */
  private handleGenerate(): string {
    let color = '#';
    for (let i = 0; i < 6; i++) color += this.options[Math.floor(Math.random() * this.options.length)];
    return color;
  }

  /**
   * Обработчик события для копирования текущего цвета в буфер обмена.
   * @private
   */
  private handleCopyColor(): void {
    navigator.clipboard.writeText(this.current.innerText);
    toast('Success copy to clipboard', 'success');
  }
}

// Создание экземпляра класса ColorGenerator для запуска приложения.
new ColorGenerator();
