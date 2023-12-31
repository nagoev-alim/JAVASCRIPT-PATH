## 📦 Приложение - Выпадающее меню

### 🚀 Обзор
Данный код создает выпадающее меню (dropdown) с использованием HTML, CSS и JavaScript. Вот краткое описание его функциональности:

1. Импортируются стили из файла `style.scss` и библиотека `feather-icons` для иконок.

2. Определяется интерфейс `IData`, который описывает структуру данных для пунктов выпадающего меню. Каждый пункт содержит иконку `ico` и текстовую метку `label`.

3. Создается массив `data`, содержащий данные для пунктов выпадающего меню.

4. Определяется класс `Dropdown`, который отвечает за создание и управление выпадающим меню.

5. В конструкторе класса `Dropdown` вызывается метод `initialize`, который выполняет инициализацию компонента.

6. Метод `createDOM` создает структуру DOM-элементов для выпадающего меню, включая кнопку-триггер и список пунктов меню, используя данные из массива `data`.

7. Метод `setupEventListeners` настраивает обработчики событий для кнопки-триггера и документа. При клике на кнопку меню открывается, а при клике вне меню оно закрывается.

8. Метод `toggleDropdown` переключает видимость выпадающего меню и анимацию иконки на кнопке-триггере.

9. Метод `documentHandler` отслеживает клики вне выпадающего меню и закрывает его, если оно открыто.

10. Наконец, создается экземпляр класса `Dropdown`, что запускает функциональность выпадающего меню при загрузке страницы.

Этот код создает простое выпадающее меню, которое можно использовать для различных целей, таких как навигация по веб-сайту или выбор опций.

---

#### 🌄 Превью:

![Превью](https://lh3.googleusercontent.com/drive-viewer/AITFw-wS1V8mtA5ajU-kEkRAsYmiQOeYaM43f7tZFWy16wVkV5yFcCP6_sSELeVHWpXyPjL5CXyWfod6kV0R3ESOeQ2W15LA=s1600)


-----

#### 🙌 Автор: [@nagoev-alim](https://github.com/nagoev-alim)

