import './style.css';

class WordCounter {
  private textarea: HTMLTextAreaElement | null = null;
  private statsText: HTMLDivElement | null = null;

  constructor() {
    // Вызывается метод инициализации при создании экземпляра класса.
    this.initialize();
  }

  // Метод для создания DOM-структуры и добавления элементов в корневой элемент.
  private initialize() {
    this.createDOM();
    this.setupEventListeners();
  }

  // Метод для создания и размещения элементов DOM.
  private createDOM() {
    // Поиск корневого элемента по id 'app'.
    const root = document.querySelector<HTMLDivElement>('#app');
    if (!root) return; // Если элемент не найден, прервать выполнение.

    // Создание и добавление элементов в корневой элемент.
    root.innerHTML = `
      <div class='border shadow rounded max-w-md w-full p-3 grid gap-4'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Word Counter</h1>
        <label aria-label='Enter some text below'>
          <textarea class='resize-none w-full border-2 min-h-[160px] p-2 rounded focus:outline-none focus:border-blue-400' data-textarea placeholder='Enter some text below:'></textarea>
        </label>
        <div class='text-center' data-result>You've written <span class='font-bold'>0</span> words and <span class='font-bold'>0</span> characters.</div>
      </div>
    `;

    // Получение ссылок на созданные элементы.
    this.textarea = root.querySelector<HTMLTextAreaElement>('[data-textarea]');
    this.statsText = root.querySelector<HTMLDivElement>('[data-result]');
  }

  // Метод для установки обработчиков событий.
  private setupEventListeners(): void {
    // Добавление обработчика события 'input' для текстового поля.
    this.textarea?.addEventListener('input', this.handleCount.bind(this));
  }

  // Метод для обработки события 'input' и подсчета слов и символов.
  private handleCount({ target }: Event) {
    // Проверка наличия ссылки на текстовое поле и его типа.
    if (this.statsText && target instanceof HTMLTextAreaElement) {
      const text = target.value.trim();
      const matches = text.match(/\S+/g);
      // Обновление текста с подсчетом слов и символов.
      this.statsText.innerHTML = `You've written <span class='font-bold'>${matches ? matches.length : 0}</span> words and <span class='font-bold'>${text.length}</span> characters.`;
    }
  }
}

// Создание экземпляра класса для инициализации приложения.
new WordCounter();
