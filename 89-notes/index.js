// ⚡️ Import Styles
import feather from 'feather-icons';
import './style.scss';
import App from './classes/App.js';

// ⚡️ Render Skeleton
document.querySelector('#app').innerHTML = `
<div class='app-container'>
  <div class='notes'></div>
  <a class='app-author' href='https://github.com/nagoev-alim' target='_blank'>${feather.icons.github.toSvg()}</a>
</div>`;

// ⚡️ Class instance
new App(document.querySelector('.notes'));
