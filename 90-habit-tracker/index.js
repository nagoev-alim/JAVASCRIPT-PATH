// 🚀 Libraries
import { icons } from 'feather-icons';
// 🚀 Styles
import './style.scss';
// 🚀 Classes
import App from './classes/App.js';

// 🚀 Render Skeleton
const app = document.querySelector('#app');
app.innerHTML = `
<div class='app-container'>
  <div id='root' class='tracker'></div>
  <a class='app-author' href='https://github.com/nagoev-alim' target='_blank'>${icons.github.toSvg()}</a>
</div>`;

// 🚀 Class Instance
new App(document.querySelector('#root'));
