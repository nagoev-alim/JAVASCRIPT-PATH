import './style.scss';
import feather from 'feather-icons';
import sources from '../src/mock/index.ts';
import { toast } from './utils/toast.ts';
import axios, { AxiosResponse } from 'axios';

interface ISource {
  name: string,
  value: string
}

/**
 * Описание класса QuoteGenerator
 */
class QuoteGenerator {
  protected form: HTMLFormElement;
  protected btnSubmit: HTMLButtonElement;
  protected target: HTMLDivElement;

  /**
   * Конструктор класса QuoteGenerator
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализация приложения
   * @private
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создание DOM элементов
   * @private
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='bg-white border shadow rounded max-w-md w-full p-3 grid gap-4'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Quote Generators</h1>
        <form class='grid gap-3' data-form>
          <select class='px-3 py-2 border-2 w-full cursor-pointer bg-slate-50 focus:outline-none focus:border-blue-400' name='source'>
            <option value=''>Select Source</option>
            ${sources.map(({ name, value }: ISource) => `<option value='${value}'>${name}</option>`).join('')}
          </select>
          <button class='px-3 py-2 border' type='submit' data-submit>Submit</button>
        </form>
        <div class='hidden rounded border bg-gray-50 p-2 grid' data-target></div>
      </div>
    `;
    this.form = root.querySelector('[data-form]')!;
    this.btnSubmit = root.querySelector('[data-submit]')!;
    this.target = root.querySelector('[data-target]')!;
  }

  /**
   * Настройка обработчиков событий
   * @private
   */
  private setupEventListeners(): void {
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    this.target.addEventListener('click', this.handleClipboard.bind(this));
  }

  /**
   * Обработка отправки формы
   * @param {Event} event - объект события
   * @private
   */
  private handleSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const source = formData.get('source') as string | undefined;
    if (typeof source === 'string') {
      if (!source) {
        toast('Please select source', 'warning');
        return;
      }
      this.getQuote(source);
    }
  }

  /**
   * Получение цитаты
   * @param {string} source - источник цитаты
   * @private
   */
  private async getQuote(source: string) {
    try {
      this.btnSubmit.innerHTML = `Loading...`;

      switch (source) {
        case 'https://api.chucknorris.io/jokes/random': {
          const { data: { value } }: AxiosResponse<{ value: string }> = await axios.get(source);
          this.renderData(value, false);
          break;
        }
        case 'https://api.quotable.io/random': {
          const { data: { author, content } }: AxiosResponse<{
            author?: string;
            content: string
          }> = await axios.get(source);
          this.renderData(content, author ?? false);
          break;
        }
        case 'https://type.fit/api/quotes': {
          const { data }: AxiosResponse<{ text: string, author?: string | null }[]> = await axios.get(source);
          const { text, author } = data[Math.floor(Math.random() * data.length)];
          this.renderData(text, author ?? false);
          break;
        }
        case 'https://api.goprogram.ai/inspiration': {
          const { data: { quote, author } }: AxiosResponse<{
            quote: string,
            author?: string | undefined
          }> = await axios.get(source);
          this.renderData(quote, author ?? false);
          break;
        }
        case 'https://favqs.com/api/qotd': {
          const { data }: AxiosResponse<{
            quote: {
              body: string;
              author?: string | null;
            };
          }> = await axios.get(source);
          const { body, author } = data.quote;
          this.renderData(body, author ?? false);
          break;
        }
        case 'https://api.themotivate365.com/stoic-quote': {
          const { data }: AxiosResponse<{
            quote: string;
            Автор: string | null;
          }> = await axios.get(source);
          const { quote, author } = data;
          this.renderData(quote, author ?? false);
          break;
        }
        case 'https://evilinsult.com/generate_insult.php?lang=en&type=json': {
          const { data }: AxiosResponse<{
            insult: string;
          }> = await axios.get(`https://cors-anywhere.herokuapp.com/${source}`);
          const { insult } = data;
          this.renderData(insult, false);
          break;
        }
        case 'https://ron-swanson-quotes.herokuapp.com/v2/quotes': {
          const { data } = await axios.get(source);
          this.renderData(data, false);
          break;
        }
        case 'https://www.affirmations.dev/': {
          const { data: { affirmation } } = await axios.get(`https://cors-anywhere.herokuapp.com/${source}`);
          this.renderData(affirmation, false);
          break;
        }
        case 'https://quotesondesign.com/wp-json/wp/v2/posts/?orderby=rand': {
          const { data } = await axios.get(source);
          const { yoast_head_json: { og_title, og_description } } = data[Math.floor(Math.random() * data.length)];
          this.renderData(og_description, og_title ?? false);
          break;
        }
        case 'https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json': {
          const { data: { quoteText, quoteAuthor } } = await axios.get(`https://cors-anywhere.herokuapp.com/${source}`);
          this.renderData(quoteText, quoteAuthor ?? false);
          break;
        }
        case 'https://api.api-ninjas.com/v1/quotes': {
          const { data } = await axios.get(source, {
            headers: { 'X-Api-Key': 'akxWnVBvUmGAjheE9llulw==TVZ6WIhfWDdCsx9o' },
          });
          const { quote, author } = data[0];
          this.renderData(quote, author ?? false);
          break;
        }
        case 'https://official-joke-api.appspot.com/random_joke': {
          const { data: { punchline, setup } } = await axios.get(source);
          this.renderData(setup, punchline ?? false);
          break;
        }
        case 'https://motivational-quotes1.p.rapidapi.com/motivation': {
          const { data } = await axios.request({
            method: 'POST',
            url: source,
            headers: {
              'content-type': 'application/json',
              'X-RapidAPI-Key': 'a07622a786mshaea27da6a042696p1c7a02jsncc2e1c7e534e',
              'X-RapidAPI-Host': 'motivational-quotes1.p.rapidapi.com',
            },
            data: '{"key1":"value","key2":"value"}',
          });
          this.renderData(data, false);
          break;
        }
        default:
          break;
      }
      this.btnSubmit.innerHTML = `Submit`;
    } catch (e) {
      console.log(e);
      this.form.reset();
      this.btnSubmit.innerHTML = `Submit`;
      toast('Something went wrong, open dev console', 'error');
    }
  }

  /**
   * Отображение данных на странице
   * @param {string} text - текст цитаты
   * @param {boolean} hasAuthor - наличие автора цитаты
   * @private
   */
  private renderData(text: string, hasАвтор: boolean): void {
    if (this.target.classList.contains('hidden')) {
      this.target.classList.remove('hidden');
    }
    this.target.innerHTML = `
       <button class='ml-auto' data-copy>
          <span class='pointer-events-none'>
            ${feather.icons.clipboard.toSvg()}
          </span>
       </button>
       <p>"${text}"</p>
       ${hasAuthor ? `<p>${hasAuthor}</p>` : ''}
    `;
  }

  /**
   * Обработка события копирования в буфер обмена
   * @param {Event} event - объект события
   * @private
   */
  private handleClipboard(event: Event) {
    const target = event.target as HTMLButtonElement;
    if (target.matches('[data-copy=""')) {
      const textarea = document.createElement('textarea');
      const text = this.target.querySelector('p')?.textContent;
      if (!text) return;
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
      toast('Success copied to clipboard', 'success');
    }
  }
}

// Создание экземпляра класса
new QuoteGenerator();
