import AbstractView from './AbstractView.js';

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.postId = params.id;
    this.setTitle('Viewing Post');
    this.fetchPost();
  }

  async getHtml() {
    return `
            <a class='back' href='/posts' data-link>Back</a>
            <div class='post'></div>
        `;
  }

  async fetchPost() {
    try {
      // Get posts
      const [post, user] = await Promise.all([
        await fetch(`https://jsonplaceholder.typicode.com/posts/${this.postId}`).then(data => data.json()),
        await fetch(`https://jsonplaceholder.typicode.com/users/${this.postId}`).then(data => data.json()),
      ]);

      const postEl = document.querySelector('.post')
      postEl.textContent = 'Loading...'

      // Render result
      postEl.innerHTML = `
      <h1 class='title'>${post.title}</h1>
      <p>${post.body}</p>
      <p>Created by ${user.name}</p>
      `

    } catch (e) {
      console.log(e);
    }
  }
}
