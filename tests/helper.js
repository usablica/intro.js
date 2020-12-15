export function find(selector) {
  return document.querySelector(selector);
}

export function content(selector) {
  const el = find(selector);

  if (el) {
    return el.innerHTML;
  }

  return null;
}

export function className(selector) {
  const el = find(selector);

  if (el) {
    return el.className;
  }

  return null;
}
