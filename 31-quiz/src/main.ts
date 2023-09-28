import './style.scss';
import axios from 'axios';
import { toast } from './utils/toast.ts';
import { getRandomNumber } from './utils/getRandomNumber.ts';
import confetti from 'canvas-confetti';

interface IQuestion {
  category: string,
  correct_answer: string,
  difficulty: string,
  incorrect_answers: string[],
  type: string,
  question: string
}

/**
 * Представляет приложение для викторин.
 */
class Quiz {
  private questionLabel: HTMLParagraphElement;
  private questionCount: HTMLParagraphElement;
  private answerFields: NodeListOf<HTMLInputElement>;
  private button: HTMLButtonElement;
  private quizBody: HTMLDivElement;
  private quiz: HTMLDivElement;
  private finish: HTMLDivElement;
  private spinner: HTMLDivElement;
  private readonly URL: string = 'https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple&encode=url3986';
  private currentQuestion: number = 0;
  private correctAnswer: string;
  private score: number = 0;
  private quizData: IQuestion[];

  /**
   * Создает экземпляр приложения Quiz.
   */
  constructor() {
    // Инициализирует приложение Quiz.
    this.initialize();
  }

  /**
   * Инициализирует приложение Quiz, создавая DOM-элементы и настраивая обработчики событий.
   * @private
   */
  private initialize(): void {
    // Создает необходимые DOM-элементы для интерфейса викторины.
    this.createDOM();
    // Настраивает обработчики событий для взаимодействия пользователя.
    this.setupEventListeners();
  }

  /**
   * Создает необходимые DOM-элементы для интерфейса викторины.
   * @private
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='bg-white border shadow rounded max-w-md w-full p-3 grid gap-4'>
        <div role='status' data-spinner>
          <div class='flex justify-center'>
            <svg aria-hidden='true' class='inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300' viewBox='0 0 100 101' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z' fill='currentColor'/>
              <path d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z' fill='currentFill'/>
            </svg>
            <span class='sr-only'>Loading...</span>
          </div>
        </div>
        <div class='quiz grid gap-3 hidden'>
          <div class='grid gap-2 place-items-center text-center' data-body>
            <h1 class='font-bold text-2xl'>Quiz</h1>
            <p class='font-medium' data-count>Question 1/10</p>
            <p data-question>Question</p>
            <ul class='grid gap-3 w-full text-left'>
              ${Array.from({ length: 4 }).map(() => `
                <li>
                  <label class='flex items-center gap-3 cursor-pointer'>
                    <input class='visually-hidden' type='radio' name='answer' data-answer>
                    <span class='radio'></span>
                    <span class='label'>Answer</span>
                  </label>
                </li>
              `).join('')}
            </ul>
          </div>
          <button class='border px-3 py-2 hover:bg-slate-50' data-submit>Submit</button>

          <div class='hidden gap-3 place-items-center' data-finish>
            <h1 class='font-bold text-2xl'>Finish</h1>
            <p>You answered <span class='font-bold'>0/10</span> questions correctly</p>
            <button class='w-full border px-3 py-2 hover:bg-slate-50'>Reload</button>
          </div>
        </div>
      </div>
    `;

    this.questionLabel = root.querySelector('[data-question]')!;
    this.questionCount = root.querySelector('[data-count]')!;
    this.answerFields = root.querySelectorAll<HTMLInputElement>('[data-answer]')!;
    this.button = root.querySelector('[data-submit]')!;
    this.quizBody = root.querySelector('[data-body]')!;
    this.quiz = root.querySelector('.quiz')!;
    this.finish = root.querySelector('[data-finish]')!;
    this.spinner = root.querySelector('[data-spinner]')!;
  }

  /**
   * Настраивает обработчики событий для взаимодействия пользователя.
   * @private
   */
  private setupEventListeners(): void {
    // Получает вопросы викторины и настраивает обработчики событий для кнопок.
    this.fetchQuiz();
    // Добавляет обработчик события клика для кнопки отправки ответа.
    this.button.addEventListener('click', this.handleSubmit.bind(this));
    // Добавляет обработчик события клика для кнопки перезагрузки после завершения викторины.
    this.finish.querySelector('button')?.addEventListener('click', () => location.reload());
  }

