export default function debounce(
  func: Function,
  timeout: number
): (...args: any) => void {
  let timer: number;

  return (...args) => {
    window.clearTimeout(timer);

    timer = window.setTimeout(() => {
      func(args);
    }, timeout);
  };
}
