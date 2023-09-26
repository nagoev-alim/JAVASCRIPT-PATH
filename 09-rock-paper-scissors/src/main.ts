import './style.css';
import confetti from 'canvas-confetti';
import { getRandomNumber } from './utils/getRandomNumber';

/**
 * Интерфейс элемента массива MockItem.
 */
interface MockItem {
  name: string;
  src: string;
}

/**
 * Класс представляет игру "Камень-Ножницы-Бумага".
 */
class RockPaperScissors {
  // Массив с опциями
  private mock: MockItem[] = [
    {
      name: 'rock',
      src: 'https://lh3.googleusercontent.com/drive-viewer/AITFw-xb17E49hX9Hsyn5OTFEgE1MwN2EFVeDbiLh0WXFD8GwX706yIlhoVvAgNR4YJVjhXlgWQ-lP4HVGMcpM2SLA8FTV1n=s2560',
    },
    {
      name: 'paper',
      src: 'https://lh3.googleusercontent.com/drive-viewer/AITFw-xAPTQ0LdHQQvtgloCAcCx4JoMqCkSf1oB-2Y7Knijpd2ZVQy6Bq4V-qzZIrDIz85QQrVlLqo9TGydOl7A2c7b1N2OR_A=s2560',
    },
    {
      name: 'scissors',
      src: 'https://lh3.googleusercontent.com/drive-viewer/AITFw-wrzbbnuuSAbSmJMnD4omat0v0E2OI_JmAFJ1j1E9d87qrvbuDe1KTn5BVI1Lo43rwznA_t1JHAU7FH59JwAca7qlg0=s2560',
    },
  ];
  private rock: HTMLButtonElement | null = null;
  private paper: HTMLButtonElement | null = null;
  private scissors: HTMLButtonElement | null = null;
  private user: HTMLSpanElement | null = null;
  private computer: HTMLSpanElement | null = null;
  private message: HTMLDivElement | null = null;
  private button: HTMLButtonElement | null = null;
  private userScores: number = 0;
  private computerScores: number = 0;

