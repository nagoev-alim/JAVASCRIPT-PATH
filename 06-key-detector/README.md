## 📦 Key Detector Component

### Обзор

Класс `KeyDetector` представляет собой компонент, отвечающий за обработку нажатий клавиш клавиатуры и отображение информации о нажатой клавише на веб-странице.

### Свойства:

- `keyElements: NodeListOf<HTMLSpanElement> | null`: Список элементов для отображения названия клавиш.

- `keyCodeElements: NodeListOf<HTMLSpanElement> | null`: Список элементов для отображения кодов клавиш.

- `preview: HTMLParagraphElement | null`: Элемент для предварительного отображения текста.

- `container: HTMLDivElement | null`: Контейнер для скрытия/отображения элементов.

### Методы:

- `constructor()`: Конструктор класса. Вызывает метод `initialize()`.

- `initialize()`: Инициализация компонента. Вызывает методы `createDOM()` и `setupEventListeners()`.

- `createDOM()`: Создает структуру DOM для отображения информации о нажатой клавише.

- `setupEventListeners()`: Устанавливает обработчики событий, основанные на событии "keydown".

### Методы для работы с DOM:

- `createDOM()`: Создает структуру DOM, добавляя необходимые элементы на веб-страницу.

### Методы для управления событиями:

- `setupEventListeners()`: Устанавливает обработчик события "keydown" для отслеживания нажатий клавиш.

### Примечания:
- Класс создает структуру DOM в элементе с id "app" и инициализирует обработчик событий для отслеживания нажатий клавиш. При нажатии клавиши, информация о ней отображается на странице.
- Элементы с атрибутами `data-value="key"` предназначены для отображения названия клавиши, а элементы с `data-value="keyCode"` - для отображения её кода.
- Стилизация элементов производится через классы CSS, заданные в файле `style.css`, который подключен к скрипту.





---
#### 🌄 Preview:
![App Preview](https://lh3.googleusercontent.com/drive-viewer/AITFw-we--QLVGaSVGUkGD2FBzZZP9EoWadtLsv9jVepehWavEJXyIZoqYr7EtjmSQmqUJ5nmC7_XGJ_EkalgDaUDZ10Qwy5lQ=s1600)


-----
#### 🙌 Author: [@nagoev-alim](https://github.com/nagoev-alim)

