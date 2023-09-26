import './style.css';
import { capitalStr } from './utils/capitalStr.ts';

/**
 * Представляет структуру данных для каждого типа измерения и его единиц.
 */
interface ConverterData {
  name: string;     // Название типа измерения.
  values: string[]; // Массив единиц измерения для данного типа.
}

/**
 * Класс, управляющий приложением Type Converter.
 */
class TypeConverter {
  /**
   * Данные, содержащие типы измерений и их единицы.
   */
  private data: ConverterData[] = [
    {
      name: 'weight',
      values: ['pounds', 'ounces', 'stones', 'kilograms', 'grams'],
    },
    {
      name: 'temperature',
      values: ['fahrenheit', 'celsius', 'kelvin'],
    },
    {
      name: 'length',
      values: ['feet', 'inches', 'yards', 'miles', 'meters', 'cm', 'kilometers'],
    },
    {
      name: 'speed',
      values: ['MPH', 'KPH', 'Knots', 'Mach'],
    },
  ];

  /**
   * Инициализирует класс TypeConverter, создает структуру DOM и настраивает слушателей событий.
   */
  constructor() {
    this.createDOM();
    this.setupEventListeners();
  }

  /**
   * Создает структуру DOM для приложения Type Converter.
   */
  private createDOM(): void {
    const root: HTMLDivElement = document.querySelector('#app')!;
    if (!root) return;
    root.innerHTML = `
    <div class='max-w-5xl mx-auto grid gap-4'>
      <h1 class='text-center font-bold text-2xl md:text-4xl'>Type Converter</h1>
      <div class='grid gap-4 items-start md:grid-cols-2'>
      ${this.data.map(({ name, values }) => `
        <section class='border shadow p-4 rounded grid gap-3 ${name}-converters'>
          <h3 class='font-bold text-2xl'>${capitalStr(name)} Converter</h3>
          <p>Type a value in any of the fields to convert between ${name} measurements:</p>
          <form class='grid gap-2'>
          ${values.map(item => `
            <label class='grid gap-1'>
              <span class='font-medium'>${capitalStr(item)}</span>
              <input class='border-2 px-3 py-2.5 bg-gray-50 rounded focus:outline-none focus:border-blue-400' type='number' placeholder='${capitalStr(item)}' data-${name}='${item.toLowerCase()}'>
            </label>
          `).join('')}
          </form>
        </section>
        `).join('')}
      </div>
    </div>
    `;
  }

  /**
   * Устанавливает слушателей событий для полей ввода.
   */
  private setupEventListeners(): void {
    this.data.forEach(({ name }) => {
      document.querySelectorAll(`[data-${name}]`).forEach((value) => {
        value.addEventListener('input', () => this.converter(value));
        value.addEventListener('change', () => this.converter(value));
      });
    });
  }

