import { IntroJs } from "../IntroJs";

export default function debounce(
  this: IntroJs,
  func: () => void,
  timeout: number
) {
  let timer: NodeJS.Timeout;
  return (...args: Array<any>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}
