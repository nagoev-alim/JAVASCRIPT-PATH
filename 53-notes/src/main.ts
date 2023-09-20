import './style.scss';
import feather from 'feather-icons';
import { v4 as uuidv4 } from 'uuid';
import { toast } from './utils/toast.ts';

/**
 * Интерфейс заметки.
 * @property {string} text - Текст заметки.
 * @property {string} id - Уникальный идентификатор заметки.
 */

interface Note {
  text: string;
  id: string;
}

/**
 * Класс Notes представляет приложение для создания и управления заметками.
 */
class Notes {
  private btnCreate: HTMLButtonElement;
  private notesEl: HTMLDivElement;
  private notes: Note[];

  /**
   * Создает экземпляр класса Notes и инициализирует его.
   * @constructor
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует приложение, создавая DOM-элементы и настраивая обработчики событий.
   * @private
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает структуру DOM-элементов для отображения заметок.
   * @private
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='grid gap-4'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Notes</h1>
        <div class='main grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4' data-notes>
          <div class='item item--add bg-white border-2 grid place-items-center min-h-[170px] rounded-md'>
            <div class='grid place-items-center gap-2'>
              <button class='p-5 rounded-full border-2 border-black border-dashed' data-create>${feather.icons.plus.toSvg()}</button>
              <p class='font-medium'>Add new note</p>
            </div>
          </div>
        </div>
      </div>
    `;
    this.btnCreate = root.querySelector('[data-create]')!;
    this.notesEl = root.querySelector('[data-notes]')!;
  }

  /**
   * Настраивает обработчики событий для кнопки создания заметки и загружает существующие заметки.
   * @private
   */
  private setupEventListeners(): void {
    this.notes = this.storageGet();
    this.storageDisplay();
    this.btnCreate.addEventListener('click', this.handleCreate.bind(this));
  }

  /**
   * Отображает сохраненные заметки в интерфейсе.
   * @private
   */
  private storageDisplay() {
    const notes = this.storageGet();
    this.renderHTML(notes);
  }

  /**
   * Обработчик создания новой заметки.
   * @private
   */
  private handleCreate() {
    this.notes = [...this.notes, {
      text: '',
      id: uuidv4(),
    }];
    this.renderHTML(this.notes);
    this.storageAdd(this.notes);
    toast('The note has been successfully created', 'success');
  }

  /**
   * Отрисовывает заметки в интерфейсе.
   * @param {Note[]} data - Массив заметок для отображения.
   * @private
   */
  private renderHTML(data: Note[]): void {
    document.querySelectorAll('.item:not(.item--add)').forEach(note => note.remove());

    for (const { text, id } of data) {
      const note = document.createElement('div');
      note.classList.add('item');
      note.innerHTML = `<textarea class='h-full border-2 rounded-md w-full p-2 min-h-[170px] resize-none' data-id='${id}' placeholder='Empty Sticky Note'>${text}</textarea>`;
      this.notesEl.insertBefore(note, this.notesEl.querySelector('.item--add'));
      const textarea = note.querySelector('textarea')!;
      textarea.addEventListener('dblclick', this.handleDelete.bind(this));
      textarea.addEventListener('change', this.handleChange.bind(this));
    }
  }

  /**
   * Обработчик удаления заметки.
   * @param {MouseEvent} event - Событие клика.
   * @private
   */
  private handleDelete(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (confirm('Are you sure you want to delete the note?')) {
      const noteElement = target.closest('.item');
      if (noteElement) {
        const noteId = noteElement.dataset.id;
        if (noteId) {
          this.notes = this.notes.filter(({ id }) => id !== noteId);
          this.storageAdd(this.notes);
          noteElement.remove();
          toast('The note has been successfully deleted', 'success');
        }
      }
    }
  }

  /**
   * Обработчик изменения текста заметки.
   * @param {Event} event - Событие изменения текста в textarea.
   * @private
   */
  private handleChange(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    const noteId = target.dataset.id;
    if (noteId) {
      this.notes = this.notes.map((note) => (note.id === noteId ? { ...note, text: target.value } : note));
      this.renderHTML(this.notes);
      this.storageAdd(this.notes);
    }
  }

  /**
   * Получает заметки из локального хранилища.
   * @returns {Note[]} - Массив сохраненных заметок.
   * @private
   */
  private storageGet(): Note[] {
    const notesData = localStorage.getItem('notes');
    return notesData ? JSON.parse(notesData) : [];
  }

  /**
   * Сохраняет заметки в локальное хранилище.
   * @param {Note[]} data - Массив заметок для сохранения.
   * @private
   */
  private storageAdd(data: Note[]): void {
    localStorage.setItem('notes', JSON.stringify(data));
  }
}

// Создание экземпляра класса Notes при загрузке страницы.
new Notes();
