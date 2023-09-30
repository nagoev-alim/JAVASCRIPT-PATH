import './style.scss';
import mock from '../src/mock/index';
import { toast } from './utils/toast.ts';

/**
 * Интерфейс, представляющий слово и его подсказку.
 * @interface
 */
interface IWord {
  word: string;  // Слово для угадывания
  hint: string;  // Подсказка для слова
}

/**
 * Класс Hangman представляет собой реализацию игры "Виселица".
 */
class Hangman {
  /**
   * @private
   * @type {HTMLDivElement}
   * Элемент для отображения скрытого слова.
   */
  private word: HTMLDivElement;

  /**
   * @private
   * @type {HTMLDivElement}
   * Элемент для отображения подсказки к слову.
   */
  private hint: HTMLDivElement;

  /**
   * @private
   * @type {HTMLDivElement}
   * Элемент для отображения неправильных букв.
   */
  private wrongLettersEl: HTMLDivElement;

  /**
   * @private
   * @type {NodeListOf<HTMLElement>}
   * Список частей фигуры для визуализации проигрыша.
   */
  private figureParts: NodeListOf<HTMLElement>;

  /**
   * @private
   * @type {HTMLButtonElement}
   * Кнопка для начала новой игры.
   */
  private btnPlay: HTMLButtonElement;

  /**
   * @private
   * @type {IWord}
   * Выбранное слово и его подсказка.
   */
  private selectedWord: IWord = mock[Math.floor(Math.random() * mock.length)];

  /**
   * @private
   * @type {string[]}
   * Массив правильно угаданных букв.
   */
  private correctLetters: string[] = [];

  /**
   * @private
   * @type {string[]}
   * Массив неправильных букв.
   */
  private wrongLetters: string[] = [];

  /**
   * Создает экземпляр класса Hangman и инициализирует игру.
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует игру, создавая DOM-элементы и устанавливая обработчики событий.
   * Вызывается при создании экземпляра класса.
   * @private
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает DOM-элементы для отображения игры.
   * @private
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='grid items-start gap-3 game'>
        <h1 class='font-bold text-2xl md:text-4xl'>Hangman</h1>
        <p>Find the hidden word - Enter a letter</p>
        <div class='content bg-white max-w-md mx-auto border rounded'>
          <div data-hint></div>
          <svg height='250' width='200' class='figure'>
            <line x1='60' y1='20' x2='140' y2='20' />
            <line x1='140' y1='20' x2='140' y2='50' />
            <line x1='60' y1='20' x2='60' y2='230' />
            <line x1='20' y1='230' x2='100' y2='230' />
            <circle cx='140' cy='70' r='20' class='figure__part' />
            <line x1='140' y1='90' x2='140' y2='150' class='figure__part' />
            <line x1='140' y1='120' x2='120' y2='100' class='figure__part' />
            <line x1='140' y1='120' x2='160' y2='100' class='figure__part' />
            <line x1='140' y1='150' x2='120' y2='180' class='figure__part' />
            <line x1='140' y1='150' x2='160' y2='180' class='figure__part' />
          </svg>
          <div class='wrong-letters'>
            <p class='h5 hidden'>Wrong letters:</p>
            <div data-wrong-letters></div>
          </div>
          <div class='word' data-word></div>
          <button  data-play class='hidden px-3 py-2 border hover:bg-slate-50'>Play Again</button>
        </div>
      </div>
    `;
    this.word = root.querySelector('[data-word]')!;
    this.hint = root.querySelector('[data-hint]')!;
    this.wrongLettersEl = root.querySelector('[data-wrong-letters]')!;
    this.figureParts = root.querySelectorAll('.figure__part')!;
    this.btnPlay = root.querySelector('[data-play]')!;
  }

  /**
   * Устанавливает обработчики событий для элементов игры.
   * @private
   */
  private setupEventListeners(): void {
    this.displayWord();
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    this.btnPlay.addEventListener('click', () => location.reload());
  }

  /**
   * Отображает скрытое слово и его подсказку.
   * @private
   */
  private displayWord(): void {
    console.log(`Hint:${this.selectedWord.word}`);

    this.hint.innerHTML = `<h3 class='font-bold'>🚀 Hint:</h3> ${this.selectedWord.hint}`;
    this.word.innerHTML = `${this.selectedWord.word.split('').map(letter => `<span class='bg-gray-100'>${this.correctLetters.includes(letter) ? letter : ''}</span>`).join('')}`;

    if (this.word.innerText.replace(/\n/g, '').toLowerCase() === this.selectedWord.word.toLowerCase()) {
      window.removeEventListener('keydown', this.handleKeyDown.bind(this));
      this.btnPlay.classList.remove('hidden');
      document.querySelector('.wrong-letters')!.style.display = 'none';
      document.querySelector('.figure')!.style.display = 'none';
      toast('Congratulations! You won!', 'success');
    }
  }

  /**
   * Обрабатывает нажатие клавиши на клавиатуре.
   * @param {Object} event - Объект события нажатия клавиши.
   * @private
   */
  private handleKeyDown(event: KeyboardEvent): void {
    const { keyCode, key } = event;

    if (keyCode >= 65 && keyCode <= 90) {

      if (this.selectedWord.word.includes(key)) {
        if (!this.correctLetters.includes(key)) {
          this.correctLetters.push(key);
          this.displayWord();
        } else {
          toast('You have already entered this letter', 'warning');
        }
      } else {
        if (!this.wrongLetters.includes(key)) {
          this.wrongLetters.push(key);
          this.updateLetters();
        } else {
          toast('You have already entered this letter', 'warning');
        }
      }
    }
  }

  /**
   * Обновляет отображение неправильных букв и фигуры.
   * @private
   */
  private updateLetters(): void {
    if (this.wrongLetters.length > 0) {
      document.querySelector('.wrong-letters p')!.classList.remove('hidden');
    }
    this.wrongLettersEl.innerHTML = `${this.wrongLetters.map(letter => `<span class='h5'>${letter}</span>`).join('')}`;
    this.figureParts.forEach((part, index) => {
      part.style.display = index < this.wrongLetters.length ? 'block' : 'none';
    });
    if (this.wrongLetters.length === this.figureParts.length) {
      window.removeEventListener('keydown', this.handleKeyDown.bind(this));
      this.btnPlay.classList.remove('hidden');
      document.querySelector('.wrong-letters')!.style.display = 'none';
      document.querySelector('.figure')!.style.display = 'none';
      toast('Unfortunately you lost.', 'error');
    }
  }
}

// Создаем экземпляр игры при загрузке страницы.
new Hangman();
