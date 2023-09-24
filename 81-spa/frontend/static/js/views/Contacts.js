import AbstractView from './AbstractView.js';

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('Contacts');
  }

  async getHtml() {
    return `
            <h1 class="title">Contacts</h1>
            <p>This is a contacts page 👋</p>
        `;
  }
}
