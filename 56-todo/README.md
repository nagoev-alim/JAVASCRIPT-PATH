## 📦 Приложение - Список задач

### 🚀 Обзор

Этот код представляет собой frontend-приложение для управления задачами (Todo) и пользователями. Ниже представлено краткое описание его функциональности:

1. **Импорт библиотек и стилей**: Код начинается с импорта необходимых библиотек и стилей, таких как стили из файла `style.scss`, библиотека `feather-icons`, `axios` для выполнения HTTP-запросов и функция `toast` из файла `toast.ts`.

2. **Интерфейсы ITodo и IUser**: Определены интерфейсы `ITodo` и `IUser`, которые описывают структуру данных для задач и пользователей.

3. **Класс Todo**: Это основной класс, который управляет приложением для создания, редактирования и удаления задач.

4. **Инициализация класса**: В конструкторе класса `Todo` инициализируется приложение.

5. **Создание DOM**: В методе `createDOM` создается структура DOM для приложения, включая форму для создания задач, список задач и выпадающий список пользователей.

6. **Обработчики событий**: В методе `setupEventListeners` устанавливаются обработчики событий для формы, списка задач и кнопок удаления.

7. **Загрузка данных**: В методе `fetchData` асинхронно загружаются данные о задачах и пользователях с сервера с использованием `axios`.

8. **Отображение данных**: Метод `renderData` отображает данные на странице в зависимости от типа данных (задачи, пользователи или новая задача).

9. **Дополнительные методы**:
    - `getUserName`: Получает имя пользователя по его идентификатору.
    - `handleSubmit`: Обрабатывает отправку формы для создания новой задачи.
    - `createTodo`: Асинхронно создает новую задачу на сервере.
    - `handleChange`: Обрабатывает изменение состояния задачи (отмечена/не отмечена выполненной).
    - `handleDelete`: Обрабатывает удаление задачи.

10. **Создание экземпляра класса Todo**: В конце кода создается экземпляр класса `Todo`, что запускает приложение.

Это приложение предоставляет пользователю интерфейс для управления задачами, включая создание, отметку выполненных задач, удаление и выбор пользователей, связанных с задачами.

---

#### 🌄 Превью:

![Превью](https://lh3.googleusercontent.com/drive-viewer/AITFw-yennj6iG7fOYRL0xcbsUORLZ3w4XU4y-hSGegBS9tpSesT9JEbxsjjM1eZ2WORp1cp3jQDHHm92-Pd-bxJxMOlN22w=s1600)


-----

#### 🙌 Автор: [@nagoev-alim](https://github.com/nagoev-alim)

