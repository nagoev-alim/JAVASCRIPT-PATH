## 📦 Twitty Component

### Обзор

Код представляет собой веб-приложение с названием "Twitty," которое позволяет управлять постами. Приложение загружает данные о постах с удаленного сервера, отображает их в пользовательском интерфейсе и предоставляет функциональность для создания, редактирования и удаления постов.

### Класс `Twitty`

#### Инициализация

```javascript
new Twitty();
```

- Создает экземпляр класса Twitty, запуская приложение.

#### Методы

- `initialize()`: Инициализация приложения, создание DOM-элементов и установка обработчиков событий.
- `createDOM()`: Создание необходимых DOM-элементов для приложения и вставка их в DOM.
- `setupEventListeners()`: Установка обработчиков событий для формы и списка постов.
- `fetchData()`: Загрузка данных с сервера и отображение их в приложении.
- `renderHTML(data: IPost[])`: Отображение данных в интерфейсе приложения.
- `handleSubmit(event: Event)`: Обработка отправки формы для создания или обновления поста.
- `handleClick(event: MouseEvent)`: Обработка кликов на кнопках "Удалить" и "Редактировать" пост.

### Интерфейс `IPost`

- `id: string`: Идентификатор поста.
- `title: string`: Заголовок поста.
- `body: string`: Текст поста.

### Подключаемые библиотеки

- `'./style.scss'`: Подключение стилей приложения.
- `'feather-icons'`: Подключение иконок Feather Icons для создания кнопок "Редактировать" и "Удалить".
- `'axios'`: Использование Axios для работы с HTTP-запросами.
- `'./utils/toast.ts'`: Подключение модуля toast для отображения уведомлений.

### Основной функционал

- Приложение загружает список постов с удаленного сервера и отображает их в пользовательском интерфейсе.
- Пользователи могут создавать новые посты, редактировать существующие и удалять посты.
- Для создания и редактирования постов используется форма с полями "Title" и "Body text."
- При обновлении или создании поста выполняются HTTP-запросы к серверу с использованием библиотеки Axios.
- При возникновении ошибок при выполнении запросов, приложение выводит уведомления с информацией об ошибке.
- Приложение предоставляет интерфейс для редактирования постов и подтверждение удаления постов.

### Примечание

Данный код описывает базовую функциональность веб-приложения для управления постами. Важно отметить, что код использует сторонние библиотеки, такие как Axios и Feather Icons, а также стили из файла 'style.scss' для создания пользовательского интерфейса.

---

#### 🌄 Preview:

![App Preview](https://lh3.googleusercontent.com/drive-viewer/AITFw-xR0sw9ownhDJYySVjFiCd_er7BGQezGno0JontkjytV_zJ2uKP5Bv9zGHl3WabeNQq0YSbLv7j0g-gV8ZkAgrHrYBT=s1600)


-----

#### 🙌 Author: [@nagoev-alim](https://github.com/nagoev-alim)
