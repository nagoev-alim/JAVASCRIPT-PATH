import './style.scss';
import words from '../src/mock/index';
import { toast } from './utils/toast.ts';

interface IWord {
  word: string,
  hint: string,
}

/**
 * Класс WordScramble представляет игру "Перемешивание слов".
 * @class
 */
class WordScramble {
  private words: IWord[] = [];
  private correctWord: string | null = null;
  private timer: number | null = null;
  private word: HTMLParagraphElement;
  private hint: HTMLSpanElement;
  private time: HTMLSpanElement;
  private input: HTMLInputElement;
  private btnRefresh: HTMLButtonElement;
  private btnCheck: HTMLButtonElement;

  /**
   * Создает экземпляр класса WordScramble и инициализирует его.
   * @constructor
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует компонент, создавая DOM-структуру и устанавливая обработчики событий.
   * @private
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает DOM-структуру игры.
   * @private
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='bg-white border shadow rounded max-w-md w-full p-3 grid gap-4'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Word Scramble Game</h1>
        <div class='grid gap-3'>
          <p class='font-bold text-2xl uppercase tracking-widest text-center' data-word></p>
          <div class='grid gap-3'>
            <p class='font-medium'>Hint: <span class='bg-gray-200 p-1 rounded font-normal' data-hint>A politically identified region</span></p>
            <p class='font-medium'>Time Left: <span class='bg-gray-200 p-1 rounded font-normal' data-time>0s</span></p>
          </div>
          <input class='px-3 py-2 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50' type='text' spellcheck='false' placeholder='Enter a valid word' maxlength='7' data-input>
          <div class='grid grid-cols-2 gap-2'>
            <button class='px-3 py-2 border hover:bg-slate-50' data-refresh>Refresh Word</button>
            <button class='px-3 py-2 border hover:bg-slate-50 disabled:bg-gray-200 disabled:text-gray-300' data-check>Check Word</button>
          </div>
        </div>
      </div>
    `;
    this.word = root.querySelector('[data-word]')!;
    this.hint = root.querySelector('[data-hint]')!;
    this.time = root.querySelector('[data-time]')!;
    this.input = root.querySelector('[data-input]')!;
    this.btnRefresh = root.querySelector('[data-refresh]')!;
    this.btnCheck = root.querySelector('[data-check]')!;
  }

  /**
   * Устанавливает обработчики событий, вызывает инициализацию игры при загрузке страницы.
   * @private
   */
  private setupEventListeners(): void {
    this.words = words;
    this.initGame();

    this.btnRefresh.addEventListener('click', this.initGame.bind(this));
    this.btnCheck.addEventListener('click', this.checkWord.bind(this));
  }

  /**
   * Инициализирует таймер для игры.
   * @param {number} time - Время в секундах.
   * @private
   */
  private initTimer(time: number) {
    this.timer = setInterval(() => {
      if (time > 0) {
        time--;
        return this.time.innerHTML = `${time}s`;
      }

      toast(`Time off! ${this.correctWord!.toUpperCase()} was the correct word`, 'error');
      this.btnCheck.disabled = true;
      clearInterval(this.timer);
    }, 1000);
  }

  /**
   * Инициализирует игру, выбирая случайное слово и подготавливая его для отображения.
   * @private
   */
  private initGame() {
    this.initTimer(30);
    const { word, hint } = this.words[Math.floor(Math.random() * this.words.length)];
    console.log({ word });

    let wordArray = word.split('');

    for (let i = wordArray.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
    }

    this.word.innerText = wordArray.join('');
    this.hint.innerText = hint;
    this.correctWord = word.toLowerCase();
    this.input.value = '';
    this.input.setAttribute('maxlength', String(this.correctWord.length));
    this.btnCheck.disabled = false;
  }

  /**
   * Проверяет введенное пользователем слово.
   * @private
   */
  private checkWord() {
    let word = this.input.value.toLowerCase();
    if (!word) {
      toast('Please enter the word to check!', 'error');
      return;
    }
    if (word !== this.correctWord) {
      toast(`Oops! ${word.toUpperCase()} is not a correct word`, 'warning');
      return;
    }
    toast(`Congrats! The correct word is: ${this.correctWord.toUpperCase()} `, 'success');
    clearInterval(this.timer);
  }
}

// Создаем экземпляр класса WordScramble.
new WordScramble();
