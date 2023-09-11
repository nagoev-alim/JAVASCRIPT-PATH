## 📦 Modal Window Component

### Обзор

Данный JavaScript-код представляет класс `ModalWindow`, который создает модальное окно с функциональностью открытия и закрытия. Класс управляет DOM-элементами модального окна и реагирует на события клика и нажатия клавиш.

### Импорты

- `style.css`: Импортируются стили для оформления модального окна.
- `feather-icons`: Импортируется библиотека `feather-icons`, используемая для создания иконки "закрыть" (иконка крестика).

### Свойства

- `overlay` (HTMLDivElement | null): Ссылка на элемент оверлея модального окна.
- `btnClose` (NodeListOf<HTMLButtonElement> | null): Ссылка на кнопки закрытия модального окна.
- `btnOpen` (HTMLButtonElement | null): Ссылка на кнопку открытия модального окна.

### Конструктор

- Создает новый экземпляр `ModalWindow`.
- Инициализирует модальное окно, вызывая метод `initialize()`.

### Методы

#### `initialize()`

- Инициализирует модальное окно.
- Вызывает методы `createDOM()` и `setupEventListeners()`.

#### `createDOM()`

- Создает структуру DOM-элементов для модального окна.
- Вставляет созданные элементы в элемент с идентификатором `#app`.
- Устанавливает значения для свойств `overlay`, `btnClose` и `btnOpen`, чтобы иметь доступ к соответствующим элементам.

#### `setupEventListeners()`

- Устанавливает обработчики событий для кнопок и оверлея модального окна.
- Также устанавливает обработчик события `keydown` документа.

#### `handleClick(event: MouseEvent)`

- Обрабатывает события клика на модальном окне.
- Если клик произошел на кнопке "Open Modal", то открывает модальное окно, убирая класс `hidden` с оверлея.
- Если клик произошел на кнопке "Close Modal" или оверлее, то закрывает модальное окно, добавляя класс `hidden`.

#### `handleKeydown(event: KeyboardEvent)`

- Обрабатывает события нажатия клавиш, особенно клавиши "Escape".
- Если нажата клавиша "Escape", то закрывает модальное окно, добавляя класс `hidden`.

### Использование

- Создается новый экземпляр класса `ModalWindow`, что инициирует создание и управление модальным окном.



---
#### 🌄 Preview:
![App Preview](https://lh3.googleusercontent.com/drive-viewer/AITFw-znIgx0oAVVSz4zZ2NDgHZOD5soQGuEwJDxzjwG0dd8Oc8C9CtZ3gwu6Ymvwx-9Z2d0e6jdgvEOGMS4SDmTRGpkzKpr=s1600)

![App Preview](https://lh3.googleusercontent.com/drive-viewer/AITFw-ygH6Sz5nQbADy6wk9WaVyHCN6lWf6YGAgTh47x2mTM8Du1W4fBnrlgxwdwRE-kNKK73zdQcjqY_J3-yOZJhaXjp882LA=s1600)


-----
#### 🙌 Author: [@nagoev-alim](https://github.com/nagoev-alim)

