import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

/**
 * Функция для показа уведомлений (тостов)
 *
 * @param message - Текст уведомления
 * @param type - Тип уведомления (success, error, warning)
 * @param classname - Доп. класс для стилизации
 */
export function toast(
  message: string = '',
  type: 'success' | 'error' | 'warning',
  classname: string = '',
): void {

  // Определение классов и текста в зависимости от типа
  let classList: string = '';
  let text: string = '';

  switch (type) {

    case 'success':
      classList = 'border-green-200 bg-green-100';
      text = `✅ ${message}`;
      break;

    case 'warning':
      classList = 'border-orange-200 bg-orange-100';
      text = `🚧 ${message}`;
      break;

    case 'error':
      classList = 'border-red-200 bg-red-100';
      text = `⛔️ ${message}`;
      break;

    default:
      break;
  }

  // Показ уведомления с помощью библиотеки Toastify
  Toastify({
    text: text,
    className: `bg-none shadow-none text-black border ${classList} ${classname}`,
    duration: 3000,
    gravity: 'bottom',
    position: 'center',
  }).showToast();
}
