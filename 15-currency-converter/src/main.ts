import './style.css'; // Импорт стилей
import Toastify from 'toastify-js'; // Импорт библиотеки для уведомлений
import 'toastify-js/src/toastify.css'; // Импорт стилей для уведомлений
import countries from './mock'; // Импорт данных о странах
import feather from 'feather-icons'; // Импорт иконок
import axios from 'axios'; // Импорт библиотеки Axios для выполнения HTTP-запросов

// Интерфейс, описывающий структуру ответа от сервера, содержащего информацию о курсе обмена
interface ExchangeRateResponse {
  result: number;
  date: string;
  success: boolean;
  info: {
    rate: number;
  };
}

class CurrencyConverter {
  // Приватные поля для хранения ссылок на элементы DOM
  private form: HTMLFormElement | null = null;
  private selects: NodeListOf<HTMLSelectElement> | null = null;
  private exchange: HTMLDivElement | null = null;
  private switch: HTMLDivElement | null = null;

  // Конструктор класса
  constructor() {
    this.initialize();
  }

  // Метод инициализации
  private initialize() {
    this.createDOM(); // Создание структуры DOM
    this.setupEventListeners(); // Настройка обработчиков событий
  }

  // Метод для создания структуры DOM
  private createDOM() {
    const root:HTMLDivElement = document.querySelector('#app')!;
    if (!root) return;

    root.innerHTML = `
      <div class='border shadow rounded max-w-md w-full p-3 grid gap-4'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Currency Converter</h1>
        <form class='grid gap-3' data-form>
          <label class='grid gap-1'>
            <span class='text-sm font-medium'>Enter Amount</span>
            <input class='border-2 rounded px-3 py-2.5 bg-gray-50 focus:outline-none focus:border-blue-400' type='number' value='1' step='1' min='1' name='amount'>
          </label>
          <div class='grid gap-3 sm:grid-cols-[auto_40px_auto] sm:items-end'>
            <label>
              <span class='text-sm font-medium'>From</span>
              <div class='relative'>
                <img class='absolute w-8 top-1/2 left-2 transform -translate-y-1/2' src='https://flagcdn.com/48x36/us.png' alt='flag'>
                <select class='border-2 rounded px-3 py-2.5 pl-10 bg-gray-50 focus:outline-none focus:border-blue-400 w-full' data-select='from' name='from'>
                  ${countries.map(({ name }) => `${name === 'USD' ? `<option value='${name}' selected>${name}</option>` : `<option value='${name}'>${name}</option>`}`).join('')}
                </select>
              </div>
            </label>
            <div class='border p-2 rounded flex justify-center cursor-pointer hover:bg-neutral-100 transition sm:border-none sm:mb-1.5' data-switch>${feather.icons.repeat.toSvg()}</div>
            <label>
              <span class='text-sm font-medium'>To</span>
              <div class='relative'>
                <img class='absolute w-8 top-1/2 left-2 transform -translate-y-1/2' src='https://flagcdn.com/48x36/ru.png' alt='flag'>
                <select class='border-2 rounded px-3 py-2.5 pl-10 bg-gray-50 focus:outline-none focus:border-blue-400 w-full'  data-select='to' name='to'>
                  ${countries.map(({ name }) => `${name === 'RUB' ? `<option value='${name}' selected>${name}</option>` : `<option value='${name}'>${name}</option>`}`).join('')}
                </select>
              </div>
            </label>
          </div>

          <div class='hidden' data-exchange>Getting exchange rate...</div>
          <button class='border px-3 py-2.5 hover:bg-neutral-100' type='submit'>Get Exchange Rate</button>
        </form>
      </div>
    `;

    this.form = document.querySelector('[data-form]') as HTMLFormElement;
    this.selects = document.querySelectorAll('[data-select]') as NodeListOf<HTMLSelectElement>;
    this.exchange = document.querySelector('[data-exchange]') as HTMLDivElement;
    this.switch = document.querySelector('[data-switch]') as HTMLDivElement;
  }

  // Метод для настройки обработчиков событий
  private setupEventListeners(): void {
    if (!this.form || !this.selects || !this.switch) return;
    this.getExchange();
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    this.selects.forEach(select => select.addEventListener('change', this.handleChange.bind(this)));
    this.switch.addEventListener('click', this.handleSwitch.bind(this));
  }

