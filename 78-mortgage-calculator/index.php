<!DOCTYPE html>
<html lang='en'>
<head>
  <meta charset='UTF-8' />
  <link rel='icon' type='image/svg+xml' href='assets/images/favicon.svg' />
  <meta name='viewport' content='width=device-width, initial-scale=1.0' />
  <link rel='stylesheet' href='libs/noUiSlider/nouislider.min.css'>
  <link rel='stylesheet' href='assets/css/style.css'>
  <title>Онлайн калькулятор</title>
</head>
<body>
<div id='app'>
  <div class='app-container'>
    <div class='mortgage'>
      <h3 class='h4 title'>Онлайн калькулятор</h3>

      <div class='container'>
        <div class='content'>
          <form id='form' class='form'>
            <p class='h5'>Выберите программу:</p>
            <div class='form-group'>
              <div>
                <input type='radio' name='program' value='base' id='base-value' class='visually-hidden' checked>
                <label for='base-value' class='button'>Базовая программа<span id='base-text'>XX</span></label>
              </div>
              <div>
                <input type='radio' name='program' value='it' id='it-value' class='visually-hidden'>
                <label for='it-value' class='button'>Ипотека для IT <span id='it-text'>XX</span></label>
              </div>
              <div>
                <input type='radio' name='program' value='gov' id='gov-value' class='visually-hidden'>
                <label for='gov-value' class='button'>Господдержка <span id='gov-text'>XX</span></label>
              </div>
              <div>
                <input type='radio' name='program' value='zero' id='zero-value' class='visually-hidden'>
                <label for='zero-value' class='button'>Без первоначального взноса <span id='zero-text'>XX</span></label>
              </div>
            </div>
            <p class='h5'>Заполните параметры:</p>
            <div class='form-group form-group--params'>
              <label>
                <div class='field'>
                  <p class='h6'>Стоимость недвижимости</p>
                  <input type='text' value='' inputmode='decimal' id='input-cost'>
                </div>
                <div class='slider' id='slider-cost'></div>
                <div class='limit'>
                  <p>375 тыс. Р</p>
                  <p class='middle'>10 млн Р</p>
                  <p>100 млн Р</p>
                </div>
              </label>
              <label>
                <div class='field'>
                  <p class='h6'>Первоначальный взнос</p>
                  <input type='text' value='' id='input-downpayment'>
                </div>
                <div class='slider' id='slider-downpayment'></div>
                <div class='limit'>
                  <div id='percents-from'>15%</div>
                  <div>90%</div>
                </div>
              </label>
              <label>
                <div class='field'>
                  <p class='h6'>Срок кредита</p>
                  <input type='text' value='' id='input-term'>
                </div>
                <div class='slider' id='slider-term'></div>
                <div class='limit'>
                  <div>1 год</div>
                  <div>30 лет</div>
                </div>
              </label>
            </div>
          </form>
        </div>

        <div class='content'>
          <div class='summary'>
            <div class='item'>
              <p>Ежемесячный платеж</p>
              <span class='h5' id='total-month-payment'>XXXX</span>
            </div>
            <div class='item'>
              <p>Процентная ставка</p>
              <span class='h5' id='total-percent'>XX%</span>
            </div>
            <div class='item'>
              <p>Сумма кредита</p>
              <span class='h5' id='total-cost'>XXXX</span>
            </div>
            <div class='item'>
              <p>Сумма кредита</p>
              <span class='h5' id='total-overpayment'>XXXX</span>
            </div>
          </div>

          <div class='order'>
            <button id='openFormBtn' type='button'>Оставить заявку</button>
            <form class='form-order hide' id='orderForm'>
              <label>
                <input name='name' value='' type='text' placeholder='Имя, Фамилия' required>
              </label>
              <label>
                <input name='email' value='info@johndoe.ru' type='email' placeholder='Email' required>
              </label>
              <label>
                <input name='phone' value='+79994447777' type='text' placeholder='Телефон' data-tel-input required>
              </label>
              <button type='submit' id='submitFormBtn'>Оформить заявку</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <a class='app-author' href='https://github.com/nagoev-alim' target='_blank'>
      <img src='assets/images/github.svg' alt='github'>
    </a>
  </div>
</div>

<!-- Libs -->
<script src='libs/wNumb/wNumb.min.js'></script>
<script src='libs/noUiSlider/nouislider.min.js'></script>
<script src='libs/cleaveJS/cleave.min.js'></script>
<script src='./libs/phoneInput/phoneInput.js'></script>

<!-- Scripts -->
<script type='module' src='index.js'></script>
</body>
</html>
