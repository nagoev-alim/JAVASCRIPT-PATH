## 📦 Countdown Component

### Обзор
Данный код представляет собой JavaScript-класс `Countdown`, который создает интерактивный счетчик обратного отсчета на веб-странице. Этот счетчик позволяет пользователю указать событие и дату, когда оно произойдет, а затем отображает оставшееся время до этого события.

### Класс Countdown

### Переменные класса

- `config`, `display`, `finish`, `finishText`, `finishBtn`, `form`, `formDate`, `d`, `h`, `m`, `s`, `title`, `btnReset` - переменные для хранения ссылок на элементы DOM, используемые в счетчике.

- `today` - строка, представляющая текущую дату.

- `countdownValue` - число или объект Date, представляющий дату события.

- `interval` - числовое значение или `null`, используется для обновления счетчика с интервалом.

- `countdownName` - строка или `null`, представляет название события.

- `countdownDate` - строка или `null`, представляет дату события.

### Методы класса

- `initialize()` - инициализация класса, создание DOM-элементов и установка обработчиков событий.

- `createDOM()` - создание необходимых элементов DOM для счетчика.

- `setupEventListeners()` - установка обработчиков событий для кнопок и формы счетчика.

- `storageDisplay()` - отображение сохраненного значения счетчика, если оно было сохранено ранее.

- `handleSubmit(event)` - обработка отправки формы для установки нового значения счетчика.

- `handleReset()` - сброс счетчика и восстановление исходных значений.

- `storageGet()` - получение сохраненных данных счетчика из локального хранилища.

- `updateCountdown()` - обновление значения счетчика и отображение обратного отсчета.

- `storageAdd(data)` - сохранение данных счетчика в локальном хранилище.

### Запуск

Последняя строка создает экземпляр класса `Countdown`, запуская счетчик обратного отсчета на веб-странице.

---

#### 🌄 Preview:

![App Preview](https://lh3.googleusercontent.com/drive-viewer/AITFw-w0uYmIpwpRgLQPLHfddh8J7hniDPsWdf2MxbMvi_LBIx65Sj5AH6gq1qexQbmKCJ5NFUidQGWE50B9MMWEbWpO-x9Q=s1600)


-----

#### 🙌 Author: [@nagoev-alim](https://github.com/nagoev-alim)
