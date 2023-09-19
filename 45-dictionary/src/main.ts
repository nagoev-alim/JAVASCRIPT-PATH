import './style.scss';
import feather from 'feather-icons';
import { toast } from './utils/toast.ts';
import axios from 'axios';

/**
 * Класс Dictionary представляет словарь для поиска слов в английском языке и получения их значения, примеров использования и синонимов.
 * @class
 */
class Dictionary {
  form: HTMLFormElement;
  formBtn: HTMLButtonElement;
  formInput: HTMLInputElement;
  info: HTMLParagraphElement;
  result: HTMLDivElement;
  resultWord: HTMLDivElement;
  resultSpeech: HTMLButtonElement;
  resultMeaning: HTMLDivElement;
  resultExample: HTMLDivElement;
  resultSynonyms: HTMLDivElement;
  private audio: null | HTMLAudioElement;

  /**
   * Создает экземпляр класса Dictionary.
   * @constructor
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует словарь, создавая DOM-элементы и настраивая обработчики событий.
   * @private
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }


  /**
   * Создает DOM-элементы для отображения интерфейса словаря.
   * @private
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='bg-white border shadow rounded max-w-md w-full p-3 grid gap-4'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>English Dictionary</h1>
        <form data-form>
          <label class='relative w-full'>
            <input class='px-3 py-2 pl-9 pr-8 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50' type='text' placeholder='Search a word' name='word' spellcheck='false' data-form-input>
            <div class='absolute left-2 top-1/2 -translate-y-1/2'>${feather.icons.search.toSvg()}</div>
            <button class='hidden absolute right-2 top-1/2 -translate-y-1/2' type='button' data-form-clear>
              ${feather.icons.x.toSvg()}
            </button>
          </label>
        </form>
        <p class='' data-info>Type any existing word and press enter to get meaning, example, synonyms, etc.</p>
        <div class='hidden' data-result>
          <div class='flex items-center gap-2 justify-between mb-3'>
            <div class='' data-word>
              <span class='text-xl font-bold'>car</span>
              <p class='text-gray-500'>noun //kɑː//</p>
            </div>
            <button class='p-3 border hover:bg-slate-50' data-speech>
              ${feather.icons['volume-2'].toSvg()}
            </button>
          </div>

          <div class='border-2 p-2 rounded mb-2' data-meaning>
            <h3 class='font-bold text-lg'>Meaning</h3>
            <p></p>
          </div>

          <div class='border-2 p-2 rounded mb-2' data-example>
            <h3 class='font-bold text-lg'>Example</h3>
            <p></p>
          </div>

          <div class='border-2 p-2 rounded' data-synonyms>
            <h3 class='font-bold text-lg'>Synonyms</h3>
            <ul class='flex flex-wrap gap-1.5'></ul>
          </div>
        </div>
      </div>
    `;

    this.form = root.querySelector('[data-form]')!;
    this.formBtn = root.querySelector('[data-form-clear]')!;
    this.formInput = root.querySelector('[data-form-input]')!;
    this.info = root.querySelector('[data-info]')!;
    this.result = root.querySelector('[data-result]')!;
    this.resultWord = root.querySelector('[data-word]')!;
    this.resultSpeech = root.querySelector('[data-speech]')!;
    this.resultMeaning = root.querySelector('[data-meaning]')!;
    this.resultExample = root.querySelector('[data-example]')!;
    this.resultSynonyms = root.querySelector('[data-synonyms]')!;
  }

  /**
   * Настраивает обработчики событий для элементов интерфейса.
   * @private
   */
  private setupEventListeners(): void {
    this.formInput.addEventListener('input', this.handleInput.bind(this));
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    this.formBtn.addEventListener('click', this.handleReset.bind(this));
    this.resultSpeech.addEventListener('click', this.handleSpeech.bind(this));
    this.resultSynonyms.addEventListener('click', this.handleSynonymsClick.bind(this));
  }

