import './style.scss';

/**
 * Класс для создания интерфейса сохранения текста как файла.
 * @class
 */
class SaveTextAsFile {
  /**
   * Элемент textarea для ввода текста.
   * @private
   * @type {HTMLTextAreaElement}
   */
  private textarea: HTMLTextAreaElement;

  /**
   * Элемент input для ввода имени файла.
   * @private
   * @type {HTMLInputElement}
   */
  private input: HTMLInputElement;

  /**
   * Элемент select для выбора типа файла.
   * @private
   * @type {HTMLSelectElement}
   */
  private select: HTMLSelectElement;

  /**
   * Кнопка для сохранения текста как файла.
   * @private
   * @type {HTMLButtonElement}
   */
  private submit: HTMLButtonElement;

  /**
   * Создает экземпляр класса SaveTextAsFile.
   * @constructor
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует класс, создает DOM элементы и настраивает обработчики событий.
   * @private
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает DOM элементы для интерфейса сохранения текста как файла.
   * @private
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='bg-white border shadow rounded max-w-md w-full p-3 grid gap-4'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Save Text As File</h1>
        <textarea class='px-3 py-2 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50 resize-none min-h-[150px]' spellcheck='false' placeholder='Enter something to save' data-textarea=''>It's Only After We've Lost Everything That We're Free To Do Anything.</textarea>
        <div class='grid gap-3 grid-cols-2'>
          <label>
            <span class='font-medium text-sm'>File name</span>
            <input class='px-3 py-2 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50' type='text' data-input='' placeholder='Enter file name'>
          </label>
          <label>
            <span class='font-medium text-sm'>Save as</span>
            <select class='px-3 py-2 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50' data-select=''>
              <option value='text/plain'>Text File (.txt)</option>
              <option value='text/javascript'>JS File (.js)</option>
              <option value='text/html'>HTML File (.html)</option>
              <option value='image/svg+xml'>SVG File (.svg)</option>
              <option value='application/msword'>Doc File (.doc)</option>
              <option value='application/vnd.ms-powerpoint'>PPT File (.ppt)</option>
            </select>
          </label>
        </div>
        <button class='px-3 py-2 border hover:bg-slate-50' data-submit=''>Save As Text File</button>
      </div>
    `;
    this.textarea = root.querySelector('[data-textarea]')!;
    this.input = root.querySelector('[data-input]')!;
    this.select = root.querySelector('[data-select]')!;
    this.submit = root.querySelector('[data-submit]')!;
  }

  /**
   * Настраивает обработчики событий для кнопки сохранения и выбора типа файла.
   * @private
   */
  private setupEventListeners(): void {
    this.submit.addEventListener('click', this.handleSubmit.bind(this));
    this.select.addEventListener('change', this.handleChange.bind(this));
  }

  /**
   * Обработчик для кнопки сохранения текста как файла.
   * Создает Blob из текста и сохраняет его как файл с указанным именем и типом.
   * @private
   */
  private handleSubmit(): void {
    const blob = new Blob([this.textarea.value], { type: this.select.value });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = this.input.value;
    link.href = url;
    link.click();
  }

  /**
   * Обработчик изменения выбранного типа файла.
   * Обновляет текст на кнопке сохранения с учетом выбранного типа файла.
   * @private
   */
  private handleChange(): void {
    this.submit.innerText = `Save As ${this.select.options[this.select.selectedIndex].text.split(' ')[0]} File`;
  }
}

// Создаем экземпляр класса SaveTextAsFile.
new SaveTextAsFile();
