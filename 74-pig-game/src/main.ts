import './style.scss';
import { icons } from 'feather-icons';
import { getRandomNumber } from './utils/getRandomNumber';

/**
 * Класс Dice представляет собой реализацию игры в кости (Dice game).
 * Игра включает двух игроков, которые бросают кубики, собирая очки.
 * Цель - набрать 100 или более очков.
 */
class Dice {
  /**
   * @private
   * @type {HTMLDivElement}
   * Элемент для отображения информации о первом игроке.
   */
  private playerF: HTMLDivElement;

  /**
   * @private
   * @type {HTMLDivElement}
   * Элемент для отображения информации о втором игроке.
   */
  private playerS: HTMLDivElement;

  /**
   * @private
   * @type {HTMLParagraphElement}
   * Элемент для отображения счета первого игрока.
   */
  private scoreF: HTMLParagraphElement;

  /**
   * @private
   * @type {HTMLParagraphElement}
   * Элемент для отображения счета второго игрока.
   */
  private scoreS: HTMLParagraphElement;

  /**
   * @private
   * @type {HTMLParagraphElement}
   * Элемент для отображения текущего счета первого игрока.
   */
  private currentF: HTMLParagraphElement;

  /**
   * @private
   * @type {HTMLParagraphElement}
   * Элемент для отображения текущего счета второго игрока.
   */
  private currentS: HTMLParagraphElement;

  /**
   * @private
   * @type {HTMLImageElement}
   * Элемент для отображения изображения кубика.
   */
  private diceImg: HTMLImageElement;

  /**
   * @private
   * @type {HTMLButtonElement}
   * Кнопка для начала новой игры.
   */
  private btnGame: HTMLButtonElement;

  /**
   * @private
   * @type {HTMLButtonElement}
   * Кнопка для броска кубика.
   */
  private btnRoll: HTMLButtonElement;

  /**
   * @private
   * @type {HTMLButtonElement}
   * Кнопка для удержания текущего счета.
   */
  private btnHold: HTMLButtonElement;

  /**
   * @private
   * @type {NodeListOf<HTMLButtonElement>}
   * Список кнопок информации.
   */
  private btnInfo: NodeListOf<HTMLButtonElement>;

  /**
   * @private
   * @type {number[] | null}
   * Массив счетов игроков (индекс 0 - первый игрок, индекс 1 - второй игрок).
   */
  private scores: number[] | null = [0, 0];

  /**
   * @private
   * @type {number | null}
   * Текущий счет текущего игрока.
   */
  private currentScore: number | null = 0;

  /**
   * @private
   * @type {number | null}
   * Индекс активного игрока (0 - первый игрок, 1 - второй игрок).
   */
  private activePlayer: number | null = 0;

  /**
   * @private
   * @type {boolean | null}
   * Флаг, указывающий, идет ли игра в данный момент.
   */
  private playing: boolean | null = true;

  /**
   * @private
   * @type {number}
   * Окончательное количество очков для победы в игре.
   */
  private endScore: number = 100;

