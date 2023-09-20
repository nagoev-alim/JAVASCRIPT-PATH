import './style.scss';
import feather from 'feather-icons';
import { marked } from 'marked';

/**
 * Класс Notes представляет простое приложение для создания и хранения заметок.
 */
class Notes {
  private btnAdd: HTMLButtonElement;
  private notes: HTMLDivElement;

  /**
   * Создает новый экземпляр класса Notes и инициализирует его.
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
   * Создает структуру DOM-элементов для отображения заметок.
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='grid gap-4'>
        <div class='flex justify-between gap-2'>
          <h1 class='font-bold text-2xl md:text-4xl'>Notes</h1>
          <button class='p-2 bg-white hover:bg-slate-50 border' data-add>${feather.icons.plus.toSvg()}</button>
        </div>
        <div class='grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' data-list></div>
      </div>
    `;

    this.btnAdd = root.querySelector('[data-add]')!;
    this.notes = root.querySelector('[data-list]')!;
  }

  /**
   * Настраивает обработчики событий для кнопки добавления заметки и загружает существующие заметки.
   */
  private setupEventListeners(): void {
    this.storageDisplay();
    this.btnAdd.addEventListener('click', () => this.handleAdd());
  }

  /**
   * Обработчик добавления новой заметки.
   * @param {string} text - Текст новой заметки (по умолчанию пустой).
   */
  private handleAdd(text: string = ''): void {
    const div = document.createElement('div');
    div.classList.add('border', 'bg-white', 'rounded');
    div.innerHTML = `
      <div class='flex gap-2 justify-end p-1 bg-neutral-100 border-b'>
       <button class='p-1.5 bg-white border hover:bg-slate-50' data-edit>${feather.icons.edit.toSvg()}</button>
       <button class='p-1.5 bg-white border hover:bg-slate-50' data-delete>${feather.icons.trash.toSvg()}</button>
      </div>
      <div class='markdown-body min-h-[150px] ${text ? '' : 'hidden'}'></div>
      <textarea class='min-h-[150px] resize-none px-3 py-2 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50 ${text ? 'hidden' : ''}'></textarea>
    `;

    const btnEdit = div.querySelector<HTMLButtonElement>('[data-edit]')!;
    const btnDelete = div.querySelector<HTMLButtonElement>('[data-delete]')!;
    const content = div.querySelector<HTMLDivElement>('.markdown-body')!;
    const textarea = div.querySelector<HTMLTextAreaElement>('textarea')!;

    textarea.value = text;
    console.log(text);
    content.innerHTML = marked(text);
    textarea.focus();

    btnDelete.addEventListener('click', (): void => {
      if (confirm('Are you sure?')) {
        div.remove();
        this.storageAdd();
      }
    });

    btnEdit.addEventListener('click', (): void => {
      content.classList.toggle('hidden');
      textarea.classList.toggle('hidden');
    });

    textarea.addEventListener('input', (event): void => {
      const target = event.target as HTMLTextAreaElement;
      this.storageAdd();
      content.innerHTML = marked(target.value);
    });

    this.notes.appendChild(div);
  }

  /**
   * Сохраняет тексты заметок в локальное хранилище браузера.
   */
  private storageAdd(): void {
    const notesText = document.querySelectorAll<HTMLTextAreaElement>('textarea')!;
    const notes: string[] = [];
    notesText.forEach(({ value }) => notes.push(value));
    localStorage.setItem('notes', JSON.stringify(notes));
  }

  /**
   * Получает тексты заметок из локального хранилища.
   * @returns {string[]} - Массив текстов заметок.
   */
  private storageGet(): string[] {
    const notesData = localStorage.getItem('notes');
    return notesData ? JSON.parse(notesData) : [];
  };

  /**
   * Отображает сохраненные заметки при загрузке приложения.
   */
  private storageDisplay(): void {
    const notes = this.storageGet();
    notes.forEach(note => this.handleAdd(note));
  };
}

// Создание экземпляра класса Notes при загрузке страницы.
new Notes();
