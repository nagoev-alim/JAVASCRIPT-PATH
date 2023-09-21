import './style.scss';
import feather from 'feather-icons';

interface IData {
  ico: string,
  label: string
}

const data: IData[] = [
  {
    ico: `<i class='bx bx-plus-circle'></i>`,
    label: 'Create New',
  },
  {
    ico: `<i class='bx bx-book'></i>`,
    label: 'All Drafts',
  },
  {
    ico: `<i class='bx bx-folder'></i>`,
    label: 'Move To',
  },
  {
    ico: `<i class='bx bx-user'></i>`,
    label: 'Profile Settings',
  },
  {
    ico: `<i class='bx bx-bell'></i>`,
    label: 'Notification',
  },
  {
    ico: `<i class='bx bx-cog'></i>`,
    label: 'Settings',
  },
];

class Dropdown {
  private dropdown: HTMLUListElement;
  private trigger: HTMLButtonElement;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='bg-white border shadow rounded max-w-md w-full p-3 grid gap-4'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'></h1>
        <div class='components'>
          <div class='component01'>
            <div class='dropdown'>
              <button class='dropdown__trigger' data-trigger>
                  Dropdown
                  <i class='bx bx-chevron-down'></i>
              </button>
              <ul class='dropdown__list' data-dropdown>
                ${data.map(({ ico, label }) => `
                  <li class='dropdown__item'>
                      <a href='#' class='dropdown__link'>${ico} ${label}</a>
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;
    this.dropdown = root.querySelector('[data-dropdown]')!;
    this.trigger = root.querySelector('[data-trigger]')!;
  }

  private setupEventListeners(): void {
    this.trigger.addEventListener('click', this.toggleDropdown.bind(this));
    document.documentElement.addEventListener('click', this.documentHandler.bind(this));
  }

  private toggleDropdown(): void {
    this.dropdown.classList.toggle('show');
    const icon = this.trigger.querySelector('i')!;
    icon.classList.toggle('arrow');
  }

  private documentHandler(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.matches('[data-trigger]')) {
      if (this.dropdown.classList.contains('show')) {
        this.toggleDropdown();
      }
    }
  }
}

new Dropdown();
