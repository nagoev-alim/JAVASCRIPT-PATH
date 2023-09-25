/**
 * @function uid - Generate random ID
 * @returns {string}
 */
export const uid = () => String(Date.now().toString(32) + Math.random().toString(16)).replace(/\./g, '');

