import { icons } from 'feather-icons';
import { showNotification } from '../modules/showNotification.js';
import { uid } from '../modules/uid.js';
import logo from '../assets/images/logo.png';
import workIco from '../assets/images/work.png';
import relationshipsIco from '../assets/images/relationships.png';
import personalIco from '../assets/images/personal.png';
import healthIco from '../assets/images/health.png';
import sportIco from '../assets/images/sport.png';
import cleaningIco from '../assets/images/cleaning.png';
import { capitalStr } from '../modules/capitalStr.js';

export default class App {
  constructor(root) {
    // 🚀 Props
    this.root = root;
    this.habits = this.storageGet();
    this.habitGlobal = null;

    // 🚀 Render Skeleton
    this.root.innerHTML = `
      <div class='panel'>
        <a href='/' class='logo'>
          <img src='${logo}' alt='Habits' class='logo__ico' />
          <span>Habby</span>
        </a>

        <div class='buttons'>
          <div data-list=''></div>
          <button data-create=''>${icons.plus.toSvg()}</button>
        </div>
      </div>

      <div class='side'>
        <div class='welcome-screen'>
           <h3>Habby ${icons.activity.toSvg()}</h3>
           <p>It's free app to create and control habits.</p>
           <p>As long as you don't have habits, it's time to add them.</p>
        </div>
        <div class='side-content'>
          <div class='header'>
            <div class='header__name'>
              <h3 data-habit-name=''>Habit Name</h3>
              <button data-delete-habit=''>${icons.trash.toSvg()}</button>
            </div>
            <div class='progress'>
              <span class='progress__title'>Progress</span>
              <span class='progress__value' data-progress-value=''>0%</span>
              <div class='progress__meter'>
                <div class='progress__line' data-progress-meter=''></div>
              </div>
            </div>
          </div>
          <div class='body'>
            <ul data-days=''></ul>

            <div class='day day--create'>
              <div class='day__count'>Day 1</div>
              <div class='day__content'>
                <form data-day-form='' class='day__value'>
                  <label>
                    <input type='text' name='comment' placeholder='Comment'>
                  </label>
                  <button>Add</button>
                </form>
              </div>
             </div>
          </div>
        </div>
      </div>

      <div class='overlay' data-overlay=''>
        <div class='modal'>
          <button class='close' data-close=''>${icons.x.toSvg()}</button>
          <h2 class='title h3'>New habbit</h2>
          <form data-form=''>
            <label>
              <select name='type'>
                <option value=''>Select habit type</option>
                ${['personal', 'work', 'health', 'sport', 'cleaning', 'relationships'].map(name => `<option value='${name}'>${capitalStr(name)}</option>`).join('')}
              </select>
            </label>
            <label>
              <input type='text' name='name' placeholder='Enter habit name'>
            </label>
            <label>
              <input type='number' name='days' step='1' min='1' max='365' placeholder='Enter target days'>
            </label>
            <button type='submit'>Create</button>
          </form>
        </div>
      </div>
    `;

    // 🚀 Query Selectors
    this.DOM = {
      panel: {
        creatBtn: document.querySelector('[data-create]'),
        list: document.querySelector('[data-list]'),
      },
      side: {
        header: document.querySelector('.header__name'),
        title: document.querySelector('[data-habit-name]'),
        progress: {
          value: document.querySelector('[data-progress-value]'),
          meter: document.querySelector('[data-progress-meter]'),
        },
        days: {
          list: document.querySelector('[data-days]'),
          form: document.querySelector('[data-day-form]'),
        },
      },
      modal: {
        overlay: document.querySelector('[data-overlay]'),
        closeBtn: document.querySelector('[data-close]'),
        form: document.querySelector('.modal [data-form]'),
      },
    };

    // 🚀 Events Listeners

    // Render UI
    const hashID = document.location.hash.replace('#', '');
    const habitUrlID = this.habits.find(h => h.id === hashID);
    this.rerenderUI(habitUrlID ? habitUrlID.id : this.habits);

    // Modal Events
    this.DOM.panel.creatBtn.addEventListener('click', this.toggleModal);
    this.DOM.modal.overlay.addEventListener('click', this.toggleModal);
    document.addEventListener('keydown', this.toggleModal);
    this.DOM.modal.form.addEventListener('submit', this.onCreateHabit);
    // Days Events
    this.DOM.side.days.form.addEventListener('submit', this.onDayAdd);
    this.DOM.side.header.addEventListener('click', this.onDeleteHabit);
  }

