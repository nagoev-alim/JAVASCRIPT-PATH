import { uid } from '../modules/uid.js';

/**
 * @class Storage
 */
export default class Storage {
  /**
   * @function get - Get data from local storage
   * @returns {any|*[]}
   */
  static get = () => {
    return JSON.parse(localStorage.getItem('notes')) || []
      .sort((a, b) => new Date(a.updated) > new Date(b.updated) ? -1 : 1);
  };

  /**
   * @function set - Set data to local storage
   * @param note
   */
  static set = (note) => {
    const notes = Storage.get();
    const existingNote = notes.find(({ id }) => id === note.id);

    if (existingNote) {
      existingNote.title = note.title;
      existingNote.body = note.body;
      existingNote.updated = new Date().toISOString();
    } else {
      note.id = uid();
      note.updated = new Date().toISOString();
      notes.push(note);
    }

    localStorage.setItem('notes', JSON.stringify(notes));
  };

  /**
   * @function delete - Delete item from local storage
   * @param noteId
   */
  static delete = (noteId) => {
    localStorage.setItem('notes', JSON.stringify(Storage.get().filter(({ id }) => id !== noteId)));
  };
}
