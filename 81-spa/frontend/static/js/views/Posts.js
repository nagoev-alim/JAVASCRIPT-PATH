import AbstractView from './AbstractView.js';

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('Posts');
    this.fetchPosts();
  }

  async getHtml() {
    return `
            <h1 class='title'>Posts</h1>
            <ul class='posts'></ul>
        `;
  }

  async fetchPosts() {
    try {
      // Get posts
      const [posts, users] = await Promise.all([
        await fetch('https://jsonplaceholder.typicode.com/posts?_start=0&_limit=10').then(data => data.json()),
        await fetch('https://jsonplaceholder.typicode.com/users?_start=0&_limit=10').then(data => data.json()),
      ]);

      // Render result
      const list = document.querySelector('.posts');
      list.innerHTML = 'Loading...'
      list.innerHTML = `
      ${posts.map(({ title, body, id: postId }) => `
        <li>
           <h3>${title}</h3>
           <p>${body}</p>
           <p>Posted by ${users.find(({ id }) => id === postId).name}</p>
           <a href='/posts/${postId}' data-link>More...</a>
         </li>
      `).join('')}`;

    } catch (e) {
      console.log(e);
    }
  }
}