  /**
   * Конвертирует значение поля ввода на основе выбранной единицы и типа измерения.
   * @param input - HTMLInputElement для конвертации.
   */
  private converter(input: HTMLInputElement): void {
    const value = parseFloat(input.value);
    const [type] = Object.keys(input.dataset);
    const [name] = Object.values(input.dataset);
    switch (type) {
      case 'weight':
        const pounds = document.querySelector('[data-weight="pounds"]') as HTMLInputElement;
        const ounces = document.querySelector('[data-weight="ounces"]') as HTMLInputElement;
        const stones = document.querySelector('[data-weight="stones"]') as HTMLInputElement;
        const kilograms = document.querySelector('[data-weight="kilograms"]') as HTMLInputElement;
        const grams = document.querySelector('[data-weight="grams"]') as HTMLInputElement;
        switch (name) {
          case 'pounds':
            kilograms.value = (value / 2.2046).toFixed(2);
            ounces.value = (value * 16).toFixed(2);
            grams.value = (value / 0.0022046).toFixed();
            stones.value = (value * 0.071429).toFixed(3);
            break;
          case 'ounces':
            pounds.value = (value * 0.062500).toFixed(4);
            kilograms.value = (value / 35.274).toFixed(4);
            grams.value = (value / 0.035274).toFixed(1);
            stones.value = (value * 0.0044643).toFixed(4);
            break;
          case 'stones':
            pounds.value = (value * 14).toFixed(1);
            kilograms.value = (value / 0.15747).toFixed(1);
            ounces.value = (value * 224).toFixed();
            grams.value = (value / 0.00015747).toFixed();
            break;
          case 'kilograms':
            pounds.value = (value * 2.2046).toFixed(2);
            ounces.value = (value * 35.274).toFixed(2);
            grams.value = (value * 1000).toFixed();
            stones.value = (value * 0.1574).toFixed(3);
            break;
          case 'grams':
            pounds.value = (value * 0.0022046).toFixed(4);
            kilograms.value = (value / 1000).toFixed(4);
            ounces.value = (value * 0.035274).toFixed(3);
            stones.value = (value * 0.00015747).toFixed(5);
            break;
          default:
            break;
        }
        break;
      case 'temperature':
        const fahrenheit = document.querySelector('[data-temperature="fahrenheit"]') as HTMLInputElement;
        const celsius = document.querySelector('[data-temperature="celsius"]') as HTMLInputElement;
        const kelvin = document.querySelector('[data-temperature="kelvin"]') as HTMLInputElement;
        switch (name) {
          case 'fahrenheit':
            celsius.value = ((value - 32) / 1.8).toFixed(2);
            kelvin.value = (((value - 32) / 1.8) + 273.15).toFixed(2);
            break;
          case 'celsius':
            fahrenheit.value = ((value * 1.8) + 32).toFixed(2);
            kelvin.value = ((value) + 273.15).toFixed(2);
            break;
          case 'kelvin':
            fahrenheit.value = (((value - 273.15) * 1.8) + 32).toFixed(2);
            celsius.value = ((value) - 273.15).toFixed(2);
            break;
          default:
            break;
        }
        break;
      case 'speed':
        const mph = document.querySelector('[data-speed="mph"]') as HTMLInputElement;
        const kph = document.querySelector('[data-speed="kph"]') as HTMLInputElement;
        const knots = document.querySelector('[data-speed="knots"]') as HTMLInputElement;
        const mach = document.querySelector('[data-speed="mach"]') as HTMLInputElement;
        switch (name) {
          case 'mph':
            kph.value = (value * 1.609344).toFixed(2);
            knots.value = (value / 1.150779).toFixed(2);
            mach.value = (value / 761.207).toFixed(4);
            break;
          case 'kph':
            mph.value = (value / 1.609344).toFixed(2);
            knots.value = (value / 1.852).toFixed(2);
            mach.value = (value / 1225.044).toFixed(5);
            break;
          case 'knots':
            mph.value = (value * 1.150779).toFixed(2);
            kph.value = (value * 1.852).toFixed(2);
            mach.value = (value / 661.4708).toFixed(4);
            break;
          case 'mach':
            mph.value = (value * 761.207).toFixed();
            kph.value = (value * 1225.044).toFixed();
            knots.value = (value * 661.4708).toFixed();
            break;
          default:
            break;
        }
        break;
      case 'length':
        const feet = document.querySelector('[data-length="feet"]') as HTMLInputElement;
        const inches = document.querySelector('[data-length="inches"]') as HTMLInputElement;
        const yards = document.querySelector('[data-length="yards"]') as HTMLInputElement;
        const miles = document.querySelector('[data-length="miles"]') as HTMLInputElement;
        const meters = document.querySelector('[data-length="meters"]') as HTMLInputElement;
        const cm = document.querySelector('[data-length="cm"]') as HTMLInputElement;
        const kilometers = document.querySelector('[data-length="kilometers"]') as HTMLInputElement;
        switch (name) {
          case 'feet':
            meters.value = (value / 3.2808).toFixed(2);
            inches.value = (value * 12).toFixed(2);
            cm.value = (value / 0.032808).toFixed();
            yards.value = (value * 0.33333).toFixed(2);
            kilometers.value = (value / 3280.8).toFixed(5);
            miles.value = (value * 0.00018939).toFixed(5);
            break;
          case 'inches':
            feet.value = (value * 0.083333).toFixed(3);
            meters.value = (value / 39.370).toFixed(3);
            cm.value = (value / 0.39370).toFixed(2);
            yards.value = (value * 0.027778).toFixed(3);
            kilometers.value = (value / 39370).toFixed(6);
            miles.value = (value * 0.000015783).toFixed(6);
            break;
          case 'yards':
            feet.value = (value * 3).toFixed();
            meters.value = (value / 1.0936).toFixed(2);
            inches.value = (value * 36).toFixed();
            cm.value = (value / 0.010936).toFixed();
            kilometers.value = (value / 1093.6).toFixed(5);
            miles.value = (value * 0.00056818).toFixed(5);
            break;
          case 'miles':
            feet.value = (value * 5280).toFixed();
            meters.value = (value / 0.00062137).toFixed();
            inches.value = (value * 63360).toFixed();
            cm.value = (value / 0.0000062137).toFixed();
            yards.value = (value * 1760).toFixed();
            kilometers.value = (value / 0.62137).toFixed(2);
            break;
          case 'meters':
            feet.value = (value * 3.2808).toFixed(2);
            inches.value = (value * 39.370).toFixed(2);
            cm.value = (value / 0.01).toFixed();
            yards.value = (value * 1.0936).toFixed(2);
            kilometers.value = (value / 1000).toFixed(5);
            miles.value = (value * 0.00062137).toFixed(5);
            break;
          case 'cm':
            feet.value = (value * 0.032808).toFixed(3);
            meters.value = (value / 100).toFixed(3);
            inches.value = (value * 0.39370).toFixed(2);
            yards.value = (value * 0.010936).toFixed(3);
            kilometers.value = (value / 100000).toFixed(6);
            miles.value = (value * 0.0000062137).toFixed(6);
            break;
          case 'kilometers':
            feet.value = (value * 3280.8).toFixed();
            meters.value = (value * 1000).toFixed();
            inches.value = (value * 39370).toFixed();
            cm.value = (value * 100000).toFixed();
            yards.value = (value * 1093.6).toFixed();
            miles.value = (value * 0.62137).toFixed(2);
            break;
          default:
            break;
        }
        break;
    }
  }
}

// Создаем экземпляр класса TypeConverter для инициализации приложения.
new TypeConverter();