  /**
   * Получает вопросы викторины из внешнего API.
   * @private
   */
  private async fetchQuiz(): Promise<void> {
    try {
      // Отключает интерфейс викторины во время получения вопросов.
      this.quiz.classList.add('pointer-events-none');
      // Выполняет запрос к API для получения вопросов викторины.
      const { data: { results } } = await axios.get(this.URL);
      // Сохраняет полученные данные викторины.
      this.quizData = results;
      // Отображает первый вопрос и включает интерфейс викторины.
      this.renderQuiz(this.quizData);
      // Убирает спиннер загрузки.
      this.quiz.classList.remove('pointer-events-none');
      this.quiz.classList.remove('hidden');
      this.spinner.classList.add('hidden');
    } catch (e) {
      // Обрабатывает ошибки и выводит сообщение toast.
      toast('Something went wrong, open dev console', 'error');
      console.log(e);
    }
  }

  /**
   * Отображает вопрос викторины и варианты ответов на экране.
   * @param {IQuestion[]} data - Данные викторины.
   * @private
   */
  private renderQuiz(data: IQuestion[]): void {
    // Обновляет счетчик вопросов и текст вопроса.
    this.questionCount.innerHTML = `Question ${this.currentQuestion + 1}/${data.length}`;
    this.questionLabel.textContent = decodeURIComponent(data[this.currentQuestion].question);
    // Перемешивает и отображает варианты ответов.
    const answers = this.shuffle([...data[this.currentQuestion].incorrect_answers, data[this.currentQuestion].correct_answer]);
    this.correctAnswer = decodeURIComponent(data[this.currentQuestion].correct_answer);
    console.log(`⭐️ Correct answer: ${this.correctAnswer}`);
    // Обновляет метки радиокнопок вариантами ответов.
    this.answerFields.forEach((radio, radioIdx) => {
      radio.checked = false;
      answers.forEach((answer, answerIdx) => {
        answerIdx === radioIdx ? radio.value = radio.nextElementSibling!.nextElementSibling!.textContent = decodeURIComponent(answer) : false;
      });
    });
  }

  /**
   * Обрабатывает отправку пользовательского ответа на вопрос викторины.
   * @private
   */
  private handleSubmit(): void {
    // Определяет выбранный пользователем ответ.
    let checkedAnswer = null;
    this.answerFields.forEach(field => {
      if (field.checked) checkedAnswer = field.nextElementSibling!.nextElementSibling!.textContent;
    });
    console.log(this.quizData);
    // Проверяет ответ пользователя и обновляет счет.
    if (checkedAnswer) {
      if (checkedAnswer === this.correctAnswer) this.score++;
      this.currentQuestion++;
      // Переходит к следующему вопросу или завершает викторину.
      if (this.currentQuestion < this.quizData.length) {
        this.renderQuiz(this.quizData);
      } else {
        // Празднует завершение викторины с помощью конфетти.
        confetti({
          angle: getRandomNumber(55, 125),
          spread: getRandomNumber(50, 70),
          particleCount: getRandomNumber(50, 100),
          origin: { y: 0.6 },
        });
        // Скрывает контент викторины и показывает итоговый счет.
        this.quizBody.classList.add('hidden');
        this.button.classList.add('hidden');
        this.finish.classList.remove('hidden');
        this.finish.classList.add('grid');
        this.finish.querySelector('p')!.innerHTML = `You answered <span class='font-bold'>${this.score}/${this.quizData.length}</span> questions correctly`;
      }
    } else {
      // Отображает сообщение об ошибке, если не выбран ответ.
      toast('Please check some answer', 'error');
    }
  }

  /**
   * Случайным образом перемешивает элементы массива.
   * @param {string[]} array - Массив для перемешивания.
   * @returns {string[]} Перемешанный массив.
   * @private
   */
  private shuffle(array: string[]): string[] {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  };
}

// Создает новый экземпляр класса Quiz для запуска приложения.
new Quiz();
