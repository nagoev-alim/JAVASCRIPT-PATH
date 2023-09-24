import './style.scss';
import axios from 'axios';
import logo from './assets/images/logo.png';
import { showNotification } from './modules/showNotification.js';
import { CATEGORIES } from './data/data.js';
import { capitalStr } from './modules/capitalStr.js';
import supabase from './supabase.js';
import feather from 'feather-icons';

// Render Skeleton
const root = document.querySelector('#app');
root.innerHTML = `
<div class='container'>

  <header class='header'>
    <div class='logo'>
      <img src='${logo}' height='68' width='68' alt='Today I Learned Logo'/>
      <h1>Today I Learned</h1>
    </div>
    <button class='btn btn-large btn-open' data-btn-share=''>Share a fact</button>
  </header>

  <form class='fact-form hidden' data-form=''>
    <input type='text' name='text' placeholder='Share a fact with the world...' />
    <span data-characters=''>200</span>
    <input type='text' name='source' placeholder='Trustworthy source...' />
    <select name='category'>
      <option value=''>Choose category:</option>
      ${CATEGORIES.map(({ name }) => `<option value='${name}'>${capitalStr(name)}</option>`).join('')}
    </select>
    <button type='submit' class='btn btn-large'>Post</button>
  </form>

  <main class='main'>
    <aside>
      <ul>
        <li class='category'>
          <button class='btn btn-all-categories' data-category='all'>All</button>
        </li>
      ${CATEGORIES.map(({ name: category }) => `
        <li class='category'>
          <button class='btn btn-category' data-category='${category}' style='background-color:${CATEGORIES.find(({ name }) => name === category).color}'>${capitalStr(category)}</button>
        </li>
      `).join('')}
      </ul>
    </aside>
    <section>
      <ul data-facts=''></ul>
    </section>
  </main>
</div>
`;

// Query Selectors
const DOM = {
  buttonShare: document.querySelector('[data-btn-share]'),
  form: document.querySelector('[data-form]'),
  formInputText: document.querySelector('[name="text"]'),
  charactersCount: document.querySelector('[data-characters]'),
  factsList: document.querySelector('[data-facts]'),
  categories: document.querySelectorAll('[data-category]'),
};

const PROPS = {
  facts: [],
  currentCategory: 'all',
  initialAxios: axios.create({
    baseURL: `${import.meta.env.VITE_SUPERBASE_URL}/rest/v1/facts`,
    headers: {
      apiKey: import.meta.env.VITE_API_KEY,
      authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
    },
  }),
};

// Functions
//=================================================
/**
 * @function isValidHttpUrl - Check if URL is validate
 * @param string
 * @returns {boolean}
 */
function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === 'http:' || url.protocol === 'https:';
}

//=================================================
/**
 * @function fetchFacts - Get all facts from API
 * @returns {Promise<void>}
 */
async function fetchFacts() {
  try {
    DOM.factsList.innerHTML = '<h3>Loading Facts...</h3>';

    let query = supabase.from('facts').select('*');

    if (PROPS.currentCategory !== 'all') {
      query = query.eq('category', PROPS.currentCategory);
    }

    const { data: facts, error } = await query
      .order('created_at', { ascending: false })
      .limit(1000);

    PROPS.facts = facts;
    renderFacts(PROPS.facts);

  } catch (e) {
    showNotification('danger', 'Something went wrong, open dev console.');
    DOM.factsList.innerHTML = '<h3>Something went wrong, reload page</h3>';
    console.log(e);
  }
}

//=================================================
/**
 * @function renderFacts - Render facts HTML
 * @param data
 */
function renderFacts(data) {
  DOM.factsList.innerHTML = `
  ${data.map(fact => `
    <li class='fact'>
      <button class='trash' data-trash='${JSON.stringify(fact)}'>${feather.icons.x.toSvg()}</button>
      <p>
        ${fact.text}
        <a class='source' href='${fact.source}' target='_blank'>(Source)</a>
      </p>
      <span class='tag' style='background-color: ${CATEGORIES.find(({ name }) => name === fact.category).color}'>
        ${fact.category}
      </span>
      <div class='vote-buttons' data-fact='${JSON.stringify(fact)}'>
        <button data-vote='votesInteresting'>👍 ${fact.votesInteresting}</button>
        <button data-vote='votesMindblowing'>🤯 ${fact.votesMindblowing}</button>
        <button data-vote='votesFalse'>⛔️ ${fact.votesFalse}</button>
      </div>
    </li>
  `).join('')}
  `;
}

