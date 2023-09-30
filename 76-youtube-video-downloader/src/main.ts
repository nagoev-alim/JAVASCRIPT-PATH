import './style.scss';
import { toast } from './utils/toast.ts';
import axios, { AxiosResponse } from 'axios';

/**
 * Интерфейс VideoData представляет структуру данных видео, получаемых с сервера.
 * @interface
 */
interface VideoData {
  author: string;  // Автор видео
  link: string;    // Ссылка на видео
  status: string;  // Статус загрузки видео
  thumb: string;   // URL миниатюры видео
  title: string;   // Заголовок видео
  length: number;  // Длительность видео (предполагая, что это число)
}

/**
 * Класс YoutubeToMp3Converter представляет собой конвертер видео из YouTube в MP3.
 * @class
 */
class YoutubeToMp3Converter {
  private REGEX: RegExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  private form: HTMLFormElement;
  private info: HTMLDivElement;

  /**
   * Создает экземпляр класса YoutubeToMp3Converter и инициализирует компонент.
   * @constructor
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует компонент, создавая DOM-элементы и устанавливая обработчики событий.
   * @private
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает DOM-элементы для отображения компонента.
   * @private
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='bg-white border shadow rounded max-w-md w-full p-3 grid gap-4'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>YouTube to MP3 Converter</h1>
        <div class='grid gap-3'>
          <form class='grid gap-2' data-form>
            <label>
              <input class='px-3 py-2 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50' type='text' name='url' placeholder='Paste your youtube url here..'>
            </label>
            <button class='px-3 py-2 border hover:bg-slate-50' type='submit'>Submit</button>
          </form>
          <div class='result hidden'>
            <div class='grid gap-3' data-info></div>
          </div>
        </div>
      </div>
    `;
    this.form = root.querySelector('[data-form]')!;
    this.info = root.querySelector('[data-info]')!;
  }

  /**
   * Устанавливает обработчики событий для элементов компонента.
   * @private
   */
  private setupEventListeners(): void {
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
  }

  /**
   * Обрабатывает отправку формы.
   * @param {Event} event - Объект события отправки формы.
   * @private
   */
  private handleSubmit(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const url = formData.get('url') as string;
    if (!this.REGEX.test(url)) {
      toast('Please enter validate URL', 'warning');
      return;
    }
    const match = url.match(this.REGEX);
    if (match && match[7].length === 11) this.fetchData(match[7]);
  }

  /**
   * Асинхронно получает данные о видео с сервера.
   * @param {string} id - Идентификатор видео.
   * @returns {Promise<void>}
   * @private
   */
  private async fetchData(id): Promise<void> {
    try {
      this.form.querySelector('button')!.textContent = 'Loading...';
      const response: AxiosResponse<{ data: VideoData }> = await axios({
        method: 'GET',
        url: 'https://youtube-mp3-download1.p.rapidapi.com/dl',
        params: { id },
        headers: {
          'X-RapidAPI-Key': 'a07622a786mshaea27da6a042696p1c7a02jsncc2e1c7e534e',
          'X-RapidAPI-Host': 'youtube-mp3-download1.p.rapidapi.com',
        },
      });
      const data = response.data;

      if (data.status !== 'ok') {
        this.setDefault();
        toast('Something went wrong, open developer console', 'error');
        return;
      }
      this.info.innerHTML = `
      <div class='grid grid-cols-[100px_auto] gap-3 items-center'>
        <img src='${data.thumb}' alt='${data.title}'>
        <h3 class='font-bold'><a href='https://www.youtube.com/watch?v=${id}' target='_blank'>${data.title} - ${data.author} (${length})</a></h3>
      </div>
      <a href='${data.link}' target='_blank' class='px-3 py-2 border hover:bg-slate-50 flex justify-center items-center'>Download</a>
       `;
      this.setDefault();
    } catch (e) {
      toast('Something went wrong, open developer console', 'error');
      console.log(e);
      this.setDefault();
    }
  }

  /**
   * Восстанавливает начальное состояние компонента.
   * @private
   */
  private setDefault(): void {
    document.querySelector('.result')!.classList.remove('hidden');
    this.form.querySelector('button')!.textContent = 'Submit';
  }
}

// Создаем экземпляр класса при загрузке страницы.
new YoutubeToMp3Converter();