  //===============================================
  // 🚀 Methods
  //===============================================
  /**
   * @function toggleModal - Show/Hide Modal
   * @param target
   * @param key
   */
  toggleModal = ({ target, key }) => {
    if (key === 'Escape' || target.matches('[data-close]') || target.matches('[data-overlay]')) {
      this.DOM.modal.overlay.classList.add('hidden');
      setTimeout(() => this.DOM.modal.overlay.classList.remove('hidden', 'open'), 800);
    } else if (target.matches('[data-create]')) {
      this.DOM.modal.overlay.classList.add('open');
    }
  };

  //===============================================
  /**
   * @function onCreateHabit
   * @param event
   */
  onCreateHabit = (event) => {
    event.preventDefault();
    const form = event.target;
    const { type, name, days } = Object.fromEntries(new FormData(form).entries());

    // Validate
    if (!type || name.trim().length === 0 || days.trim().length === 0) {
      showNotification('warning', 'Please fill the fields.');
      return;
    }

    // Create new habit and add to habits
    this.habits = [...this.habits, {
      id: uid(),
      icon: type,
      name,
      target: parseInt(days),
      days: [],
    }];

    // Check global habit
    this.habitGlobal = this.habitGlobal === null ? this.habits[0].id : this.habitGlobal;

    // Rerender Days
    this.rerenderUI(this.habitGlobal);

    // Save to local storage
    this.storageSet(this.habits);

    // Reset form
    form.reset();

    // Show notification
    showNotification('success', 'Habit successfully created.');

    // Hide modal
    this.DOM.modal.overlay.classList.add('hidden');
    setTimeout(() => this.DOM.modal.overlay.classList.remove('hidden', 'open'), 800);
  };

  /**
   * @function onDayAdd - Create and add day
   * @param event
   */
  onDayAdd = (event) => {
    event.preventDefault();
    const form = event.target;
    const comment = Object.fromEntries(new FormData(form).entries()).comment.trim();

    // Validate
    if (comment.trim().length === 0) {
      showNotification('warning', 'Please fill the fields.');
      return;
    }

    // Update data
    this.habits = this.habits.map(h => h.id === this.habitGlobal ? { ...h, days: [...h.days, { comment }] } : h);

    // Rerender Days
    this.rerenderUI(this.habitGlobal);

    // Save to local storage
    this.storageSet(this.habits);

    // Reset form
    form.reset();
  };

  /**
   * @function onDeleteHabit - Delete habit
   * @param target
   */
  onDeleteHabit = ({ target }) => {
    if (target.matches('[data-delete-habit]')) {
      if (confirm('Are you sure?')) {
        const habitID = target.dataset.deleteHabit;
        this.habits = this.habits.filter(h => h.id !== habitID);

        // Rerender Days
        this.rerenderUI(this.habitGlobal);

        // Save to local storage
        this.storageSet(this.habits);

        // Show notification
        showNotification('success', 'Habit successfully delete.');

        // Set location
        setTimeout(() => document.location.href = '/', 1200);
      }
    }
  };

  //===============================================
  /**
   * @function storageGet - Get data from local storage
   * @returns {any|*[]}
   */
  storageGet = () => {
    return localStorage.getItem('habits') ? JSON.parse(localStorage.getItem('habits')) : [];
  };

  /**
   * @function storageSet - Set data to local storage
   * @param data
   */
  storageSet = (data) => {
    return localStorage.setItem('habits', JSON.stringify(data));
  };

