/**
 * @class View
 */
import feather from 'feather-icons';

export default class View {
  constructor(root, { onSelect, onAdd, onEdit, onDelete } = {}) {
    // Props
    this.root = root;
    this.onSelect = onSelect;
    this.onAdd = onAdd;
    this.onEdit = onEdit;
    this.onDelete = onDelete;
    // Render HTML
    this.root.innerHTML = `
      <div class='sidebar'>
        <h3>Notes App</h3>
        <button data-button=''>${feather.icons.plus.toSvg()}Add Note</button>
        <ul data-notes=''></ul>
      </div>
      <div class='preview'>
        <input type='text' placeholder='Enter a title' data-input=''>
        <textarea data-textarea=''></textarea>
      </div>
      <button class='more' data-menu=''>${feather.icons['more-vertical'].toSvg()}</button>
    `;
    // Query selectors
    this.DOM = {
      button: this.root.querySelector('[data-button]'),
      input: this.root.querySelector('[data-input]'),
      textarea: this.root.querySelector('[data-textarea]'),
      menu: this.root.querySelector('[data-menu]'),
    };
    // Events Listeners
    this.DOM.button.addEventListener('click', () => this.onAdd());
    this.DOM.menu.addEventListener('click', () => {
      document.querySelector('.sidebar').classList.toggle('is-open');
    });

    [this.DOM.input, this.DOM.textarea].forEach(field => {
      field.addEventListener('blur', () => {
        this.onEdit(this.DOM.input.value.trim(), this.DOM.textarea.value.trim());
      });
    });

    this.updatePreview(false);
  }

  /**
   * @function _create
   * @param id
   * @param title
   * @param body
   * @param updated
   * @returns {string}
   * @private
   */
  _create = (id, title, body, updated) => {
    return `
      <li data-note-id='${id}'>
        <h3 class='h5'>${title}</h3>
        <p>${body.substring(0, 60)} ${body.length > 60 ? '...' : ''}</p>
        <span>${updated.toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</span>
      </li>`;
  };

  /**
   * @function renderList
   * @param data
   */
  renderList = (data) => {
    const notes = this.root.querySelector('[data-notes]');

    notes.innerHTML = '';

    for (const { id, title, body, updated } of data) {
      const html = this._create(id, title, body, new Date(updated));
      notes.insertAdjacentHTML('beforeend', html);
    }

    notes.querySelectorAll('li').forEach(note => {
      const id = note.dataset.noteId;

      note.addEventListener('click', () => {
        this.onSelect(id);
      });

      note.addEventListener('dblclick', () => {
        if (confirm('Are you sure you want to delete this note?')) {
          this.onDelete(id);
        }
      });
    });
  };

  /**
   * @function updateNote -
   * @param note
   */
  updateNote = ({ title, body, id }) => {
    this.DOM.input.value = title;
    this.DOM.textarea.value = body;
    // this.root.querySelector('[data-input]').value = title;
    // this.root.querySelector('[data-textarea]').value = body;
    this.root.querySelectorAll('li').forEach(note => note.classList.remove('selected'));
    this.root.querySelector(`li[data-note-id="${id}"]`).classList.add('selected');
  };

  /**
   * @function updatePreview
   * @param visible
   */
  updatePreview = (visible) => {
    this.root.querySelector('.preview').style.visibility = visible ? 'visible' : 'hidden';
  };
}