//=================================================
/**
 * @function toggleForm - Show/Hide form
 * @param target
 * @returns {Promise<void>}
 */
async function toggleForm({ target }) {
  DOM.form.classList.toggle('hidden');
  target.textContent = DOM.form.classList.contains('hidden') ? 'Share a fact' : 'Close';
}

//=================================================
/**
 * @function onSubmit - Form submit handler
 * @param event
 * @returns {Promise<void>}
 */
async function onSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const { text, source, category } = Object.fromEntries(new FormData(form).entries());

  if (text.trim().length === 0 || isValidHttpUrl(source) === false || category.trim().length === 0) {
    showNotification('warning', 'Please fill the fields.');
    return;
  }

  const { data: fact, error } = await supabase
    .from('facts')
    .insert([{ text, source, category }])
    .select();

  PROPS.facts = [fact[0], ...PROPS.facts];
  renderFacts(PROPS.facts);

  form.reset();
  form.classList.add('hidden');
  DOM.buttonShare.textContent = form.classList.contains('hidden') ? 'Share a fact' : 'Close';
}

//=================================================
/**
 * @function onGetLengthCount - Check input length
 * @param target
 */
function onGetLengthCount({ target }) {
  const MAX_FIELD_LENGTH = 200;
  const length = Number(target.value.length);
  if (length > MAX_FIELD_LENGTH) {
    target.value = target.value.slice(0, MAX_FIELD_LENGTH);
    showNotification('warning', `Field maximum length is -  ${MAX_FIELD_LENGTH}`);
    return;
  } else {
    DOM.charactersCount.textContent = MAX_FIELD_LENGTH - Number(length);
  }
}

//=================================================
/**
 * @function onCategoryClick - Category click handler
 * @param target
 * @returns {Promise<void>}
 */
async function onCategoryClick({ target }) {
  PROPS.currentCategory = target.dataset.category;
  await fetchFacts();
}

//=================================================
/**
 * @function onFactsClick - Votes buttons click event handler
 * @param target
 * @returns {Promise<void>}
 */
async function onFactsClick({ target }) {
  if (target.matches('[data-vote]')) {
    try {
      const vote = target.dataset.vote;
      const parent = JSON.parse(target.parentElement.dataset.fact);

      const { data: updatedFact, error } = await supabase
        .from('facts')
        .update({ [vote]: parent[vote] + 1 })
        .eq('id', parent.id)
        .select();

      if (error) {
        showNotification('danger', 'Something went wrong, open developer console.');
        return;
      }

      PROPS.facts = PROPS.facts.map(fact => fact.id === updatedFact[0].id ? {
        ...fact,
        [vote]: updatedFact[0][vote],
      } : fact);
      renderFacts(PROPS.facts);
    } catch (e) {
      showNotification('danger', 'Something went wrong, open developer console.');
      console.log(e);
    }
  }

  if (target.matches('[data-trash]')) {
    if (confirm('Are you sure you want to delete the entry?')) {
      try {
        const parent = JSON.parse(target.dataset.trash);
        const { error, status } = await supabase
          .from('facts')
          .delete()
          .eq('id', parent.id);

        if (status === 204) {
          showNotification('success', 'Fact successfully deleted.');
          PROPS.facts = PROPS.facts.filter(fact => fact.id !== parent.id);
          renderFacts(PROPS.facts);
          return;
        }

        if (error) {
          showNotification('danger', 'Something went wrong, open developer console.');
          return;
        }
      } catch (e) {
        showNotification('danger', 'Something went wrong, open developer console.');
        console.log(e);
      }
    }
  }
}

//=================================================
// Event Listeners
//=================================================
fetchFacts();
DOM.buttonShare.addEventListener('click', toggleForm);
DOM.form.addEventListener('submit', onSubmit);
DOM.categories.forEach(category => category.addEventListener('click', onCategoryClick));
DOM.factsList.addEventListener('click', onFactsClick);
DOM.formInputText.addEventListener('input', onGetLengthCount);

