import './style.css';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import feather from 'feather-icons';

// Toastify({
//   text: '⛔️ Please enter a valid URL',
//   className: 'bg-none shadow-none bg-orange-100 text-black border border-orange-200',
//   duration: 3000,
//   gravity: 'bottom',
//   position: 'center',
// }).showToast();

class Classname {

  constructor() {
    this.initialize();
  }

  private initialize() {
    this.createDOM();
    this.setupEventListeners();
  }

  private createDOM() {
    const root = document.querySelector<HTMLDivElement>('#app');
    if (!root) return;

    root.innerHTML = `
      <div class='border shadow rounded max-w-md w-full p-3 grid gap-4'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'></h1>
      </div>
    `;

  }

  private setupEventListeners() {
  }
}

new Classname();
