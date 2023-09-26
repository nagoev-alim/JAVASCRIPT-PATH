// Подключаем стили
import './style.css';

// Создаем класс KeyDetector для обработки событий клавиатуры
class KeyDetector {
  private keyElements: NodeListOf<HTMLSpanElement> | null = null; // Список элементов для отображения клавиши
  private keyCodeElements: NodeListOf<HTMLSpanElement> | null = null; // Список элементов для отображения кода клавиши
  private preview: HTMLParagraphElement | null = null; // Элемент для предварительного отображения текста
  private container: HTMLDivElement | null = null; // Контейнер для скрытия/отображения элементов

  constructor() {
    this.initialize(); // Вызываем метод инициализации
  }

  private initialize() {
    this.createDOM(); // Создаем структуру DOM
    this.setupEventListeners(); // Устанавливаем обработчики событий
  }

  private createDOM() {
    // Получаем корневой элемент с id "app"
    const root:HTMLDivElement = document.querySelector('#app')!;
    if (!root) return; // Если элемент не найден, выходим из метода

    // Создаем структуру DOM для отображения информации о нажатой клавише
    root.innerHTML = `
      <div class='border shadow rounded max-w-md w-full p-3 grid gap-4'>
        <p class='font-bold text-center text-2xl md:text-3xl' data-preview>Press any key</p>
        <div class='grid gap-4 hidden' data-container>
          <div class='grid gap-2 place-items-center'>
            <span class='inline-flex justify-center items-center text-red-400 uppercase font-bold text-4xl border border-4 border-red-400 rounded-full w-[70px] h-[70px] md:w-[90px] md:h-[90px]' data-value='keyCode'>32</span>
            <span class='uppercase font-bold text-2xl text-red-400 md:text-4xl' data-value='key'>Space</span>
          </div>
          <div class='grid grid-cols-2 place-items-center'>
            <p class='font-bold text-2xl text-center w-full'>Key: <span class='font-normal' data-value='key'>Space</span></p>
            <p class='font-bold text-2xl text-center border-l-2 border-slate-900 w-full'>Code: <span class='font-normal' data-value='keyCode'>32</span></p>
          </div>
        </div>
      </div>
    `;

    // Находим необходимые элементы DOM и сохраняем их в соответствующих свойствах
    this.keyElements = document.querySelectorAll('[data-value="key"]') as NodeListOf<HTMLSpanElement>;
    this.keyCodeElements = document.querySelectorAll('[data-value="keyCode"]') as NodeListOf<HTMLSpanElement>;
    this.preview = document.querySelector<HTMLParagraphElement>('[data-preview]');
    this.container = document.querySelector<HTMLDivElement>('[data-container]');
  }

  private setupEventListeners(): void {
    // Устанавливаем обработчик события "keydown" для окна браузера
    window.addEventListener('keydown', ({ key, keyCode }) => {
      // Скрываем предварительное сообщение и отображаем контейнер
      this.preview?.classList.add('hidden');
      this.container?.classList.remove('hidden');

      // Обновляем текст в элементах для отображения клавиши и кода клавиши
      this.keyElements?.forEach(k => k.textContent = key === ' ' ? 'Space' : key);
      this.keyCodeElements?.forEach(k => k.textContent = keyCode.toString());
    });
  }
}

// Создаем экземпляр класса KeyDetector, начинаем обработку событий
new KeyDetector();
