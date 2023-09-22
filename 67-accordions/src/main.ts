import './style.scss';
import feather from 'feather-icons';

/**
 * Класс Accordions представляет компонент аккордеона.
 * @class
 */
class Accordions {
  private accordionItems01: NodeListOf<HTMLDivElement>;
  private accordionItems02: NodeListOf<HTMLDivElement>;

  /**
   * Создает экземпляр класса Accordions и инициализирует его.
   * @constructor
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует компонент, создавая DOM-структуру и устанавливая обработчики событий.
   * @private
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает DOM-структуру для компонента.
   * @private
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='accordion'>
        <div class='column'>
        <h3 class='title font-bold text-2xl'>Accordion</h3>
        <p>${feather.icons.info.toSvg()}Shows the block without closing the previously opened</p>
        <div class='accordion__item accordion__item--first'>
          ${Array.from({ length: 4 }).map(() => `
          <div class='accordion__container' data-container=''>
            <div class='accordion__header' data-header=''>
              <span class='accordion__title h5'>Lorem ipsum dolor sit amet?</span>
              <div class='accordion__icon' data-icon=''>${feather.icons.plus.toSvg()}</div>
            </div>
            <div class='accordion__body' data-body=''>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Exercitationem minima nesciunt sapiente veniam voluptatem! Consectetur dicta enim laudantium reprehenderit voluptas!</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Exercitationem minima nesciunt sapiente veniam voluptatem! Consectetur dicta enim laudantium reprehenderit voluptas!</p>
            </div>
          </div>
          `).join('')}
        </div>
      </div>

      <div class='column'>
        <h3 class='title font-bold text-2xl'>Accordion</h3>
        <p>${feather.icons.info.toSvg()}Shows the block by closing the previously opened</p>
        <div class='accordion__item accordion__item--second'>
          ${Array.from({ length: 4 }).map(() => `
          <div class='accordion__container' data-container=''>
            <div class='accordion__header' data-header=''>
              <span class='accordion__title h5'>Lorem ipsum dolor sit amet?</span>
              <div class='accordion__icon' data-icon=''>${feather.icons.plus.toSvg()}</div>
            </div>
            <div class='accordion__body' data-body=''>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Exercitationem minima nesciunt sapiente veniam voluptatem! Consectetur dicta enim laudantium reprehenderit voluptas!</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Exercitationem minima nesciunt sapiente veniam voluptatem! Consectetur dicta enim laudantium reprehenderit voluptas!</p>
            </div>
          </div>
          `).join('')}
        </div>
      </div>
      </div>
    `;
    this.accordionItems01 = document.querySelectorAll('.accordion__item--first [data-container]')!;
    this.accordionItems02 = document.querySelectorAll('.accordion__item--second [data-container]')!;
  }

  /**
   * Устанавливает обработчики событий для элементов аккордеона.
   * @private
   */
  private setupEventListeners(): void {
    this.accordionItems01.forEach((el) => el.querySelector('[data-header]').addEventListener('click', this.handleAccordionFirst.bind(this)));
    this.accordionItems02.forEach((el) => el.querySelector('[data-header]').addEventListener('click', this.handleAccordionSecond.bind(this)));
  }

  /**
   * Обработчик события клика на элементе аккордеона.
   * @param {MouseEvent} event - Событие клика.
   * @private
   */
  private handleAccordionFirst(event: MouseEvent): void {
    const target = event.target as HTMLDivElement;
    const parent = target.closest('[data-container]')!;
    const body = parent.querySelector('[data-body]')!;
    const icon = parent.querySelector('[data-icon]')!;
    parent.classList.toggle('open');
    body.style.height = parent.classList.contains('open') ? `${body.scrollHeight + 30}px` : `0px`;
    body.style.paddingTop = body.style.paddingBottom = parent.classList.contains('open') ? `15px` : `0px`;
    icon.innerHTML = parent.classList.contains('open') ? feather.icons.minus.toSvg() : feather.icons.plus.toSvg();
  }

  /**
   * Обработчик события клика на элементе аккордеона.
   * @param {MouseEvent} event - Событие клика.
   * @private
   */

  private handleAccordionSecond(event: MouseEvent): void {
    const target = event.target as HTMLDivElement;
    const parent = target.closest('[data-container]')!;
    const body = parent.querySelector('[data-body]')!;
    const icon = parent.querySelector('[data-icon]')!;

    if (parent.classList.contains('open')) {
      parent.classList.remove('open');
      body.style.height = `0px`;
      body.style.paddingTop = body.style.paddingBottom = `0px`;
      icon.innerHTML = feather.icons.plus.toSvg();
    } else {
      this.accordionItems02.forEach((element, elementIdx) => {
        element.classList.remove('open');
        const body = element.querySelector('[data-body]')!;
        const icon = element.querySelector('[data-icon]')!;
        body.style.height = body.style.paddingTop = body.style.paddingBottom = `0px`;
        icon.innerHTML = feather.icons.plus.toSvg();
      });
      parent.classList.add('open');
      body.style.height = `${body.scrollHeight + 30}px`;
      body.style.paddingTop = body.style.paddingBottom = `15px`;
      icon.innerHTML = feather.icons.minus.toSvg();
    }
  }
}

// Создаем экземпляр класса Accordions.
new Accordions();
