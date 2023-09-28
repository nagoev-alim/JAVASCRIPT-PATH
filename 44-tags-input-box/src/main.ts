import './style.scss';
import feather from 'feather-icons';
import { toast } from './utils/toast.ts';

interface TagsInputOptions {
  maxTags: number;
}

/**
 * Класс TagsInput представляет элемент ввода тегов.
 * @class
 * @param {TagsInputOptions} options - Опции для настройки элемента ввода тегов.
 */
class TagsInput {
  private tagsEl: HTMLDivElement;
  private inputTag: HTMLInputElement;
  private detailCount: HTMLSpanElement;
  private btnRemove: HTMLButtonElement;
  private maxTags: number;
  private tags: string[];

  /**
   * Создает экземпляр класса TagsInput.
   * @constructor
   * @param {TagsInputOptions} options - Опции для настройки элемента ввода тегов.
   */
  constructor(options?: TagsInputOptions) {
    this.maxTags = options?.maxTags || 10;
    this.initialize();
  }

  /**
   * Инициализирует элемент ввода тегов, создавая DOM-элементы и настраивая обработчики событий.
   * @private
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает DOM-элементы для отображения элемента ввода тегов.
   * @private
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='bg-white border shadow rounded max-w-md w-full p-3 grid gap-4'>
        <h1 class='flex items-center gap-3 font-bold text-2xl md:text-3xl'>
          ${feather.icons.tag.toSvg()}
          <span>Tags Input Box</span>
        </h1>
        <div class='grid gap-3'>
          <p>Press enter or add a comma after each tag</p>
          <div class='flex gap-2 flex-wrap' data-tags>
            <input class='px-3 py-2 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50' type='text' spellcheck='false' data-input>
          </div>
        </div>
        <div class='flex items-center justify-between gap-3'>
          <p><span data-count>10</span> tags are remaining</p>
          <button class='px-3 py-2 border hover:bg-slate-50' data-remove>Remove All</button>
        </div>
      </div>
    `;

    this.tagsEl = root.querySelector('[data-tags]')!;
    this.inputTag = root.querySelector('[data-input]')!;
    this.detailCount = root.querySelector('[data-count]')!;
    this.btnRemove = root.querySelector('[data-remove]')!;
  }

  /**
   * Настраивает обработчики событий для элементов интерфейса.
   * @private
   */
  private setupEventListeners(): void {
    this.tags = this.storageGet();
    this.countTags();
    this.createTag();

    this.inputTag.addEventListener('keyup', this.handleAddTag.bind(this));
    this.btnRemove.addEventListener('click', this.handleRemoveAll.bind(this));
  }

  /**
   * Получает сохраненные теги из локального хранилища.
   * @private
   * @returns {string[]} Массив строк с сохраненными тегами.
   */
  private storageGet(): string[] {
    const storedValue = localStorage.getItem('tags');
    return JSON.parse(storedValue || '["dev", "react"]');
  }

  /**
   * Устанавливает теги в локальное хранилище.
   * @private
   * @param {string[]} tags - Массив строк с тегами для сохранения.
   */
  private storageSet(tags: string[]): void {
    localStorage.setItem('tags', JSON.stringify(tags));
  };

  /**
   * Обновляет отображение оставшегося количества тегов.
   * @private
   */
  private countTags(): void {
    this.inputTag.focus();
    this.detailCount.innerText = String(this.maxTags - this.tags.length);
  }

  /**
   * Создает DOM-элементы для отображения добавленных тегов.
   * @private
   */
  private createTag(): void {
    this.tagsEl.querySelectorAll('[data-tag]').forEach(i => i.remove());

    this.tags.slice().forEach(tag => {
      const tagElement = document.createElement('div');
      tagElement.classList.add('flex', 'bg-gray-100', 'p-1.5', 'rounded');
      tagElement.setAttribute('data-tag', '');
      tagElement.innerHTML = `
          <span>${tag}</span>
          <div data-remove><span class='pointer-events-none'>${feather.icons.x.toSvg()}</span></div>
      `;

      this.tagsEl.insertBefore(tagElement, this.inputTag);
      tagElement.querySelector('[data-remove]')!.addEventListener('click', this.handleRemoveTag.bind(this));
    });

    this.countTags();
  }

  /**
   * Обрабатывает событие удаления тега.
   * @private
   * @param {MouseEvent} event - Событие клика по кнопке удаления тега.
   */
  private handleRemoveTag(event: MouseEvent): void {
    const target = event.target as HTMLDivElement;
    const tag = target.closest('.flex')!.querySelector('span')!.textContent as string;
    let index = this.tags.indexOf(tag);
    this.tags = [...this.tags.slice(0, index), ...this.tags.slice(index + 1)];
    target.closest('.flex')!.remove();
    this.storageSet(this.tags);
    this.countTags();
  }

  /**
   * Обрабатывает событие добавления тега.
   * @private
   * @param {Object} param - Параметры события.
   * @param {HTMLInputElement} param.target - HTML-элемент ввода тега.
   * @param {string} param.key - Нажатая клавиша.
   */
  private handleAddTag({ target, key }: { target: HTMLInputElement, key: string }): void {
    if (key === 'Enter') {
      let tag = target.value.replace(/\s+/g, ' ');
      if (tag.length > 1 && !this.tags.includes(tag)) {
        if (this.tags.length < 10) {
          tag.split(',').forEach(tag => {
            this.tags.push(tag);
            this.storageSet(this.tags);
            this.createTag();
          });
        }
      }
      target.value = '';
    }
  }

  /**
   * Обрабатывает событие удаления всех тегов.
   * @private
   */
  private handleRemoveAll(): void {
    if (confirm('Are you sure you want to delete all the tags?')) {
      this.tags.length = 0;
      this.tagsEl.querySelectorAll('[data-tag]').forEach(tag => tag.remove());
      this.countTags();
      localStorage.clear();
      toast('All tags are successfully deleted', 'success');
    }
  }
}

new TagsInput();
