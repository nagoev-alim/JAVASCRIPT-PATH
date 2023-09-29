import './style.scss';

/**
 * Класс SortableTable представляет собой таблицу, которую можно сортировать по столбцам.
 * @class
 */
class SortableTable {
  /**
   * @private
   * @type {NodeListOf<HTMLTableHeaderCellElement>}
   */
  private tableHeader: NodeListOf<HTMLTableHeaderCellElement>;

  /**
   * Создает экземпляр класса SortableTable.
   * @constructor
   */
  constructor() {
    this.initialize();
  }

  /**
   * Инициализирует класс, создает DOM-элементы и устанавливает обработчики событий.
   * @private
   */
  private initialize(): void {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает DOM-элементы для таблицы и вставляет их в корневой элемент с id "app".
   * @private
   */
  private createDOM(): void {
    const root = document.querySelector('#app') as HTMLDivElement;
    if (!root) return;

    root.innerHTML = `
      <div class='bg-white border shadow rounded max-w-xl w-full p-3 grid gap-4'>
        <h1 class='text-center font-bold text-2xl md:text-4xl'>Sortable Table</h1>
        <table>
          <thead>
           <tr>${['Rank', 'Name', 'Age', 'Occupation'].map(n => `<th class='p-3 bg-neutral-900 text-white border'>${n}</th>`).join('')}</tr>
          </thead>
          <tbody>
           <tr>${['1', 'Dom', '35', 'Web Developer'].map(n => `<td class='border p-3'>${n}</td>`).join('')}</tr>
           <tr>${['2', 'Rebecca', '29', 'Teacher'].map(n => `<td class='border p-3'>${n}</td>`).join('')}</tr>
           <tr>${['3', 'John', '30', 'Civil Engineer'].map(n => `<td class='border p-3'>${n}</td>`).join('')}</tr>
           <tr>${['4', 'Andre', '20', 'Dentist'].map(n => `<td class='border p-3'>${n}</td>`).join('')}</tr>
          </tbody>
        </table>
      </div>
    `;

    this.tableHeader = root.querySelectorAll('table th')!;
  }

  /**
   * Устанавливает обработчики событий для заголовков таблицы.
   * @private
   */
  private setupEventListeners(): void {
    this.tableHeader.forEach(c => c.addEventListener('click', this.handleClick.bind(this)));
  }

  /**
   * Обработчик события клика по заголовку столбца таблицы.
   * Сортирует таблицу по выбранному столбцу.
   * @param {Object} event - Событие клика.
   * @private
   */
  private handleClick({ target }: { target: HTMLTableHeaderCellElement }): void {
    const table = target.closest('table') as HTMLTableElement;
    const targetIndex = Array.from(target.parentElement!.children).indexOf(target);
    const currentIsAscending = target.classList.contains('asc');
    this.sortTable(table, targetIndex, !currentIsAscending);
  }

  /**
   * Сортирует таблицу по указанному столбцу.
   * @param {HTMLTableElement} table - HTML-элемент таблицы.
   * @param {number} column - Индекс столбца для сортировки.
   * @param {boolean} asc - Направление сортировки (true - по возрастанию, false - по убыванию).
   * @private
   */
  private sortTable(table: HTMLTableElement, column: number, asc = true): void {
    const dir = asc ? 1 : -1;
    const body = table.tBodies[0];
    const rows = Array.from(body.querySelectorAll('tr'));
    const sortedRows = rows.sort((a, b) => {
      const columnA = a.querySelector(`td:nth-child(${column + 1})`)!.textContent!.trim();
      const columnB = b.querySelector(`td:nth-child(${column + 1})`)!.textContent!.trim();
      return columnA > columnB ? (1 * dir) : (-1 * dir);
    });
    while (body.firstChild) {
      body.removeChild(body.firstChild);
    }
    body.append(...sortedRows);
    table.querySelectorAll('th').forEach(th => th.classList.remove('asc', 'desc'));
    table.querySelector(`th:nth-child(${column + 1})`)!.classList.toggle('asc', asc);
    table.querySelector(`th:nth-child(${column + 1})`)!.classList.toggle('desc', !asc);
  };
}

// Создаем экземпляр класса SortableTable.
new SortableTable();
