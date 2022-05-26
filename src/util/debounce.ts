import { IntroJs } from "../IntroJs";

export default function debounce(
  this: IntroJs,
  func: (...args: any) => any,
  timeout: number
) {
  let timer: NodeJS.Timeout | null = null;
  return (...args: any) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}
