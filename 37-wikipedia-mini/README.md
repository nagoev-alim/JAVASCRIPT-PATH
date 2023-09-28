## 📦 Приложение - Википедиа

### 🚀 Обзор
Этот код представляет собой веб-приложение для поиска информации в Wikipedia и отображения результатов на веб-странице.

### Импорты

```javascript
import './style.scss';  // Импорт стилей
import logo from '../public/logo.svg';  // Импорт логотипа
import { toast } from './utils/toast.ts';  // Импорт функции для вывода уведомлений
import axios from 'axios';  // Импорт библиотеки axios для HTTP-запросов
```

### Интерфейс IData

```javascript
interface IData {
  title: string,
  snippet: string,
  pageid: string
}
```

Интерфейс `IData` определяет структуру данных для объектов с информацией о результатах поиска в Wikipedia. Он включает поля `title` (заголовок), `snippet` (краткое описание) и `pageid` (уникальный идентификатор страницы).

### Класс WikiSearch

```javascript
class WikiSearch {
  private form: HTMLFormElement;
  private result: HTMLUListElement;
  private readonly URL: string = 'https://en.wikipedia.org/w/api.php?action=query&list=search&srlimit=20&format=json&origin=*&srsearch=';

  constructor() {
    this.initialize();
  }
```

Класс `WikiSearch` создает приложение для поиска и отображения результатов Wikipedia. Он имеет следующие поля:

- `form`: HTML-форма для ввода запроса.
- `result`: HTML-список для отображения результатов.
- `URL`: URL-адрес API Wikipedia для выполнения запросов.

### Методы класса WikiSearch

- `initialize()`: Инициализирует приложение, создавая структуру DOM и настраивая обработчики событий.

- `createDOM()`: Создает структуру DOM, включая форму поиска и контейнер для результатов.

- `setupEventListeners()`: Устанавливает обработчики событий, например, для отправки формы поиска.

- `handleSubmit(event)`: Обрабатывает отправку формы поиска, выполняет запрос к API Wikipedia и отображает результаты на странице.

- `renderData(data)`: Отображает результаты поиска на странице, вставляя их в список.

### Создание экземпляра класса

```javascript
new WikiSearch();
```

Этот код создает экземпляр класса `WikiSearch`, инициализируя приложение для выполнения поиска и отображения результатов на странице.

---

#### 🌄 Превью:

![Превью](https://lh3.googleusercontent.com/drive-viewer/AITFw-yJZypJJ_yizerdZvwNPxVkMHDW7vCjXaSNPjIsm-PBAAgcBSz0aMnt9zBUdtFXycnbdknzZ5QxoxZ98AT3emz61gY7hg=s1600)


-----

#### 🙌 Автор: [@nagoev-alim](https://github.com/nagoev-alim)

