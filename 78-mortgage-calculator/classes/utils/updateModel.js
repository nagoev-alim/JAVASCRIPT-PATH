export const updateModel = (target, data) => {
  target.dispatchEvent(new CustomEvent('updateForm', {
    bubbles: true,
    detail: {...data},
  }));
};