  /**
   * Инициализация компонента игры.
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует компонент, создавая DOM-элементы и устанавливая обработчики событий.
   */
  private initialize() {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает необходимые DOM-элементы для компонента.
   */
  private createDOM():void {
    const root:HTMLDivElement = document.querySelector('#app')!;
    if (!root) return;

    root.innerHTML = `
      <div class='border shadow rounded max-w-xl w-full p-3 grid gap-4 md:p-5 bg-white'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Rock Paper Scissors</h1>
        <main>
          <div class='border-4 border-black relative font-bold text-6xl md:text-8xl flex justify-center items-center p-10'>
            <span class='absolute top-1/2 -translate-y-1/2  text-sm left-0 p-2 bg-red-400 text-white'>user</span>
            <span class='absolute top-1/2 -translate-y-1/2  text-sm right-0 p-2 bg-red-400 text-white'>computer</span>
            <span data-user-score class=''>0</span>:
            <span data-computer-score class=''>0</span>
          </div>

          <div class='text-center font-bold my-4' data-message>Get Started, Let\`s Rock!</div>

          <ul class='options grid gap-4 grid-cols-3 justify-items-center max-w-md mx-auto'>
            ${this.mock.map(({ name, src }: { name: string, src: string }) => `
              <li>
                <button class='border-4 border-black w-[80px] sm:w-[100px] h-[80px] sm:h-[100px] p-2 rounded-full' data-${name}>
                  <img class='pointer-events-none' src='${src}' alt='${name}'>
                </button>
              </li>
            `).join('')}
          </ul>
        </main>

        <footer class='text-center grid place-items-center gap-3'>
          <p>Make your move.</p>
          <button class='hidden px-3 py-2.5 border text-white bg-red-400 hover:bg-red-500' data-replay>Repeat Game</button>
        </footer>
      </div>
    `;

    this.rock = root.querySelector('[data-rock]') as HTMLButtonElement;
    this.paper = root.querySelector('[data-paper]') as HTMLButtonElement;
    this.scissors = root.querySelector('[data-scissors]') as HTMLButtonElement;
    this.user = root.querySelector('[data-user-score]') as HTMLSpanElement;
    this.computer = root.querySelector('[data-computer-score]') as HTMLSpanElement;
    this.message = root.querySelector('[data-message]') as HTMLDivElement;
    this.button = root.querySelector('[data-replay]') as HTMLButtonElement;
  }

  /**
   * Устанавливает обработчики событий для кнопок игры.
   */
  private setupEventListeners(): void {
    if (!this.rock || !this.paper || !this.scissors || !this.button) return;
    this.rock.addEventListener('click', this.handleGame.bind(this));
    this.paper.addEventListener('click', this.handleGame.bind(this));
    this.scissors.addEventListener('click', this.handleGame.bind(this));
    this.button.addEventListener('click', () => location.reload());
  }

  /**
   * Обрабатывает событие нажатия на кнопку игры.
   * @param {Event} event - Событие клика.
   */
  private handleGame(event: Event) {
    const target = event.target as HTMLButtonElement;
    console.log(target);
    const computerChoice = ['rock', 'paper', 'scissors'][Math.floor(Math.random() * 3)];
    const userChoice = Object.keys(target.dataset)[0];

    switch (`${computerChoice}-${userChoice}`) {
      case 'rock-paper':
      case 'paper-scissors':
      case 'scissors-rock':
        this.optionGame(userChoice, computerChoice, 'win');
        break;
      case 'paper-rock':
      case 'scissors-paper':
      case 'rock-scissors':
        this.optionGame(userChoice, computerChoice, 'lose');
        break;
      case 'rock-rock':
      case 'scissors-scissors':
      case 'paper-paper':
        this.optionGame(userChoice, computerChoice, 'draw');
        break;
      default:
        break;
    }
  }

  /**
   * Обрабатывает результаты игры и обновляет счет и сообщение.
   * @param {string} userChoice - Выбор пользователя.
   * @param {string} computerChoice - Выбор компьютера.
   * @param {'win' | 'lose' | 'draw'} type - Результат игры.
   */
  private optionGame(userChoice: string, computerChoice: string, type: 'win' | 'lose' | 'draw') {
    if (!this.message || !this.user || !this.computer) return;

    switch (type) {
      case 'win':
        this.userScores++;
        this.user.textContent = this.userScores.toString();
        break;
      case 'lose':
        this.computerScores++;
        this.computer.textContent = this.computerScores.toString();
        break;
      case 'draw':
        this.userScores++;
        this.computerScores++;
        this.user.textContent = this.userScores.toString();
        this.computer.textContent = this.computerScores.toString();
        break;
      default:
        break;
    }

    this.updateMessage(userChoice, computerChoice, type);

    if (this.userScores === 3) {
      this.endGame('You WIN 🥳', 'text-green-500');
      confetti({
        angle: getRandomNumber(55, 125),
        spread: getRandomNumber(50, 70),
        particleCount: getRandomNumber(50, 100),
        origin: { y: 0.6 },
      });
    }

    if (this.computerScores === 3) {
      this.endGame('You LOSE 🤥', 'text-red-500');
    }

    if (this.userScores === 3 && this.computerScores === 3) {
      this.endGame('DRAW 🤝', 'text-gray-500');
    }
  }

  /**
   * Обновляет сообщение с результатами игры.
   * @param {string} userChoice - Выбор пользователя.
   * @param {string} computerChoice - Выбор компьютера.
   * @param {'win' | 'lose' | 'draw'} type - Результат игры.
   * @returns {string} - Строка с сообщением.
   */
  private updateMessage(userChoice: string = '', computerChoice: string, type: 'win' | 'lose' | 'draw') {
    if (!this.message) return;
    this.message.innerHTML = `
      ${userChoice === 'rock' ? 'Rock' : userChoice === 'paper' ? 'Paper' : 'Scissors'}
      <span class='text-sm ${type}'>(user)</span>
      ${type === 'win' ? 'beats' : type === 'lose' ? 'lose' : 'equals'}
      ${computerChoice === 'rock' ? 'Rock' : computerChoice === 'paper' ? 'Paper' : 'Scissors'}
      <span class='text-sm ${type}'>(comp)</span> .`;
  };

  /**
   * Завершает игру и выводит сообщение о результате.
   * @param {string} message - Сообщение о результате.
   * @param {string} classname - Класс для стилизации сообщения.
   */
  private endGame = (message: string, classname: string) => {
    if (!this.message || !this.button) return;
    this.message.innerHTML = `${message}`;
    console.log(classname.split(' ').join(', '));
    this.message.classList.add('text-2xl', classname);
    document.querySelector('.options')?.classList.add('hidden');
    document.querySelector('footer p')?.classList.add('hidden');
    this.button.classList.remove('hidden');
  };
}

// Создаем экземпляр компонента игры.
new RockPaperScissors();
