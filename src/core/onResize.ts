import refresh from "./refresh";
import { IntroJs } from "../index";

export default function onResize(this: IntroJs) {
  refresh.call(this);
}
