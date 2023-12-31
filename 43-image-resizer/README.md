## 📦 Приложение - Редактирование размеров изображений

### 🚀 Обзор
Этот код представляет собой класс `ImageResizer`, который предназначен для создания интерфейса приложения по изменению размеров изображений. Вот описание, что делает этот код:

1. Импортируются необходимые зависимости, включая стили из файла `style.scss`, библиотеку `feather-icons` для работы с иконками, и модуль `toast` из файла `toast.ts` для отображения уведомлений.

2. Создается класс `ImageResizer`, который содержит приватные свойства для доступа к различным элементам интерфейса:

  - `upload`: DIV-контейнер для загрузки изображения.
  - `uploadImg`: изображение, отображаемое после загрузки файла.
  - `inputUpload`: элемент `<input type='file'>` для загрузки изображения.
  - `inputWidth` и `inputHeight`: поля для ввода ширины и высоты изображения.
  - `inputRatio` и `inputQuality`: чекбоксы для выбора опций изменения размера.
  - `btnDownload`: кнопка для скачивания обработанного изображения.
  - `imageRatio`: переменная для хранения соотношения сторон загруженного изображения.

3. Конструктор класса `ImageResizer` вызывает метод `initialize`, который выполняет начальную настройку приложения.

4. Метод `createDOM` создает элементы интерфейса приложения и добавляет их в DOM-дерево.

5. Метод `setupEventListeners` настраивает обработчики событий для элементов интерфейса, таких как клик на контейнере загрузки файла, изменение файла для загрузки, клик на кнопке скачивания, а также события `keyup` для полей ввода ширины и высоты.

6. Метод `handleLoadFile` обрабатывает событие загрузки файла изображения. После загрузки файла, он отображает изображение, устанавливает значения ширины и высоты, рассчитывает соотношение сторон и вносит изменения в интерфейс.

7. Метод `handleDownload` обрабатывает событие скачивания обработанного изображения. Он создает временный холст, на котором рисует изображение с заданными размерами, затем генерирует ссылку для скачивания и выполняет скачивание.

8. Метод `handleKeyUp` обрабатывает событие нажатия клавиши при вводе ширины или высоты изображения. В зависимости от выбранных опций, он автоматически корректирует другое значение, чтобы сохранить соотношение сторон.

9. В конце кода создается экземпляр класса `ImageResizer`, что запускает приложение после загрузки страницы.

Этот код представляет собой простой инструмент для изменения размеров изображений с помощью веб-интерфейса.

---

#### 🌄 Превью:

![Превью](https://lh3.googleusercontent.com/drive-viewer/AITFw-xjOE6NeyCLqzkbB1EFe9JJzYy7sMDv8BPGu2ZdBvrh2_fRvTYmEXUXKcBnoWy3duX0MBpfCAyBluW_A--yxBhA0xLHrw=s1600)


-----

#### 🙌 Автор: [@nagoev-alim](https://github.com/nagoev-alim)

