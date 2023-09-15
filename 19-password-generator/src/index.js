// ⚡️ Import Styles
import './style.scss';
import feather from 'feather-icons';
import qrcode from './assets/images/qrcode.png';
import { showNotification } from './modules/showNotification.js';

// ⚡️ Render Skeleton
document.querySelector('#app').innerHTML = `
<div class='app-container'>
  <div class='qr-code'>
    <h2>QR Code Generator</h2>
    <p>Paste a url or enter text to create QR code</p>

    <form data-form>
      <input type='text' name='text' placeholder='Enter text or url' />
      <select name='size'>
        ${[100, 200, 300, 400, 500, 600, 700].map(index => index === 300 ? `<option selected value='${index}'>${index}x${index}</option>` : `<option value='${index}'>${index}x${index}</option>`).join('')}
      </select>
      <button type='submit' data-submit>Generate QR Code</button>
    </form>

    <div class='content' data-container=''>
      <div id='qrcode'></div>
      <a class='button' href='#' download='qrcode' data-save>Save Image</a>
    </div>
  </div>

  <a class='app-author' href='https://github.com/nagoev-alim' target='_blank'>${feather.icons.github.toSvg()}</a>
</div>
`;

// ⚡️Class
class App {
  constructor() {
    this.DOM = {
      form: document.querySelector('[data-form]'),
      submitBtn: document.querySelector('[data-submit]'),
      qrcode: document.querySelector('#qrcode'),
      saveBtn: document.querySelector('[data-save]'),
      container: document.querySelector('[data-container]'),
    };

    this.DOM.form.addEventListener('submit', this.onSubmit);
  }

  /**
   * @function onSubmit - Form submit handler
   * @param event
   */
  onSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    this.DOM.qrcode.innerHTML = ``
    this.DOM.container.classList.remove('is-show');
    const { text, size } = Object.fromEntries(new FormData(form).entries());

    if (!text) {
      showNotification('danger', 'Please enter a valid URL');
      return;
    }

    this.DOM.submitBtn.textContent = 'Generating QR Code...';

    new QRCode('qrcode', {
      text: text,
      width: size,
      height: size,
    });

    setTimeout(() => {
      this.DOM.saveBtn.href = this.DOM.qrcode.querySelector('img').src;
      this.DOM.container.classList.add('is-show');
      this.DOM.submitBtn.textContent = 'Generate QR Code';
    }, 1000);
  };
}

// ⚡️Class Instance
new App();

