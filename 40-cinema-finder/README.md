## 📦 Приложение - Поиск фильмов и сериалов

### 🚀 Обзор
Этот код представляет собой фронтенд-приложение, написанное на JavaScript, для поиска и отображения информации о фильмах.

#### Импорты

```javascript
import './style.scss'; // Импорт стилей
import feather from 'feather-icons'; // Импорт библиотеки для иконок
import axios, { AxiosInstance } from 'axios'; // Импорт Axios для работы с HTTP-запросами
import { toast } from './utils/toast.ts'; // Импорт утилиты для всплывающих уведомлений
```

#### Интерфейс `Film`

```javascript
interface Film {
  nameEn: string | null;
  nameRu: string;
  rating: string | null;
  posterUrl: string;
  filmId: string;
}
```

Интерфейс `Film` описывает структуру объекта фильма.

#### Класс `Cinema`

```javascript
class Cinema {
  // Приватные свойства класса

  // Конструктор класса
  constructor() {
    this.initialize();
  }

  // Методы класса
}
```

Класс `Cinema` представляет собой основную логику приложения для поиска фильмов. Он содержит следующие приватные свойства и методы:

- `form`, `resultEl`, `overlay`, `modal`, `more`: Приватные свойства для доступа к DOM-элементам.

- `url`, `keyword`, `top`, `key`: Константные свойства для хранения URL-адресов и ключа API.

- `instance`: Экземпляр Axios для отправки HTTP-запросов.

- `currentPage`, `countPage`, `result`, `currentType`: Свойства для управления текущей страницей, количеством страниц, результатами поиска и типом поискового запроса.

#### Метод `initialize`

```javascript
private initialize(): void {
  this.createDOM();
  this.setupEventListeners();
}
```

Метод `initialize` инициализирует приложение, вызывая методы `createDOM` и `setupEventListeners`.

#### Метод `createDOM`

```javascript
private createDOM(): void {
  // Создание и вставка структуры DOM-элементов приложения
}
```

Метод `createDOM` создает и вставляет структуру DOM-элементов для приложения Cinema Finder, включая заголовок, форму поиска, список результатов и модальное окно.

#### Метод `setupEventListeners`

```javascript
private setupEventListeners(): void {
  // Установка обработчиков событий, включая отправку формы, клики и клавиши
}
```

Метод `setupEventListeners` устанавливает обработчики событий для элементов приложения, такие как отправка формы, клики по элементам и нажатия клавиш.

#### Метод `handleFetch`

```javascript
private async handleFetch(url: string): Promise<void> {
  // Обработчик запроса данных о фильмах
}
```

Метод `handleFetch` отправляет запрос на сервер для получения данных о фильмах по указанному URL-адресу. Полученные данные обрабатываются и отображаются на странице.

#### Метод `renderData`

```javascript
private renderData(data: Film[]): void {
  // Отображение данных о фильмах на странице
}
```

Метод `renderData` отвечает за отображение данных о фильмах в списке на странице.

#### Метод `handleSubmit`

```javascript
private async handleSubmit(event: Event) {
  // Обработчик отправки формы поиска
}
```

Метод `handleSubmit` обрабатывает отправку формы поиска, отправляя запрос на сервер и обновляя результаты поиска на странице.

#### Метод `handleElementClick`

```javascript
private async handleElementClick(event: MouseEvent): Promise<void> {
  // Обработчик клика на элемент фильма для отображения деталей
}
```

Метод `handleElementClick` обрабатывает клики на элементы списка фильмов и отображает подробную информацию о выбранном фильме в модальном окне.

#### Метод `handleModal`

```javascript
private handleModal(event: MouseEvent) {
  // Обработчик закрытия модального окна
}
```

Метод `handleModal` отвечает за закрытие модального окна при клике на фон или кнопку закрытия.

#### Метод `handleMoreClick`

```javascript
private async handleMoreClick(): Promise<void> {
  // Обработчик клика на кнопку "More" для загрузки дополнительных фильмов
}
```

Метод `handleMoreClick` позволяет загрузить дополнительные фильмы при клике на кнопку "More", если они доступны.

#### Метод `handleKeyModal`

```javascript
private handleKeyModal(event: KeyboardEvent): void {
  // Обработчик нажатия клавиши Esc для закрытия модального окна
}
```

Метод `handleKeyModal` реагирует на нажатие клавиши Esc и закрывает модальное окно.

#### Создание экземпляра `Cinema`

```javascript
new Cinema();
```

Завершает код, создавая экземпляр класса `Cinema` и инициализируя приложение.

Этот код описывает структуру и логику приложения Cinema Finder, предназначенного для поиска и отображения информации о фильмах.

---

#### 🌄 Превью:

![Превью](https://lh3.googleusercontent.com/drive-viewer/AITFw-xLbLC-x141oR8L1B3qIpcOQGzkcS9rjWAo250DG9cgbSeCgujVvteDwzM5WHZIbBEPXmLHC8ke6yAcmQyTBSUVJwIdcw=s1600)


-----

#### 🙌 Автор: [@nagoev-alim](https://github.com/nagoev-alim)

