import './style.scss';
import { toast } from './utils/toast.ts';

/**
 * Интерфейс, описывающий структуру данных формы.
 * @interface
 * @property {number} amount - Сумма займа.
 * @property {number} interest - Процентная ставка.
 * @property {number} repay - Срок погашения в годах.
 */
interface FormDataInputs {
  amount: number;
  interest: number;
  repay: number;
}

/**
 * Класс для калькулятора займа.
 * @class
 */
class LoanCalculator {
  /**
   * Элемент формы.
   * @private
   * @type {HTMLFormElement}
   */
  private form: HTMLFormElement;
  /**
   * Элемент вывода результатов.
   * @private
   * @type {HTMLUListElement}
   */
  private output: HTMLUListElement;
  /**
   * Элемент для отображения ежемесячного платежа.
   * @private
   * @type {HTMLSpanElement}
   */
  private monthly: HTMLSpanElement;
  /**
   * Элемент для отображения суммы основного долга.
   * @private
   * @type {HTMLSpanElement}
   */
  private principal: HTMLSpanElement;
  /**
   * Элемент для отображения суммы выплаченных процентов.
   * @private
   * @type {HTMLSpanElement}
   */
  private interest: HTMLSpanElement;

  /**
   * Создает экземпляр класса LoanCalculator.
   * @constructor
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует класс.
   * @private
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает DOM-структуру страницы.
   * @private
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='bg-white border shadow rounded max-w-md w-full p-3 grid gap-4'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Loan Calculator</h1>
        <form class='grid gap-3' data-form>
          <input class='px-3 py-2 border-2 bg-slate-50 rounded focus:outline-none focus:border-blue-400' type='number' name='amount' placeholder='Loan amount'>
          <input class='px-3 py-2 border-2 bg-slate-50 rounded focus:outline-none focus:border-blue-400' type='number' name='interest' placeholder='Interest'>
          <input class='px-3 py-2 border-2 bg-slate-50 rounded focus:outline-none focus:border-blue-400' type='number' name='repay' placeholder='Years to repay'>
          <button class='px-3 py-2 border hover:bg-slate-50' type='submit'>Calculate</button>
        </form>
        <ul class='h-0 overflow-hidden transition-all grid place-items-center items-start gap-2' data-output>
          <li class='grid gap-2 text-center'>
            <p class='font-medium'>Monthly Payments:</p>
            <p class='font-bold text-2xl'><sup>$</sup><span data-monthly>0</span></p>
          </li>
          <li class='grid gap-2 text-center'>
            <p class='font-medium'>Total Principal Paid:</p>
            <p class='font-bold text-2xl'><sup>$</sup><span data-principal>0</span></p>
          </li>
          <li class='grid gap-2 text-center'>
            <p class='font-medium'>Total Interest Paid:</p>
            <p class='font-bold text-2xl'><sup>$</sup><span data-interest>0</span></p>
          </li>
        </ul>
      </div>
    `;

    this.form = root.querySelector('[data-form]')!;
    this.output = root.querySelector('[data-output]')!;
    this.monthly = root.querySelector('[data-monthly]')!;
    this.principal = root.querySelector('[data-principal]')!;
    this.interest = root.querySelector('[data-interest]')!;
  }

  /**
   * Устанавливает обработчики событий.
   * @private
   */
  private setupEventListeners(): void {
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
  }

  /**
   * Обработчик события отправки формы.
   * @private
   * @param {Event} event - Событие отправки формы.
   */
  private handleSubmit(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const amount = formData.get('amount') as string | undefined;
    const interest = formData.get('interest') as string | undefined;
    const repay = formData.get('repay') as string | undefined;
    const button = this.form.querySelector('button')!;

    if (typeof amount === 'string' && typeof interest === 'string' && typeof repay === 'string') {
      const inputs: FormDataInputs = {
        amount: parseInt(amount),
        interest: parseInt(interest),
        repay: parseInt(repay),
      };

      if (isNaN(inputs.amount) || isNaN(inputs.interest) || isNaN(inputs.repay)) {
        toast('Please fill all fields', 'warning');
        return;
      }

      button.textContent = 'Loading...';
      setTimeout(() => {
        this.output.classList.add('h-[210px]', 'overflow-auto');
        const principle = inputs.amount;
        const interest = inputs.interest / 100 / 12;
        const payments = inputs.repay * 12;

        const x = Math.pow(1 + interest, payments);
        const monthly = (principle * x * interest) / (x - 1);

        if (isFinite(monthly)) {
          this.monthly.textContent = monthly.toFixed(2);
          this.principal.textContent = (monthly * payments).toFixed(2);
          this.interest.textContent = (monthly * interest).toFixed(2);
          this.form.reset();
        }
        button.textContent = 'Submit';
      }, 1500);
    }
  }
}

// Создание экземпляра класса для запуска приложения.
new LoanCalculator();
