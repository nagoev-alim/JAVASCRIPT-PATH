## 📦 Приложение - Викторина

### 🚀 Обзор
Этот код представляет собой реализацию веб-приложения для викторины с использованием HTML, CSS и JavaScript.

1. Подключает необходимые стили и библиотеки:
- Импортирует стили из файла `style.scss`.
- Импортирует библиотеку `axios` для выполнения HTTP-запросов.
- Импортирует функцию toast из файла `./utils/toast.ts`.
- Импортирует функцию getRandomNumber из файла `./utils/getRandomNumber.ts`.
- Импортирует библиотеку `canvas-confetti` для создания эффекта конфетти.
2. Определяет интерфейс `IQuestion` для представления данных вопросов.

3. Создает класс `Quiz`, который реализует логику веб-приложения для викторины.

- В конструкторе инициализирует приложение, вызывая метод `initialize`.
- В методе `initialize` создает DOM-элементы для интерфейса викторины и устанавливает обработчики событий.
- Создает DOM-структуру, включая заголовок, вопросы, варианты ответов и кнопку отправки, и скрывает интерфейс викторины.
- Использует библиотеку axios для выполнения запроса к внешнему API и получения списка вопросов.
- Рендерит первый вопрос и варианты ответов.
- Устанавливает обработчик события для кнопки отправки ответа.
- Устанавливает обработчик события для кнопки перезагрузки при завершении викторины.
4. Метод `fetchQuiz` выполняет HTTP-запрос к внешнему API для получения списка вопросов и сохраняет их в переменной quizData.

5. Метод `renderQuiz` отображает текущий вопрос и варианты ответов на экране, используя данные из переменной quizData.

6. Метод `handleSubmit` обрабатывает выбор пользователя и подсчитывает количество правильных ответов. Если пользователь ответил на все вопросы, он отображает эффект конфетти и результат викторины.

7. Метод `shuffle` перемешивает варианты ответов, чтобы они отображались в случайном порядке на каждом вопросе.

8. Создает экземпляр класса `Quiz`, который инициализирует работу приложения.

Этот код создает интерактивную викторину, в которой пользователи могут отвечать на вопросы и получать результаты в конце викторины.

---

#### 🌄 Превью:

![Превью](https://lh3.googleusercontent.com/drive-viewer/AITFw-xtEQzEo2bszoNkSvrulasx5HYy4ptZ_gLHnAGn4h5DWG1LTonEsf8XVlhOllosGtMqcLEI4aGSAYaFGTeGF3Ja6rbMGw=s1600)


-----

#### 🙌 Автор: [@nagoev-alim](https://github.com/nagoev-alim)

