## 📦 Guess Number Component

### Обзор
Код представляет собой JavaScript-приложение для игры `"Угадай число"`.

### Зависимости

- `style.css`: Стилизация интерфейса игры.
- `getRandomNumber`: Модуль для генерации случайных чисел.
- `Toastify`: Библиотека для отображения уведомлений.
- `canvas-confetti`: Библиотека для создания эффекта конфетти.

### Класс `GuessNumber`

- Создает экземпляр игры и инициализирует ее.
- Инициализирует игру, создавая DOM-элементы и устанавливая обработчики событий.

### Метод `createDOM`

- Создает DOM-элементы для интерфейса игры, такие как заголовок, форма ввода и список сообщений.

### Метод `setupEventListeners`

- Устанавливает обработчики событий, включая обработку отправки формы и установку фокуса на поле ввода.

### Метод `showMessage`

- Отображает сообщения в интерфейсе игры, добавляя их в список сообщений.

### Метод `handleInvalidInput`

- Обрабатывает недопустимый ввод, например, когда поле ввода пустое. Отображает уведомление об ошибке.

### Метод `handleSubmit`

- Обрабатывает отправку формы с предполагаемым числом игрока. Проверяет введенное значение, предоставляет обратную связь игроку и регистрирует результаты игры.

### Начало игры

- Создается экземпляр класса `GuessNumber`, начиная игру.

Этот код позволяет игроку угадывать число в заданном диапазоне и предоставляет обратную связь о правильности или неправильности попыток.


---
#### 🌄 Preview:
![App Preview](https://lh3.googleusercontent.com/drive-viewer/AITFw-wnO2AZsqOJunHyEdcRjMLR-V_LE7OdIeollUaIp57--NjcwxysJFCUyhm2eYg1LJYqKNx0o2D-Jv8bMG4jHVZ386Qu=s1600)


-----
#### 🙌 Author: [@nagoev-alim](https://github.com/nagoev-alim)
