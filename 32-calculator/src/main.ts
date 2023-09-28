import './style.scss';

type CalculationFunction = (firstNumber: number, secondNumber: number) => void;

interface CalculateObject {
  '/': CalculationFunction;
  '*': CalculationFunction;
  '+': CalculationFunction;
  '-': CalculationFunction;
  '=': CalculationFunction;
}

/**
 * Класс для создания простого калькулятора.
 * @class
 */
class Calculator {
  private result: HTMLSpanElement; // Результат вычислений
  private buttonsNumber: NodeListOf<HTMLButtonElement>; // Кнопки с числами
  private buttonsOperator: NodeListOf<HTMLButtonElement>; // Кнопки с операторами
  private buttonDecimal: HTMLButtonElement; // Кнопка для десятичной точки
  private buttonParent: HTMLDivElement; // Родительский контейнер кнопок
  private buttonClear: HTMLButtonElement;  // Кнопка "C" (очистка)
  private startedValue: number = 0; // Значение, с которого начинается вычисление
  private operatorValue: string = ''; // Текущий оператор
  private nextValue: boolean = false; // Флаг для следующего ввода
  private calculate: CalculateObject; // Объект с функциями вычисления

  /**
   * Создает экземпляр Calculator.
   * @constructor
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализация калькулятора: создание DOM и установка обработчиков событий.
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает DOM элементы для калькулятора.
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='border shadow rounded max-w-md w-full p-3 grid gap-4 calculator'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Calculator</h1>
        <div class='container'>
          <div class='display'>
            <span class='text-3xl font-medium' data-result>0</span>
          </div>
          <div class='body' data-body>
            <button class='operator' data-value='+'>+</button>
            <button class='operator' data-value='-'>-</button>
            <button class='operator' data-value='*'>×</button>
            <button class='operator' data-value='/'>÷</button>
            <button class='number' data-value='7'>7</button>
            <button class='number' data-value='8'>8</button>
            <button class='number' data-value='9'>9</button>
            <button class='number' data-value='4'>4</button>
            <button class='number' data-value='5'>5</button>
            <button class='number' data-value='6'>6</button>
            <button class='number' data-value='1'>1</button>
            <button class='number' data-value='2'>2</button>
            <button class='number' data-value='3'>3</button>
            <button class='decimal' data-value='.'>.</button>
            <button class='number' data-value='0'>0</button>
            <button class='clear' data-clear>C</button>
            <button class='equal operator' data-value='='>=</button>
          </div>
        </div>
      </div>
    `;

    this.result = root.querySelector('[data-result]')!;
    this.buttonsNumber = root.querySelectorAll('.number')!;
    this.buttonsOperator = root.querySelectorAll('.operator')!;
    this.buttonDecimal = root.querySelector('.decimal')!;
    this.buttonParent = root.querySelector('[data-body]')!;
    this.buttonClear = root.querySelector('[data-clear]')!;
  }

  /**
   * Устанавливает обработчики событий для кнопок калькулятора.
   */
  private setupEventListeners(): void {
    this.calculate = {
      '/': (firstNumber, secondNumber) => this.strip(firstNumber / secondNumber),
      '*': (firstNumber, secondNumber) => this.strip(firstNumber * secondNumber),
      '+': (firstNumber, secondNumber) => this.strip(firstNumber + secondNumber),
      '-': (firstNumber, secondNumber) => this.strip(firstNumber - secondNumber),
      '=': (firstNumber, secondNumber) => this.strip(secondNumber),
    };
    this.buttonsNumber.forEach(btn => btn.addEventListener('click', this.setValues.bind(this)));
    this.buttonsOperator.forEach(btn => btn.addEventListener('click', this.useOperator.bind(this)));
    this.buttonDecimal.addEventListener('click', this.useDecimal.bind(this));
    this.buttonClear.addEventListener('click', this.onReset.bind(this));
  }

  /**
   * Метод для округления числа с фиксированным числом знаков после запятой.
   * @param {number} value - Число, которое нужно округлить.
   * @returns {number} Округленное число.
   */
  private strip(value: number): number {
    return parseFloat(value.toPrecision(12));
  };

  /**
   * Обработчик события при нажатии на кнопки с числами.
   * @param {Event} event - Событие клика на кнопке.
   */
  private setValues(event: Event): void {
    const target = event.target as HTMLButtonElement;
    const value = target.textContent;
    if (this.nextValue) {
      this.result.textContent = value;
      this.nextValue = false;
    } else {
      const tmpValue = this.result.textContent;
      if (tmpValue && value) {
        this.result.textContent = tmpValue === '0' ? value : tmpValue + value;
      }
    }
  }

  /**
   * Обработчик события при нажатии на кнопки с операторами.
   * @param {Event} event - Событие клика на кнопке.
   */
  private useOperator(event: Event): void {
    const target = event.target as HTMLButtonElement;
    const operator = target.dataset.value;
    const currentValue = Number(this.result.textContent);
    if (this.operatorValue && this.nextValue) {
      this.operatorValue = operator;
      return;
    }

    if (!this.startedValue) {
      this.startedValue = currentValue;
    } else {
      const calculation = this.calculate[this.operatorValue](this.startedValue, currentValue);
      this.result.textContent = calculation.toString();
      this.startedValue = calculation;
    }

    this.nextValue = true;
    this.operatorValue = operator ?? '';
  }

  /**
   * Обработчик события при нажатии на кнопку для десятичной точки.
   */
  private useDecimal(): void {
    if (this.nextValue) return;

    if (!this.result.textContent.includes('.')) {
      this.result.textContent = `${this.result.textContent}.`;
    }
  }

  /**
   * Обработчик события при нажатии на кнопку "C" (очистка).
   */
  private onReset(): void {
    this.startedValue = 0;
    this.operatorValue = '';
    this.nextValue = false;
    this.result.textContent = '0';
  }
}

new Calculator();
