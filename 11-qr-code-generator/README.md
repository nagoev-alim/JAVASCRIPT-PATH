## 📦 Приложение - Генератор QR-кода

### 🚀 Обзор

Этот код представляет собой веб-приложение на JavaScript, создающее интерфейс для генерации QR-кодов (быстрых откликов):
 
- **Подключение стилей и библиотеки:**

Код начинается с подключения стилей из файла style.css и библиотеки Toastify, которая используется для отображения уведомлений.

-  **Класс QRCodeGenerator:**

Класс QRCodeGenerator создает и управляет функциональностью приложения.

- **Инициализация:**

В конструкторе класса QRCodeGenerator вызывается метод `initialize()`, который инициализирует приложение.

- **Метод createDOM():**

Метод `createDOM()` создает элементы DOM для интерфейса генератора QR-кодов. Это включает в себя форму для ввода текста или URL, выбор размера QR-кода и кнопку для его генерации.

- **Метод setupEventListeners():**

Метод `setupEventListeners()` устанавливает обработчики событий для формы и кнопки "Save".

- **Метод handleSubmit(event):**

Метод `handleSubmit(event)` обрабатывает событие отправки формы. Он проверяет введенный текст или URL. Если текст существует, генерируется QR-код с указанным размером и отображается на странице. Если текст отсутствует, показывается уведомление об ошибке.

- **Метод handleSave():**

Метод `handleSave()` обрабатывает событие нажатия кнопки "Save". Он загружает изображение QR-кода, создает его `Blob`, создает временную ссылку на `Blob` и предоставляет возможность пользователю скачать QR-код.

- **Запуск приложения:**

В самом конце кода создается экземпляр класса QRCodeGenerator, который запускает инициализацию приложения.

Таким образом, этот код создает веб-приложение, которое позволяет пользователю ввести текст или URL, выбрать размер QR-кода, сгенерировать QR-код и сохранить его на устройстве.

---
#### 🌄 Превью:
![Превью](https://lh3.googleusercontent.com/drive-viewer/AITFw-wA4hbtOX-L8iNvXJt156eWgjaxPr22ehslY39InubwLP0SOuI8SLYrEMOi43G1BhgWAMUBGwgAwI0kg5y-MaHzdneplA=s1600)


-----
#### 🙌 Автор: [@nagoev-alim](https://github.com/nagoev-alim)

