import AbstractView from './AbstractView.js';

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('Home');
  }

  async getHtml() {
    return `
            <h1 class="title">Home</h1>
            <p>Hello, this is a homepage 👋</p>
        `;
  }
}
