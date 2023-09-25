import View from './View.js';
import Storage from './Storage.js';

/**
 * @class App
 */
export default class App {
  constructor(root) {
    this.notes = [];
    this.activeNote = null;
    this.view = new View(root, this._handlers());

    this._refresh();
  }

  /**
   * @function _handlers
   * @returns {{onEdit: onEdit, onDelete: onDelete, onAdd: onAdd, onSelect: onSelect}}
   * @private
   */
  _handlers = () => ({
    // Add note
    onAdd: () => {
      Storage.set({
        title: 'New Note',
        body: 'Take note...',
      });

      this._refresh();
    },
    // Select note
    onSelect: noteId => {
      this._setActive(this.notes.find(({ id }) => id === noteId));
    },
    // Edit note
    onEdit: (title, body) => {
      Storage.set({
        id: this.activeNote.id,
        title,
        body,
      });

      this._refresh();
    },
    // Delete note
    onDelete: noteId => {
      Storage.delete(noteId);
      this._refresh();
    },
  });

  /**
   * @function _refresh - Refresh UI
   * @private
   */
  _refresh = () => {
    const notes = Storage.get();
    this._set(notes);

    if (notes.length > 0) {
      this._setActive(notes[0]);
    }
  };

  /**
   * @function _set - Set notes
   * @param notes
   * @private
   */
  _set = (notes) => {
    this.notes = notes;
    this.view.renderList(notes);
    this.view.updatePreview(notes.length > 0);
  };

  /**
   * @function _setActive - Add class to active note
   * @param note
   * @private
   */
  _setActive = (note) => {
    this.activeNote = note;
    this.view.updateNote(note);
  };
}
