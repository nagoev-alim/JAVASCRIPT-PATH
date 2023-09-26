import './style.css';

// Создаем класс Counter, который управляет счетчиком и кнопками.
class Counter {
  // Приватные свойства класса для хранения ссылок на элементы DOM.
  private count: HTMLParagraphElement;
  private buttons: NodeListOf<HTMLButtonElement>;

  // Конструктор класса.
  constructor() {
    // Вызываем метод render() для создания и отрисовки интерфейса на странице.
    this.render();

    // Находим элемент с атрибутом data-count и сохраняем ссылку на него в this.count.
    this.count = document.querySelector('[data-count]')!;

    // Находим все элементы с атрибутом data-type и сохраняем ссылки на них в this.buttons.
    this.buttons = document.querySelectorAll('[data-type]')!;

    // Добавляем обработчик клика на каждую кнопку, вызывая метод handleClick() и передавая кнопку в качестве аргумента.
    this.buttons.forEach(button => {
      button.addEventListener('click', () => this.handleClick(button));
    });
  }

  // Метод для обработки кликов на кнопках.
  handleClick(button: HTMLButtonElement):void {
    // Извлекаем значение атрибута data-type из кнопки.
    const { type } = button.dataset;

    // Проверяем, что элемент счетчика существует и значение data-type установлено.
    if (this.count && type) {
      // Получаем текущее значение счетчика и преобразуем его в число.
      const currentValue = parseInt(this.count.textContent || '0', 10);

      // Обрабатываем разные типы кнопок (инкремент, декремент, сброс).
      switch (type) {
        case 'increment':
          // Увеличиваем значение счетчика на 1 и обновляем его отображение.
          this.updateCounter(currentValue + 1);
          break;
        case 'decrement':
          // Уменьшаем значение счетчика на 1 и обновляем его отображение.
          this.updateCounter(currentValue - 1);
          break;
        case 'reset':
          // Сбрасываем значение счетчика и обновляем его отображение.
          this.updateCounter(0);
          break;
      }
    }
  }

  // Метод для обновления текста счетчика.
  private updateCounter(value: number):void {
    if (this.count) {
      // Устанавливаем новое значение текста счетчика.
      this.count.textContent = value.toString();
      // Обновляем стили счетчика в зависимости от его значения.
      this.updateCounterStyle(value);
    }
  }

  // Метод для обновления стилей счетчика.
  private updateCounterStyle(value: number) {
    if (this.count) {
      // Удаляем все классы стилей счетчика.
      this.count.classList.remove('text-green-400', 'text-red-400', 'text-black');

      // В зависимости от значения счетчика добавляем соответствующий класс стиля.
      if (value > 0) {
        this.count.classList.add('text-green-400');
      } else if (value < 0) {
        this.count.classList.add('text-red-400');
      } else {
        this.count.classList.add('text-black');
      }
    }
  }

  // Метод для отрисовки интерфейса на странице.
  render() {
    const root: HTMLDivElement = document.querySelector('#app')!;
    if (!root) return;
    if (root) {
      // Вставляем HTML-структуру счетчика и кнопок в корневой элемент.
      root.innerHTML = `
        <div class='grid gap-3 border shadow rounded max-w-md mx-auto w-full p-4 md:p-8'>
            <h1 class='text-center text-2xl font-bold lg:text-5xl'>Counter</h1>
            <p class='text-center text-6xl font-bold lg:text-8xl' data-count>0</p>
            <div class='grid gap-2 sm:grid-cols-3'>
              <button class='button font-bold shadow border border-red-400 text-red-400' data-type='decrement'>Decrement</button>
              <button class='button font-bold shadow border border-gray-400 text-gray-400' data-type='reset'>Reset</button>
              <button class='button font-bold shadow border border-green-400 text-green-400' data-type='increment'>Increment</button>
            </div>
          </div>
      `;
    }
  }
}

// Создаем экземпляр класса Counter, который начинает управление счетчиком и кнопками на веб-странице.
new Counter();

/* Simple Counter Example:
const counter = () => {
  let number = 0;
  return () => number++;
};

const n = counter()
console.log(n());
console.log(n());
console.log(n());
*/
