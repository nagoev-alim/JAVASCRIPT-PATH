import './style.scss';

/**
 * Класс, представляющий приложение для расслабления.
 */
class Relaxer {
  /**
   * Элемент контейнера приложения.
   * @type {HTMLDivElement}
   * @private
   */
  private container: HTMLDivElement;

  /**
   * Элемент текста приложения.
   * @type {HTMLParagraphElement}
   * @private
   */
  private text: HTMLParagraphElement;

  /**
   * Общее время выполнения анимации в миллисекундах.
   * @type {number}
   * @private
   */
  private totalTime: number = 0;

  /**
   * Время вдоха в миллисекундах.
   * @type {number}
   * @private
   */
  private breatheTime: number = 0;

  /**
   * Время задержки в миллисекундах.
   * @type {number}
   * @private
   */
  private holdTime: number = 0;

  /**
   * Создает экземпляр класса Relaxer и инициализирует его.
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
      <div class='max-w-md w-full p-3 grid gap-4 place-items-center'>
        <div class='relaxer-app'>
          <h2 class='font-bold text-2xl text-center'>Relaxer App</h2>
          <div class='relaxer-app__container' data-container>
            <div class='relaxer-app__circle'></div>

            <p data-text></p>

            <div class='relaxer-app__pointer'>
              <span class='pointer'></span>
            </div>

            <div class='relaxer-app__gradient-circle'></div>
          </div>
        </div>
      </div>
    `;
    this.container = root.querySelector('[data-container]')!;
    this.text = root.querySelector('[data-text]')!;
  }

  /**
   * Устанавливает обработчики событий и настраивает параметры анимации.
   * @private
   */
  private setupEventListeners(): void {
    this.totalTime = 7500;
    this.breatheTime = (this.totalTime / 5) * 2;
    this.holdTime = this.totalTime / 5;

    this.turnAnimation();
    setInterval(this.turnAnimation.bind(this), this.totalTime);
  }

  /**
   * Выполняет анимацию дыхания.
   * @private
   */
  private turnAnimation(): void {
    this.text.innerText = 'Breathe In!';
    this.container.className = 'relaxer-app__container grow';

    setTimeout(() => {
      this.text.innerText = 'Hold';

      setTimeout(() => {
        this.text.innerText = 'Breathe Out!';
        this.container.className = 'relaxer-app__container shrink';
      }, this.holdTime);
    }, this.breatheTime);
  }
}

// Создаем экземпляр класса Relaxer для запуска приложения.
new Relaxer();
