import './style.css';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import feather from 'feather-icons';
import { v4 as uuidv4 } from 'uuid';

/**
 * Интерфейс для описания транзакции.
 */
interface Transaction {
  id: string;
  text: string;
  amount: number;
}

/**
 * Класс представляет приложение для отслеживания расходов.
 */
class ExpenseTracker {
  private balanceValue: HTMLParagraphElement;
  private plusValue: HTMLParagraphElement;
  private minusValue: HTMLParagraphElement;
  private history: HTMLUListElement;
  private form: HTMLFormElement;
  private transactions: Transaction[];

  /**
   * Создает экземпляр класса `ExpenseTracker`.
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует компонент, создавая DOM-элементы и устанавливая обработчики событий.
   */
  private initialize():void {
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
      <div class='border shadow rounded max-w-md w-full p-3 grid gap-4'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Expense Tracker</h1>
        <div class='grid gap-3'>

          <header class='grid place-items-center gap-2 p-2 rounded bg-slate-50 font-bold border'>
            <h2 class='text-2xl'>Your Balance</h2>
            <p class='text-3xl' data-balance>$0.00</p>
          </header>

          <ul class='grid grid-cols-2 '>
            ${['plus', 'minus'].map(i => `
              <li class=''>
                <p class='border p-3 flex justify-center items-center font-bold'>${i === 'plus' ? 'Income' : 'Expense'}</p>
                <p data-${i} class='border p-3 flex text-lg justify-center items-center font-bold text-${i === 'plus' ? 'green' : 'red'}-500'>
                  ${i === 'plus' ? '+$0.00' : '-$0.00'}
                </p>
              </li>
            `).join('')}
          </ul>

          <h5 class='p-2 rounded bg-slate-50 font-bold border'>History</h5>
          <ul class='grid gap-2 max-h-[200px] overflow-auto' data-history></ul>

          <h5 class='p-2 rounded bg-slate-50 font-bold border'>Add new transaction</h5>
          <form class='grid gap-3' data-form>
            <label class='grid gap-1'>
              <span class='text-sm font-medium'>Text</span>
              <input class='px-3 py-2.5 border-2 rounded focus:outline-none focus:border-blue-400' autocomplete='off' type='text' id='text' name='text' placeholder='Enter text' />
            </label>
            <label class='grid gap-1'>
              <span class='text-sm font-medium'>Amount (negative - expense, positive - income)</span>
              <input class='px-3 py-2.5 border-2 rounded focus:outline-none focus:border-blue-400' autocomplete='off' type='number' id='amount'  name='amount' placeholder='Enter amount' />
            </label>
            <button class='px-3 py-2.5 border bg-slate-100 hover:bg-slate-200'>Add transaction</button>
          </form>
        </div>
      </div>
    `;

    this.balanceValue = root.querySelector('[data-balance]')!;
    this.plusValue = root.querySelector('[data-plus]')!;
    this.minusValue = root.querySelector('[data-minus]')!;
    this.history = root.querySelector('[data-history]')!;
    this.form = root.querySelector('[data-form]')!;
  }

  /**
   * Устанавливает обработчики событий для элементов формы и истории транзакций.
   */
  private setupEventListeners(): void {
    this.transactions = this.storageGet();
    this.storageDisplay();
    this.form.addEventListener('submit', this.handeSubmit.bind(this));
    this.history.addEventListener('click', this.handeDelete.bind(this));
  }

  /**
   * Получает данные транзакций из локального хранилища.
   * @returns {Transaction[]} Массив транзакций.
   */
  private storageGet(): Transaction[] {
    return localStorage.getItem('transactions') ? JSON.parse(localStorage.getItem('transactions')!) : [];
  }

  /**
   * Добавляет данные транзакций в локальное хранилище.
   */
  private storageAdd(): void {
    localStorage.setItem('transactions', JSON.stringify(this.transactions));
  }

  /**
   * Получает и отображает данные транзакций из локального хранилища.
   */
  private storageDisplay(): void {
    this.transactions = this.storageGet();
    this.transactions.forEach((i) => this.renderHTML(i));
    this.updateBalance();
  }

  /**
   * Обработчик события отправки формы.
   * @param {Event} event - Событие отправки формы.
   */
  private handeSubmit(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const text = formData.get('text')?.toString().trim() || '';
    const amount = formData.get('amount')?.toString().trim() || '';

    if (text.length === 0 || amount.length === 0) {
      Toastify({
        text: '⛔️ Please add a text and amount',
        className: 'bg-none shadow-none bg-orange-100 text-black border border-orange-200',
        duration: 3000,
        gravity: 'bottom',
        position: 'center',
      }).showToast();
      return;
    }

    const transaction: Transaction = { id: uuidv4(), text, amount: Number(amount) };
    this.transactions.push(transaction);
    this.updateBalance();
    this.storageAdd();
    this.renderHTML(transaction);

    form.reset();
  }

  /**
   * Отображает данные транзакции в истории.
   * @param {Transaction} transaction - Данные транзакции.
   */
  private renderHTML({ id, text, amount }: Transaction): void {
    const li = document.createElement('li');
    li.className = 'border-2 flex p-2 gap-2 rounded ';
    li.className = `${li.className} ${amount < 0 ? 'bg-red-50 border-red-500' : 'bg-green-50 border-green-500'}`;
    li.innerHTML = `
      <p>${text}</p>
      <span class='ml-auto font-bold text-${amount < 0 ? 'red' : 'green'}-400'>${amount < 0 ? '-' : '+'}${Math.abs(amount)}</span>
      <button class='' data-id='${id}'>
        <span class='pointer-events-none'>
          ${feather.icons.x.toSvg()}
        </span>
      </button>
  `;

    this.history.appendChild(li);
  }

  /**
   * Обновляет баланс на основе данных транзакций.
   */
  private updateBalance(): void {
    const amounts = this.transactions.map(({ amount }) => amount);
    const total = amounts.reduce((acc, item) => (acc + item), 0).toFixed(2);
    const income = amounts.filter((item) => item > 0).reduce((acc, item) => (acc + item), 0).toFixed(2);

    const expense = (
      amounts
        .filter((item) => item < 0)
        .reduce((acc, item) => (acc + item), 0) * -1
    ).toFixed(2);

    this.balanceValue.innerText = `$${total}`;
    this.plusValue.innerText = `$${income}`;
    this.minusValue.innerText = `$${expense}`;
  }

  /**
   * Обработчик события удаления транзакции.
   * @param {MouseEvent} event - Событие клика.
   */
  private handeDelete({ target }: MouseEvent): void {
    if (target instanceof HTMLButtonElement && target.matches('[data-id]') && window.confirm('Are you sure?')) {
      this.transactions = this.transactions.filter(({ id }) => id !== target.dataset.id);
      this.storageAdd();
      this.history.innerHTML = '';
      this.transactions.forEach((i) => this.renderHTML(i));
      this.updateBalance();
    }
  }
}

// Создаем экземпляр класса ExpenseTracker для инициализации приложения.
new ExpenseTracker();
