import './style.scss';
import w from '../public/images/tom1.png';
import a from '../public/images/tom2.png';
import s from '../public/images/tom3.png';
import d from '../public/images/tom4.png';
import j from '../public/images/snare.png';
import k from '../public/images/crash.png';
import l from '../public/images/kick.png';
import sound1 from '../public/sounds/tom-1.mp3';
import sound2 from '../public/sounds/tom-2.mp3';
import sound3 from '../public/sounds/tom-3.mp3';
import sound4 from '../public/sounds/tom-4.mp3';
import sound5 from '../public/sounds/crash.mp3';
import sound6 from '../public/sounds/snare.mp3';
import sound7 from '../public/sounds/kick-bass.mp3';

/**
 * Класс, представляющий приложение "Ударная установка".
 */
class DrumKit {
  /**
   * Элемент списка ударных инструментов.
   * @type {HTMLUListElement}
   * @private
   */
  private list: HTMLUListElement;

  /**
   * Создает экземпляр класса DrumKit и инициализирует его.
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует приложение, создавая DOM-элементы и устанавливая обработчики событий.
   * @private
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает DOM-элементы приложения и добавляет их на страницу.
   * @private
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='bg-white border shadow rounded max-w-8xl w-full p-3 grid gap-4 drum-kit'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Drum 🥁 Kit</h1>
        <ul class='' data-list>
          <li class='w' style="background-image: url('${w}')" data-w>w</li>
          <li class='a' style="background-image: url('${a}')" data-a>a</li>
          <li class='s' style="background-image: url('${s}')" data-s>s</li>
          <li class='d' style="background-image: url('${d}')" data-d>d</li>
          <li class='j' style="background-image: url('${j}')" data-j>j</li>
          <li class='k' style="background-image: url('${k}')" data-k>k</li>
          <li class='l' style="background-image: url('${l}')" data-l>l</li>
        </ul>
      </div>
    `;
    this.list = root.querySelector('[data-list]')!;
  }

  /**
   * Устанавливает обработчики событий для элементов ударной установки.
   * @private
   */
  private setupEventListeners(): void {
    this.list.addEventListener('click', this.keyHandler.bind(this));
    window.addEventListener('keydown', this.keyHandler.bind(this));
  }

  /**
   * Обработчик событий нажатия клавиши или клика на элемент ударной установки.
   * @param {KeyboardEvent} event - Событие клавиши.
   * @private
   */
  private keyHandler(event: KeyboardEvent): void {
    const target = event.target as HTMLLIElement;
    const code = event.code;

    if (code === 'KeyW' || target.classList.contains('w')) {
      this.animate('[data-w]');
      this.play(sound1);
    }
    if (code === 'KeyA' || target.classList.contains('a')) {
      this.animate('[data-a]');
      this.play(sound2);
    }
    if (code === 'KeyS' || target.classList.contains('s')) {
      this.animate('[data-s]');
      this.play(sound3);
    }
    if (code === 'KeyD' || target.classList.contains('d')) {
      this.animate('[data-d]');
      this.play(sound4);
    }
    if (code === 'KeyK' || target.classList.contains('k')) {
      this.animate('[data-k]');
      this.play(sound5);
    }
    if (code === 'KeyJ' || target.classList.contains('j')) {
      this.animate('[data-j]');
      this.play(sound6);
    }
    if (code === 'KeyL' || target.classList.contains('l')) {
      this.animate('[data-l]');
      this.play(sound7);
    }
  }

  /**
   * Воспроизводит звук ударного инструмента.
   * @param {string} file - Путь к аудиофайлу.
   * @private
   */
  private play(file: string): void {
    new Audio(file).play();
  }

  /**
   * Анимирует нажатие клавиши или элемента ударной установки.
   * @param {string} target - Селектор цели анимации.
   * @private
   */
  private animate(target: string): void {
    const element = document.querySelector(target) as HTMLElement;
    element.classList.add('pressed');
    setTimeout(() => element.classList.remove('pressed'), 300);
  }
}

new DrumKit();
