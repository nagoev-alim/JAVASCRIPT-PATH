import './style.scss';
import feather from 'feather-icons';

class Classname {

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
      </div>
    `;

  }

  private setupEventListeners(): void {
  }
}

new Classname();
