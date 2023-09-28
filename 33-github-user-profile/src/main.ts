import './style.scss';
import { toast } from './utils/toast.ts';
import axios, { AxiosResponse } from 'axios';
import feather from 'feather-icons';

/**
 * Интерфейс для данных о пользователе GitHub.
 * @interface
 */
interface UserData {
  login: string;
  html_url: string;
  avatar_url: string;
  followers: number;
  following: number;
  public_gists: number;
  public_repos: number;
  bio: string | null;
}

/**
 * Интерфейс для данных о репозиториях GitHub пользователя.
 * @interface
 */
interface RepoData {
  html_url: string;
  name: string;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
}

/**
 * Класс для отображения профиля пользователя GitHub и его репозиториев.
 * @class
 */
class GithubUserProfile {
  /**
   * HTML-форма для поиска пользователя GitHub.
   * @type {HTMLFormElement}
   * @private
   */
  private form: HTMLFormElement;

  /**
   * HTML-элемент для отображения информации о пользователе GitHub.
   * @type {HTMLDivElement}
   * @private
   */
  private user: HTMLDivElement;

  /**
   * HTML-элемент для отображения информации о репозиториях пользователя GitHub.
   * @type {HTMLDivElement}
   * @private
   */
  private repos: HTMLDivElement;

  /**
   * URL базового API GitHub.
   * @type {string}
   * @readonly
   * @private
   */
  private readonly URL: string = 'https://api.github.com';


  /**
   * Создает экземпляр класса GithubUserProfile и инициализирует компонент.
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
   * Создает DOM-элементы для компонента.
   * @private
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='bg-white border shadow rounded max-w-4xl w-full p-3 grid gap-4'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>GitHub User Profile</h1>
        <form class='grid gap-3' data-form>
          <label>
            <input class='px-3 py-2 border-2 w-full rounded focus:outline-none focus:border-blue-400 bg-slate-50' type='text' name='query' placeholder='Enter username'>
          </label>
          <button class='px-3 py-2 border hover:bg-slate-50'>Submit</button>
        </form>
        <div class='hidden place-items-center gap-3' data-user></div>
        <div class='hidden' data-repos></div>
      </div>
    `;
    this.form = root.querySelector('[data-form]')!;
    this.user = root.querySelector('[data-user]')!;
    this.repos = root.querySelector('[data-repos]')!;
  }

  /**
   * Устанавливает обработчики событий для формы поиска.
   * @private
   */
  private setupEventListeners(): void {
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
  }


  /**
   * Обработчик события отправки формы поиска пользователя GitHub.
   * @param {Event} event - Событие отправки формы.
   * @private
   */
  private async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const query = formData.get('query') as string | undefined;
    const button = form.querySelector('button')!;
    if (typeof query === 'string') {
      if (query.length === 0) {
        toast('Please fill the field', 'warning');
        return;
      }
      try {
        button.textContent = 'Loading...';

        const [userResponse, reposResponse] = await Promise.all<AxiosResponse<UserData>, AxiosResponse<RepoData[]>>([
          axios.get<UserData>(`${this.URL}/users/${query}`),
          axios.get<RepoData[]>(`${this.URL}/users/${query}/repos?sort=created&per_page=10`),
        ]);

        this.renderUser(userResponse.data);
        this.renderRepos(reposResponse.data);

        button.textContent = 'Submit';

      } catch (e) {
        toast('User not found', 'error');
        button.textContent = 'Submit';
        form.reset();
        return;
      }
    }
  }

  /**
   * Отображает информацию о пользователе GitHub.
   * @param {UserData} data - Данные пользователя.
   * @private
   */
  private renderUser(data: UserData): void {
    this.user.classList.remove('hidden');
    this.user.classList.add('grid');
    this.user.innerHTML = `
        <h3 class='text-3xl font-bold'>About <span class=''>${data.login}</span></h3>
        <div class='grid gap-3 place-items-center text-center'>
          <img class='rounded-full w-[100px] h-[100px]' src='${data.avatar_url}' alt='${data.login}'>
          <a class='px-3 py-2 border hover:bg-slate-50' href='${data.html_url}' target='_blank'>View Profile</a>
          <div>${data.bio !== null ? data.bio : ''}</div>
          <ul class='flex flex-wrap gap-3 items-center justify-center'>
            <li class='border font-medium rounded p-2 bg-red-400'>Followers: ${data.followers}</li>
            <li class='border font-medium rounded p-2 bg-blue-400'>Following: ${data.following}</li>
            <li class='border font-medium rounded p-2 bg-slate-400'>Public Repos: ${data.public_repos}</li>
            <li class='border font-medium rounded p-2 bg-green-400'>Public Gists: ${data.public_gists}</li>
          </ul>
        </div>`;
  }

  /**
   * Отображает информацию о репозиториях пользователя GitHub.
   * @param {RepoData[]} data - Данные репозиториев.
   * @private
   */
  private renderRepos(data: RepoData[]): void {
    this.repos.classList.remove('hidden');
    this.repos.classList.add('grid', 'gap-3');
    this.repos.innerHTML = data.length === 0 ? '' : `
      <h3 class='text-3xl font-bold text-center'>Latest Repos:</h3>
      <ul class='grid gap-3'>
        ${data.map(repo => `
          <li class='border-2 rounded p-2'>
            <a target='_blank' href='${repo.html_url}' class='grid gap-3'>
              <h4 class='font-bold'>${repo.name}</h4>
              <div class='flex flex-wrap gap-3 items-center'>
                <div class='flex gap-2 items-center'>
                    ${feather.icons.star.toSvg()}
                    ${repo.stargazers_count} stars
                </div>
                <div class='flex gap-2 items-center'>
                    ${feather.icons.eye.toSvg()}
                    ${repo.watchers_count} watchers
                </div>
                <div class='flex gap-2 items-center'>
                   ${feather.icons['git-merge'].toSvg()}
                    ${repo.forks_count} forks
                </div>
              </div>
            </a>
          </li>
        `).join('')}
      </ul>`;
  }
}

new GithubUserProfile();
