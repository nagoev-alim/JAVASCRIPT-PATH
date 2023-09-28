import './style.scss';
import feather from 'feather-icons';
import axios from 'axios';
import { toast } from './utils/toast.ts';

/**
 * Интерфейс для представления блюда.
 */
interface Meal {
  strMealThumb: string;
  idMeal: string;
  strMeal: string;
}

/**
 * Класс MealFinder для поиска и отображения информации о блюдах.
 */
class MealFinder {
  private form: HTMLFormElement;
  private randomBtn: HTMLButtonElement;
  private mealHeading: HTMLDivElement;
  private mealList: HTMLUListElement;
  private mealSingle: HTMLDivElement;
  private content: HTMLDivElement;

  /**
   * Конструктор класса MealFinder.
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализация приложения Meal Finder.
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает DOM-элементы приложения.
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='bg-white border shadow rounded max-w-4xl w-full p-3 grid gap-4'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Meal Finder</h1>
        <div class='grid gap-3'>
          <form class='grid gap-3' data-form>
            <label>
              <input class='px-3 py-2 border rounded w-full focus:outline-none focus:border-blue-400 bg-slate-50' type='text' name='search' placeholder='Search for meals or keywords'/>
            </label>
            <button class='px-3 py-2 border hover:bg-slate-50' type='submit'>Submit</button>
          </form>

          <div class='flex justify-center items-center'>
            <button class='p-2 border rounded hover:bg-slate-50' data-random>${feather.icons['refresh-cw'].toSvg()}</button>
          </div>
        </div>
        <div class='hidden gap-3' data-content>
          <div class='' data-meal-heading></div>
          <ul class='grid gap-3 grid-cols-2 sm:grid-cols-3' data-meal-list></ul>
          <div class='grid gap-3' data-meal-single></div>
        </div>
      </div>
    `;

    this.form = root.querySelector('[data-form]')!;
    this.randomBtn = root.querySelector('[data-random]')!;
    this.mealHeading = root.querySelector('[data-meal-heading]')!;
    this.mealList = root.querySelector('[data-meal-list]')!;
    this.mealSingle = root.querySelector('[data-meal-single]')!;
    this.content = root.querySelector('[data-content]')!;
  }

  /**
   * Настройка обработчиков событий.
   */
  private setupEventListeners(): void {
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    this.randomBtn.addEventListener('click', this.handleGetRandom.bind(this));
    this.mealList.addEventListener('click', this.handleMealsClick.bind(this));
  }

  /**
   * Обработчик события отправки формы.
   * @param event Событие отправки формы.
   */
  private async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const search = formData.get('search') as string;
    const button = form.querySelector('button')!;
    this.mealSingle.innerHTML = '';

    if (!search || search.trim().length === 0) {
      toast('Please enter a search term', 'warning');
      return;
    }

    try {
      const { data: { meals } } = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`);
      this.mealHeading.innerHTML = `<h4 class='text-lg'>Search results for <span class='font-bold'>'${search}'</span>:</h4>`;
      this.content.classList.remove('hidden');
      this.content.classList.add('grid');
      button.textContent = 'Loading...';

      if (meals === null) {
        this.mealHeading.innerHTML = this.mealList.innerHTML = '';
        toast('There are no search results. Try again!', 'warning');
      } else {
        this.mealList.innerHTML = meals.map(({ strMealThumb, idMeal, strMeal }: Meal) => `
          <li class='p-2 rounded border-2 cursor-pointer' data-id='${idMeal}'>
            <img class='rounded pointer-events-none' src='${strMealThumb}' alt='${strMeal}' />
            <h6 class='p-3 font-bold text-center pointer-events-none'>${strMeal}</h6>
          </li>
        `).join('');
      }

      button.textContent = 'Submit';
      form.reset();
    } catch (e) {
      toast('Something wrong, open console', 'error');
      this.content.classList.add('hidden');
      this.content.classList.remove('grid');
      button.textContent = 'Submit';
      console.log(e);
    }
  }

  /**
   * Обработчик события получения случайного блюда.
   */
  private async handleGetRandom(): Promise<void> {
    try {
      this.content.classList.remove('hidden');
      this.content.classList.add('grid');
      this.mealHeading.innerHTML = this.mealList.innerHTML = '';
      const { data: { meals } } = await axios.get<{
        meals: Meal[]
      }>('https://www.themealdb.com/api/json/v1/1/random.php');
      this.renderHTML(meals[0]);
    } catch (e) {
      toast('Something went wrong, open dev console', 'error');
      this.content.classList.add('hidden');
      this.content.classList.remove('grid');
      console.log(e);
    }
  }

  /**
   * Отображает информацию о блюде.
   * @param entry Информация о блюде.
   */
  private renderHTML(entry): void {
    const ingredients = [];

    for (let i = 1; i <= 20; i++) {
      if (entry[`strIngredient${i}`]) {
        ingredients.push(`${entry[`strIngredient${i}`]} - ${entry[`strMeasure${i}`]}`);
      } else {
        break;
      }
    }

    const { strMeal, strMealThumb, strCategory, strArea, strInstructions } = entry;

    this.mealSingle.innerHTML = `
      <h2 class='font-bold text-lg'>${strMeal}</h2>
      <img class='max-w-[300px] rounded' src='${strMealThumb}' alt='${strMeal}' />
      <div class='grid gap-2'>
        ${strCategory ? `<p><span class='font-bold'>Category:</span> ${strCategory}</p>` : ''}
        ${strArea ? `<p><span class='font-bold'>Area:</span> ${strArea}</p>` : ''}
      </div>
      <div class='grid gap-2'>
        <p>${strInstructions}</p>
        <h3 class='font-bold'>Ingredients:</h3>
        <ul class='list-disc list-inside'>${ingredients.map(ing => `<li>${ing}</li>`).join('')}</ul>
      </div>`;
  }

  /**
   * Обработчик щелчка по блюду в списке.
   * @param event Событие щелчка мыши.
   */
  private async handleMealsClick(event: MouseEvent): Promise<void> {
    const target = event.target as HTMLLIElement;
    if (target.matches('[data-id]')) {
      try {
        const { data: { meals } } = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${target.dataset.id}`);
        this.renderHTML(meals[0]);
      } catch (e) {
        toast('Something went wrong, open dev console', 'error');
        this.content.classList.add('hidden');
        this.content.classList.remove('grid');
        console.log(e);
      }
    }
  }
}

new MealFinder();