  /**
   * Обрабатывает ввод текста в поле поиска и отображает/скрывает кнопку очистки.
   * @param {Object} event - Событие ввода текста.
   * @param {string} event.target.value - Текст введенный пользователем.
   * @private
   */
  private handleInput({ target: { value } }: { target: { value: string } }) {
    this.formBtn.className = `${value.trim().length !== 0 ? 'absolute right-2 top-1/2 -translate-y-1/2' : 'hidden'}`;
  }

  /**
   * Обрабатывает отправку формы поиска и запрос к API для получения данных о слове.
   * @param {Event} event - Событие отправки формы.
   * @private
   */
  private handleSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const word = formData.get('word') as string;

    if (word.trim().length === 0 || !word) {
      toast('Please enter a word', 'warning');
      return;
    }

    this.fetchData(word);
  }

  /**
   * Выполняет запрос к API для получения данных о слове.
   * @param {string} term - Слово для поиска.
   * @private
   */
  private async fetchData(term: string) {
    try {
      this.info.innerHTML = `Searching the meaning of <span class='font-bold'>"${term}"</span>`;
      const { data } = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${term}`);
      const { phonetics, word, meanings } = data[0];
      this.result.classList.remove('hidden');
      this.resultWord.querySelector('span')!.innerHTML = `${word}`;
      this.resultWord.querySelector('p')!.innerHTML = `${meanings[0].partOfSpeech}  /${phonetics[0]?.text}/`;
      this.resultMeaning.querySelector('p')!.innerHTML = `${meanings[0].definitions[0].definition}.`;
      if (meanings[0].definitions[0].example === undefined) {
        this.resultExample.classList.add('hidden');
      } else {
        this.resultExample.classList.remove('hidden');
        this.resultExample.querySelector('p')!.innerHTML = `${meanings[0].definitions[0].example}.`;
      }
      if (meanings[0].synonyms.length !== 0) {
        this.resultSynonyms.querySelector('ul')!.innerHTML = `${meanings[0].synonyms.map(i => `<li class='border bg-slate-50 rounded px-2 py-1.5 cursor-pointer' data-term='${i}'>${i}</li>`).join('')}`;
        this.resultSynonyms.classList.remove('hidden');
      } else {
        this.resultSynonyms.classList.add('hidden');
      }
      if (phonetics[0] !== undefined) {
        this.audio = phonetics[0].audio === '' ? null : new Audio(phonetics[0].audio);
        this.audio === null ? this.resultSpeech.classList.add('hide') : this.resultSpeech.classList.remove('hidden');
      }
    } catch (e) {
      console.log(e);
      toast('Something wrong, open console', 'error');
      this.info.innerHTML = `Can't find the meaning of <span class='font-bold'>"${term}"</span>. Please, try to search for another word.`;
      this.result.classList.add('hide');
    }
  }

  /**
   * Сбрасывает состояние формы и очищает результаты поиска.
   * @private
   */
  private handleReset() {
    this.form.reset();
    this.formInput.focus();
    this.formBtn.classList.add('hidden');
    this.info.innerHTML = `Type any existing word and press enter to get meaning, example, synonyms, etc.`;
    this.result.classList.add('hidden');
  }

  /**
   * Воспроизводит звуковое произношение слова (если доступно).
   * @private
   */
  private handleSpeech() {
    this.audio?.play();
  }

  /**
   * Обрабатывает клик на синоним слова и выполняет поиск синонима.
   * @param {Object} param - Параметры события.
   * @param {HTMLDivElement} param.target - HTML-элемент синонима.
   * @private
   */
  private handleSynonymsClick({ target }: { target: HTMLDivElement }) {
    if (target.matches('[data-term]') && target.dataset.term !== undefined) {
      this.fetchData(target.dataset.term);
      this.formInput.value = target.dataset.term;
    }
  }
}

// Создание экземпляра словаря
new Dictionary();
