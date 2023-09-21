import './style.scss';
import feather from 'feather-icons';
import { toast } from './utils/toast.ts';
import { v4 as uuidv4 } from 'uuid';

interface INote {
  title: string,
  description: string,
  date: string,
  id: string
}

/**
 * Класс Notes для управления заметками.
 */
class Notes {
  private notesEl: HTMLDivElement;
  private notesBtnCreate: HTMLButtonElement;
  private modal: HTMLDivElement;
  private modalHeading: HTMLHeadingElement;
  private modalBtnClose: HTMLButtonElement;
  private modalForm: HTMLFormElement;
  private notes: INote[] = [];
  private isEdit: boolean = false;
  private editItem: INote | null = null;

  /**
   * Создает экземпляр класса Notes.
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует класс Notes, создавая DOM-элементы и устанавливая обработчики событий.
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает DOM-элементы для приложения заметок.
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='grid gap-4 notes'>
        <h1 class='font-bold text-2xl md:text-4xl'>Notes</h1>
        <div class='grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' data-notes>
          <div class='item item--add bg-white rounded-md border-2 min-h-[175px] grid place-content-center gap-3 p-2'>
            <button class='w-[68px] h-[68px] mx-auto border-2 border-dashed border-black rounded-full' data-create>${feather.icons.plus.toSvg()}</button>
            <p class='font-medium'>Add new note</p>
          </div>
        </div>
        <div class='fixed w-full h-full top-0 left-0 z-[99] bg-neutral-900/40 p-3 grid place-items-center hidden' data-overlay>
          <div class='bg-white border-2 rounded-md p-3 max-w-md w-full'>
            <div class='flex justify-between gap-3 mb-3'>
              <h2 class='font-medium text-lg' data-heading>Add new note</h2>
              <button data-close>${feather.icons.x.toSvg()}</button>
            </div>
            <form class='grid gap-3' data-form>
              <label class='grid gap-1.5'>
                <span class='text-sm font-medium cursor-pointer'>Title</span>
                <input class='px-3 py-2 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50' type='text' name='title'>
              </label>
              <label class='grid gap-1.5'>
                <span class='text-sm font-medium cursor-pointer'>Description</span>
                <textarea class='px-3 py-2 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50 resize-none min-h-[150px]' name='description'></textarea>
              </label>
              <button class='px-3 py-2 border hover:bg-slate-50' type='submit'>Add Note</button>
            </form>
          </div>
        </div>
      </div>
    `;

    this.notesEl = root.querySelector('[data-notes]')!;
    this.notesBtnCreate = root.querySelector('[data-create]')!;
    this.modal = root.querySelector('[data-overlay]')!;
    this.modalHeading = root.querySelector('[data-heading]')!;
    this.modalBtnClose = root.querySelector('[data-close]')!;
    this.modalForm = root.querySelector('[data-form]')!;
  }

  /**
   * Устанавливает обработчики событий для элементов приложения.
   */
  private setupEventListeners(): void {
    this.storageDisplay();
    this.notesBtnCreate.addEventListener('click', this.toggleModal.bind(this));
    this.modal.addEventListener('click', this.toggleModal.bind(this));
    document.addEventListener('keydown', this.toggleModal.bind(this));
    this.modalForm.addEventListener('submit', this.handleSubmit.bind(this));
    this.notesEl.addEventListener('click', this.handleClickNotes.bind(this));
  }

  /**
   * Получает заметки из локального хранилища.
   * @returns {INote[]} Массив объектов заметок или пустой массив, если заметки отсутствуют.
   */
  private storageGet(): INote[] | [] {
    const notes = localStorage.getItem('notes');
    return notes ? JSON.parse(notes) : [];
  }

  /**
   * Отображает заметки, извлеченные из локального хранилища.
   */
  private storageDisplay(): void {
    this.notes = this.storageGet();
    this.renderHTML(this.storageGet());
  }

  /**
   * Переключает модальное окно для создания или редактирования заметок.
   * @param {{ target: HTMLElement, key: string }} params - Объект с параметрами события и клавишей.
   */
  private toggleModal({ target, key }: { target: HTMLDivElement, key: string }): void {
    if (target.matches('[data-create]')) {
      this.modal.classList.remove('hidden');
    }
    if (key === 'Escape' || target.matches('[data-close]') || target.matches('[data-overlay]')) {
      this.modal.classList.add('hidden');
    }
  }

