## 📦 Приложение - Верификация номера

### 🚀 Обзор
Код VerifyAccount представляет собой JavaScript-класс, который создает интерфейс для ввода шестизначного кода для верификации аккаунта.

- **Импорт стилей:**

    В этой части кода импортируются стили из файла `style.scss`

-   **Класс `VerifyAccount`**

    Этот класс будет управлять всей логикой страницы верификации аккаунта.

- **В классе `VerifyAccount` объявляется приватное поле inputs.**

    Это поле будет хранить список элементов `<input>`, предназначенных для ввода шестизначного кода.

- **Конструктор класса `VerifyAccount` инициализирует объект.**

    При создании экземпляра класса автоматически вызывается метод `initialize()` для настройки страницы.

- **Метод `initialize()` создает и настраивает интерфейс верификации.**

  В этом методе происходит создание DOM-структуры страницы и настройка обработчиков событий.

- **Метод `createDOM()` создает DOM-элементы для страницы.**

  В этом методе создается HTML-структура страницы, включая заголовок, описание и шесть полей для ввода шестизначного кода. Элементы полей ввода сохраняются в `this.inputs`.

- **Метод `setupEventListeners()` устанавливает обработчики событий.**

  В этом методе устанавливается фокус на первом поле ввода, и для каждого поля ввода устанавливается обработчик события keydown, который реагирует на нажатия клавиш.

- **Метод `handleKeydown()` обрабатывает нажатия клавиш.**

  В этом методе обрабатываются нажатия клавиш на клавиатуре. Если нажата цифровая клавиша от 0 до 9, то значение поля ввода сбрасывается, и фокус перемещается на следующее поле (если оно есть). Если нажата клавиша `"Backspace"`, то фокус перемещается на предыдущее поле (если оно есть).

- **Создается экземпляр класса `VerifyAccount`, что инициирует выполнение кода.**

  Эта строка создает объект класса `VerifyAccount`, что запускает процесс верификации аккаунта.

Общая цель этого кода - создать интерфейс верификации аккаунта с шестизначным кодом, обрабатывать ввод пользователя и управлять фокусом на полях ввода для удобной верификации аккаунта.

---

#### 🌄 Превью:

![Превью](https://lh3.googleusercontent.com/drive-viewer/AITFw-yh5EbL_CUCk5QgTidrauZShS2YxcpFxSvqAXpwiJnEkRAMuyvaoT3Q8IEi75oQGhH1Ha_SMBUavP3gqplUAmhC7Qts5w=s1600)


-----

#### 🙌 Автор: [@nagoev-alim](https://github.com/nagoev-alim)

