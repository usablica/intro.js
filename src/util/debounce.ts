export default function debounce(
  func: Function,
  timeout: number
): (...args) => void {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}