  /**
   * Обрабатывает событие отправки формы для создания или редактирования заметок.
   * @param {Event} event - Объект события отправки формы.
   */
  private handleSubmit(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const isEmptyString = (str: string) => str.trim() === '';

    if (isEmptyString(title) || isEmptyString(description)) {
      toast('Please fill the fields', 'warning');
      return;
    }

    if (!this.isEdit) {
      this.notes = [...this.notes, {
        title,
        description,
        date: new Date().toLocaleDateString('en-EN', { year: 'numeric', month: 'long', day: '2-digit' }),
        id: uuidv4(),
      }];
      toast('The note has been successfully created', 'success');

    } else {
      this.notes = this.notes.map(note =>
        note.id === this.editItem?.id ? { title, description, id: this.editItem.id, date: this.editItem.date } : note,
      );
      toast('The note has been successfully updated', 'success');
      this.modalForm.querySelector('button')!.textContent = 'Add new note';
      this.modalHeading.textContent = 'Add note';
      this.editItem = null;
      this.isEdit = false;
    }
    this.renderHTML(this.notes);
    this.storageAdd(this.notes);
    form.reset();
    this.modal.classList.add('hidden');
  }

  /**
   * Обрабатывает клики на элементах заметок (редактирование, удаление, развертывание).
   * @param {{ target: HTMLButtonElement }} params - Объект с параметрами события и целевым элементом.
   */
  private handleClickNotes({ target }: { target: HTMLButtonElement }) {
    if (target.matches('[data-more]')) {
      target.nextElementSibling!.classList.toggle('hidden');
    }
    if (target.matches('[data-trash]')) {
      const id = target.dataset.trash;
      this.notes = this.notes.filter(note => note.id !== id);
      this.renderHTML(this.notes);
      this.storageAdd(this.notes);
      toast('The note has been successfully deleted', 'success');
    }
    if (target.matches('[data-edit]')) {
      const id = target.dataset.edit;
      target.parentElement!.classList.toggle('hidden');
      this.isEdit = true;
      this.editItem = this.notes.find(note => note.id === id);
      this.modal.classList.remove('hidden');
      this.modalForm.title.value = this.editItem.title;
      this.modalForm.description.value = this.editItem.description;
      this.modalForm.querySelector('button')!.textContent = 'Update note';
      this.modalHeading.textContent = 'Update note';
    }
  }

  /**
   * Отображает заметки на странице.
   * @param {INote[]} notes - Массив объектов заметок для отображения.
   */
  private renderHTML(notes: INote[]) {
    document.querySelectorAll('.item:not(.item--add)').forEach(note => note.remove());

    for (const { title, description, date, id } of notes) {
      const html = `
        <div class='item bg-white rounded-md border-2 min-h-[175px] grid grid-rows-[auto_1fr_auto] gap-1 p-2 max-h-[300px]'>
          <h4 class='font-bold text-lg'>${title}</h4>
          <p class='overflow-auto'>${description}</p>
          <div class='flex justify-between items-center border-t pt-2'>
            <p class='text-sm font-bold'>${new Date(date).toLocaleDateString()}</p>
            <div class='relative flex items-center justify-center'>
              <button data-more>${feather.icons['more-horizontal'].toSvg()}</button>
              <div class='absolute p-1 border bg-white rounded w-[100px] right-0 bottom-8 grid gap-2 hidden z-[10]'>
                <button class='justify-start gap-2' data-edit='${id}'>${feather.icons.edit.toSvg()}Edit</button>
                <button class='justify-start gap-2' data-trash='${id}'>${feather.icons.trash.toSvg()}Delete</button>
              </div>
            </div>
          </div>
        </div>`;

      this.notesEl.querySelector('.item--add')!.insertAdjacentHTML('afterend', html);
    }
  }

  /**
   * Добавляет заметки в локальное хранилище.
   * @param {INote[]} data - Массив объектов заметок для сохранения.
   */
  private storageAdd(data: INote[]) {
    return localStorage.setItem('notes', JSON.stringify(data));
  };
}

// Создание экземпляра класса Notes при загрузке страницы.
new Notes();