  /**
   * Создает экземпляр класса Dice и инициализирует игру.
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует игру, создавая DOM-элементы и устанавливая обработчики событий.
   * Вызывается при создании экземпляра класса.
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает DOM-элементы для отображения игры.
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='root'>
        <div class='column column--player' data-player-0>
          <h3 class='text-2xl'>Player 1</h3>
          <p class='text-3xl font-bold' data-score-0>1</p>
          <div class='current'>
            <p class='current__label'>Current</p>
            <p class='text-3xl font-bold' data-current-0>20</p>
          </div>
        </div>
        <div class='column column--buttons'>
          <img src='dice-5.png' alt='Playing dice' class='dice' data-dice />
          <div class='buttons'>
            <button class='px-3 py-2 border hover:bg-slate-50' data-game>New game</button>
            <button class='px-3 py-2 border hover:bg-slate-50' data-roll>Roll dice</button>
            <button class='px-3 py-2 border hover:bg-slate-50' data-hold>Hold</button>
            <button data-info class='info'>${icons.info.toSvg({ color: '#6b48ff' })}</button>
          </div>
        </div>
       <div class='column column--player' data-player-1>
          <h3 class='text-2xl'>Player 2</h3>
          <p class='text-3xl font-bold' data-score-1>2</p>
          <div class='current'>
            <p class='current__label'>Current</p>
            <p class='text-3xl font-bold' data-current-1>40</p>
          </div>
        </div>
        <div class='overlay'>
          <h4 class='font-bold'>Game Rules</h4>
          <p>On a turn, a player rolls the die repeatedly. The goal is to accumulate as many points as possible, adding up the numbers rolled on the die. However, if a player rolls a 1, the player's turn is over and any points they have accumulated during this turn are forfeited. Rolling a 1 doesn't wipe out your entire score from previous turns, just the total earned during that particular roll.</p>
          <p>A player can also choose to hold (stop rolling the die) if they do not want to take a chance of rolling a 1 and losing all of their points from this turn. If the player chooses to hold, all of the points rolled during that turn are added to his or her score.</p>
          <p>When a player reaches a total of 100 or more points, the game ends and that player is the winner.</p>
          <button data-info>${icons['corner-down-left'].toSvg({ color: '#6b48ff' })}</button>
        </div>
      </div>
    `;
    this.playerF = root.querySelector('[data-player-0]')!;
    this.playerS = root.querySelector('[data-player-1]')!;
    this.scoreF = root.querySelector('[data-score-0]')!;
    this.scoreS = root.querySelector('[data-score-1]')!;
    this.currentF = root.querySelector('[data-current-0]')!;
    this.currentS = root.querySelector('[data-current-1]')!;
    this.diceImg = root.querySelector('[data-dice]')!;
    this.btnGame = root.querySelector('[data-game]')!;
    this.btnRoll = root.querySelector('[data-roll]')!;
    this.btnHold = root.querySelector('[data-hold]')!;
    this.btnInfo = root.querySelectorAll('[data-info]')!;
  }

  /**
   * Устанавливает обработчики событий для элементов игры.
   */
  private setupEventListeners(): void {
    this.initGame();
    this.btnGame.addEventListener('click', this.initGame.bind(this));
    this.btnRoll.addEventListener('click', this.handleRoll.bind(this));
    this.btnHold.addEventListener('click', this.handleHold.bind(this));
    this.btnInfo.forEach(btn => btn.addEventListener('click', this.handleInfo.bind(this)));
  }

  /**
   * Инициализирует начало новой игры.
   */
  private initGame(): void {
    this.scores = [0, 0];
    this.currentScore = 0;
    this.activePlayer = 0;
    this.playing = true;
    this.scoreF.textContent =
      this.scoreS.textContent =
        this.currentF.textContent =
          this.currentS.textContent = '0';
    this.diceImg.classList.add('hide');
    this.playerF.classList.add('active');
    this.playerS.classList.remove('active');
    document.querySelectorAll('.winner')
      .forEach(el => el.classList.remove('winner'));
  }

  /**
   * Обрабатывает бросок кубика.
   */
  private handleRoll(): void {
    if (this.playing) {
      const dice = getRandomNumber(1, 6);
      this.diceImg.classList.remove('hidden');
      this.diceImg.src = `dice-${dice}.png`;

      if (dice !== 1) {
        this.currentScore += dice;
        document.querySelector(`[data-current-${this.activePlayer}]`).textContent = this.currentScore;
      } else {
        this.handleSwitchPlayer();
      }
    }
  }

  /**
   * Обрабатывает удержание текущего счета.
   */
  private handleHold(): void {
    if (this.playing) {
      if (this.currentScore !== null && this.scores !== null && this.activePlayer !== null) {
        this.scores[this.activePlayer] += this.currentScore;
        document.querySelector(`[data-score-${this.activePlayer}]`).textContent = this.scores[this.activePlayer];
        if (this.scores[this.activePlayer] >= this.endScore) {
          this.playing = false;
          this.diceImg.classList.add('hidden');
          const activePlayer = document.querySelector(`[data-player-${this.activePlayer}]`)!;
          activePlayer.classList.add('winner');
          activePlayer.classList.remove('active');
        } else {
          this.handleSwitchPlayer();
        }
      }
    }
  }

  /**
   * Показывает или скрывает информацию о правилах игры.
   */
  private handleInfo(): void {
    document.querySelector('.overlay')!.classList.toggle('visible');
  }

  /**
   * Переключает активного игрока и сбрасывает текущий счет.
   */
  private handleSwitchPlayer(): void {
    if (this.currentScore !== null) {
      document.querySelector(`[data-current-${this.activePlayer}]`).textContent = 0;
      this.currentScore = 0;
      this.activePlayer = this.activePlayer === 0 ? 1 : 0;
      this.playerF.classList.toggle('active');
      this.playerS.classList.toggle('active');
    }
  }
}

// Создаем экземпляр игры при загрузке страницы.
new Dice();
