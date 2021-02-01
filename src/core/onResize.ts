import refresh from "./refresh";
import { IntroJs } from "../IntroJs";

export default function onResize(this: IntroJs) {
  refresh.call(this);
}