  // Метод для получения курса обмена валюты.
  private getExchange() {
    if (!this.form || !this.selects || !this.exchange) return;
    const amountInput = this.form.querySelector('[type="number"]') as HTMLInputElement | null;
    if (!amountInput) return;
    this.exchange.classList.remove('hidden');
    this.fetchData(amountInput.value, this.selects[0].value, this.selects[1].value);
  }

  // Метод для обработки отправки формы.
  private handleSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const entries = formData.entries();
    const data: Record<string, string> = {};
    for (const [key, value] of entries) {
      data[key] = value;
    }
    const { amount, to, from } = data;

    if (amount.trim().length === 0 || !to || !from) {
      Toastify({
        text: '⛔️ Please fill the fields',
        className: 'bg-none shadow-none bg-orange-100 text-black border border-orange-200',
        duration: 3000,
        gravity: 'bottom',
        position: 'center',
      }).showToast();
      return;
    }

    this.fetchData(amount, from, to);
  }

  // Метод для обработки изменения выбора валюты.
  private handleChange(event: Event) {
    const target = event.target as HTMLSelectElement | null;
    if (!target) return;
    const flagImg = target.previousElementSibling as HTMLImageElement;
    const selectedCountry = countries.find(({ name }) => name === target.value);
    if (selectedCountry) {
      const flagAbbr = selectedCountry.value.toLowerCase();
      flagImg.src = `https://flagcdn.com/48x36/${flagAbbr}.png`;
    }
  }

  //  Метод для обработки переключения валют.
  private handleSwitch() {
    if (!this.selects) return;
    const amountInput = this.form?.querySelector('[type="number"]') as HTMLInputElement | null;
    if (!amountInput) return;
    const amount = amountInput.value;
    const from = this.selects[0];
    const to = this.selects[1];
    const tmpCode = from.value;
    if (from && from.previousElementSibling && to && to.previousElementSibling) {
      const tmpSrc = (from.previousElementSibling as HTMLImageElement).src;
      if (amount.trim().length === 0) {
        Toastify({
          text: '⛔️ Please fill the fields.',
          className: 'bg-none shadow-none bg-orange-100 text-black border border-orange-200',
          duration: 3000,
          gravity: 'bottom',
          position: 'center',
        }).showToast();
        return;
      }
      from.value = to.value;
      to.value = tmpCode;
      (from.previousElementSibling as HTMLImageElement).src = (to.previousElementSibling as HTMLImageElement).src;
      (to.previousElementSibling as HTMLImageElement).src = tmpSrc;

      this.fetchData(amount, from.value, to.value);
    }

  }

  // Метод для выполнения HTTP-запроса и получения данных о курсе обмена.
  private async fetchData(amount: string, from: string, to: string) {
    if (!this.exchange) return;
    try {
      this.exchange.classList.remove('hidden');
      this.exchange.innerHTML = 'Getting exchange rate...';
      const response = await axios.get<ExchangeRateResponse>(`https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`);
      const {
        result,
        date,
        success,
        info: { rate },
      } = response.data;

      if (!success) {
        this.message(' Something went wrong, open dev console.');
        return;
      }

      this.exchange.innerHTML = `
      <table class='table-auto w-full'>
        <tr>
          <td class='border p-2 bg-neutral-50 font-medium'><span>Date</span></td>
          <td class='border p-2'>${new Date(date).toLocaleString()}</td>
        </tr>
        <tr>
          <td class='border p-2 bg-neutral-50 font-medium'><span>Rate</span></td>
          <td class='border p-2'><span>1</span> ${from} = <span>${rate.toFixed(2)}</span> ${to}</td>
        </tr>
        <tr>
          <td class='border p-2 bg-neutral-50 font-medium'><span>Exchange</span></td>
          <td class='border p-2'><span>${amount}</span> ${from} = <span>${result.toFixed(2)}</span> ${to}</td>
        </tr>
      </table>
      `;
    } catch (e) {
      console.log(e);
      this.message(' Something went wrong, open dev console.');
    }
  }

  // Метод для отображения уведомлений.
  private message(text: string, classname: string = 'bg-none shadow-none bg-orange-100 text-black border border-orange-200') {
    Toastify({
      text: `⛔ ${text}`,
      className: classname,
      duration: 3000,
      gravity: 'bottom',
      position: 'center',
    }).showToast();
  }
}

// Создание экземпляра класса CurrencyConverter для запуска приложения
new CurrencyConverter();
