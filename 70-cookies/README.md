## 📦 Приложение - Cookies

### 🚀 Обзор
Данный код представляет собой JavaScript-компонент для управления согласием на использование файлов cookie на веб-сайте. Вот краткое описание его функциональности:

1. Импортируются стили и необходимые библиотеки.

2. Создается класс `Cookies`, который представляет компонент для управления согласием на использование файлов cookie.

3. В конструкторе класса инициализируется компонент вызовом метода `initialize()`.

4. Метод `initialize()` создает DOM-структуру для компонента и устанавливает обработчики событий.

5. Создается DOM-элемент, представляющий блок согласия на файлы cookie. Этот блок содержит заголовок, описание, ссылку для дополнительной информации и две кнопки "Accept" и "Decline".

6. В методе `setupEventListeners()` устанавливаются обработчики событий. Основное действие происходит при загрузке страницы, когда вызывается метод `initCookies()`.

7. Метод `initCookies()` проверяет наличие файла cookie с именем 'customCookies'. Если такой файл cookie существует, то блок согласия скрывается. В противном случае блок становится видимым, и устанавливаются обработчики событий для кнопок "Accept" и "Decline".

8. Метод `handleClick()` обрабатывает событие нажатия на кнопку "Accept" или "Decline". Если была нажата кнопка "Accept", то создается файл cookie с именем 'cookieBy' и устанавливается его срок действия на 30 дней.

9. Создается экземпляр класса `Cookies`, что инициирует работу компонента на странице.

Этот компонент обеспечивает управление согласием по использованию файлов cookie на веб-сайте и позволяет пользователям принимать или отклонять согласие на использование файлов cookie.

---

#### 🌄 Превью:

![Превью](https://lh3.googleusercontent.com/drive-viewer/AITFw-wusIXgb1XUuBK02zx3ZAg-PI_nHuz1lje5XFLsoIp91popd1py3VA514lwrBO_zatf4qxEzdDoxSHf3WGKMJslKdnq3A=s1600)


-----

#### 🙌 Автор: [@nagoev-alim](https://github.com/nagoev-alim)

