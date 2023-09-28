import './style.scss';

/**
 * Класс для создания эффекта пишущей машинки.
 */
class Typewriter {
  private targetElement: HTMLSpanElement;
  private words: string[];
  private wait: number;
  private txt: string;
  private wordIndex: number;
  private isDeleting: boolean;

  /**
   * @param {string} targetElementSelector - Селектор целевого элемента, в который будет вставлен текст.
   * @param {string} wordsAttribute - Атрибут элемента, содержащий JSON-массив слов для анимации.
   * @param {number} wait - Задержка перед началом следующей анимации.
   */
  constructor(targetElementSelector: string = '', wordsAttribute: string = '', wait: number = 3000) {
    this.createDOM();
    this.targetElement = document.querySelector(targetElementSelector)!;
    if (!this.targetElement) {
      console.error(`Не удалось найти элемент с селектором "${targetElementSelector}"`);
      return;
    }

    const wordsAttributeJson = this.targetElement.getAttribute(wordsAttribute);
    if (!wordsAttributeJson) {
      console.error(`Атрибут "${wordsAttribute}" не найден на элементе.`);
      return;
    }

    this.words = JSON.parse(wordsAttributeJson);
    this.wait = wait;
    this.txt = '';
    this.wordIndex = 0;
    this.isDeleting = false;
    this.initialize();
  }

  /**
   * Инициализация класса.
   * @private
   */
  private initialize(): void {
    this.setupEventListeners();
  }

  /**
   * Создает необходимую структуру DOM.
   * @private
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='bg-white border shadow rounded max-w-md w-full p-3 grid gap-4'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Typewriter Effect</h1>
        <h3 class='text-center'>
          John Doe The
          <span data-target data-wait='2000' data-words='["Developer", "Designer", "Creator"]'></span>
        </h3>
      </div>
    `;
  }

  /**
   * Устанавливает обработчики событий.
   * @private
   */
  private setupEventListeners(): void {
    this.typing();
  }

  /**
   * Осуществляет анимацию текста.
   * @private
   */
  private typing(): void {
    const current = this.wordIndex % this.words.length;
    const fullTxt = this.words[current];

    this.txt = fullTxt.substring(0, this.isDeleting ? this.txt.length - 1 : this.txt.length + 1);

    this.targetElement.innerHTML = `<span class='txt'>${this.txt}</span>`;
    let typeSpeed = 300;

    if (this.isDeleting) typeSpeed /= 2;

    if (!this.isDeleting && this.txt === fullTxt) {
      typeSpeed = this.wait;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.wordIndex++;
      typeSpeed = 500;
    }

    setTimeout(() => this.typing(), typeSpeed);
  }

}

// Пример использования
new Typewriter('[data-target]', 'data-words', 3000);