  //===============================================
  /**
   * @function rerenderUI - Rerender UI
   * @param habits
   */
  rerenderUI = (habits) => {
    // Check if data is empty array
    if (Array.isArray(habits) && habits.length === 0) {
      document.querySelector('.side-content').classList.add('hide');
      document.querySelector('.welcome-screen').classList.remove('hide');
      return;
    }

    // Else show side
    document.querySelector('.side-content').classList.remove('hide');
    document.querySelector('.welcome-screen').classList.add('hide');

    // Store data
    let habitsData;
    if (Array.isArray(habits) && habits.length !== 0) habitsData = habits[0].id;
    if (!Array.isArray(habits)) habitsData = habits;

    // Set global value
    this.habitGlobal = habitsData;

    // Find active habit
    const activeHabit = this.habits.find(h => h.id === habitsData);
    // If habit is not exist
    if (!activeHabit) return;

    // Set location
    document.location.replace(`${document.location.pathname}#${activeHabit.id}`);

    // Render elements
    this.renderMenu(activeHabit);
    this.renderHeader(activeHabit);
    this.renderDays(activeHabit);
  };

  /**
   * @function renderMenu - Render panel menu HTML
   * @param activeHabitID
   */
  renderMenu = (activeHabitID) => {
    for (const habit of this.habits) {
      // Check if element is existing
      const existed = this.DOM.panel.list.querySelector(`[data-habit-id="${habit.id}"]`);
      let icon = null;

      switch (habit.icon) {
        case 'personal':
          icon = personalIco;
          break;
        case 'work':
          icon = workIco;
          break;
        case 'health':
          icon = healthIco;
          break;
        case 'sport':
          icon = sportIco;
          break;
        case 'cleaning':
          icon = cleaningIco;
          break;
        case 'relationships':
          icon = relationshipsIco;
          break;
        default:
          break;
      }
      // Or create element
      if (!existed) {
        const element = document.createElement('button');
        element.setAttribute('data-habit-id', habit.id);
        element.className = `${activeHabitID.id === habit.id ? 'active' : ''}`;
        element.innerHTML = `<img src='${icon}' alt='${habit.icon}'/>`;
        element.addEventListener('click', () => this.rerenderUI(habit.id));
        this.DOM.panel.list.append(element);
        continue;
      }

      // Set class name
      existed.className = `${activeHabitID.id === habit.id ? 'active' : ''}`;
    }
  };

  /**
   * @function renderHeader - Render side header HTML
   * @param activeHabitID
   */
  renderHeader = (activeHabitID) => {
    const deleteBtn = this.DOM.side.title.nextElementSibling;
    const progress = activeHabitID.days.length / activeHabitID.target > 1
      ? 100
      : activeHabitID.days.length / activeHabitID.target * 100;

    // Set progress value
    this.DOM.side.progress.value.innerHTML = this.DOM.side.progress.meter.style.width = `${progress.toFixed(0)}%`;

    // Set Title
    this.DOM.side.title.textContent = activeHabitID.name;

    // Set ID to delete button
    deleteBtn.setAttribute('data-delete-habit', activeHabitID.id);
  };

  /**
   * @function renderDays - Render days HTML
   * @param activeHabitID
   */
  renderDays = (activeHabitID) => {
    // Clean days HTML
    this.DOM.side.days.list.innerHTML = '';

    // Render days
    for (const day in activeHabitID.days) {
      const element = document.createElement('li');
      element.classList.add('day');
      element.innerHTML = `
        <div class='day__count'>Day ${parseInt(day) + 1}</div>
        <div class='day__content'>
          <div class='day__value'>${activeHabitID.days[day].comment}</div>
          <button data-trash='${day}'>${icons['trash-2'].toSvg()}</button>
        </div>
      `;
      this.DOM.side.days.list.append(element);

      // Find delete button
      const deleteBtn = element.querySelector('[data-trash]');

      // Delete element
      deleteBtn.addEventListener('click', ({ target: { dataset: { trash } } }) => {
        if (confirm('Are you sure?')) {
          this.habits = this.habits.map(h => {
            if (h.id === this.habitGlobal) {
              h.days.splice(parseInt(trash), 1);
              return { ...h, days: h.days };
            }
            return h;
          });

          // Rerender Days
          this.rerenderUI(this.habitGlobal);

          // Save to local storage
          this.storageSet(this.habits);
        }
      });
    }

    // Set next day value
    document.querySelector('.day--create .day__count').innerHTML = `Day ${activeHabitID.days.length + 1}`;
  };
}
