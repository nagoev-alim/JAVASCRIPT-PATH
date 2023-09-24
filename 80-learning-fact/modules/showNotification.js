/**
 * @function showNotification - Display message on screen
 * @param type
 * @param text
 */
export const showNotification = (type, text) => {
  const notification = document.createElement('div');
  notification.className = `notification show ${type}`;
  switch (type) {
    case 'danger':
      notification.innerHTML = `
      <p class='notification__info'>
        <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path d='M9 21.5L17.5 13L13 10L15 2.5L6.5 11L11 14L9 21.5Z' fill='currentColor' />
        </svg>
      </p>
      ${text}`;
      break;
    case 'warning':
      notification.innerHTML = `
        <p class='notification__info'>
          <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path d='M12 6C12.5523 6 13 6.44772 13 7V13C13 13.5523 12.5523 14 12 14C11.4477 14 11 13.5523 11 13V7C11 6.44772 11.4477 6 12 6Z' fill='currentColor' />
            <path d='M12 16C11.4477 16 11 16.4477 11 17C11 17.5523 11.4477 18 12 18C12.5523 18 13 17.5523 13 17C13 16.4477 12.5523 16 12 16Z' fill='currentColor' />
            <path fill-rule='evenodd' clip-rule='evenodd' d='M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12Z' fill='currentColor' />
          </svg>
        </p>
        ${text}`;
      break;
    case 'success':
      notification.innerHTML = `
        <p class='notification__info'>
          <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path d='M10.5858 13.4142L7.75735 10.5858L6.34314 12L10.5858 16.2427L17.6568 9.1716L16.2426 7.75739L10.5858 13.4142Z' fill='currentColor' />
          </svg>
        </p>
        ${text}`;
      break;
    default:
      break;
  }

  document.body.append(notification);
  setTimeout(() => notification.remove(), 3000);
};
