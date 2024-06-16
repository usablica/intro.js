import refresh from "./refresh";
import { Tour } from "./tour";

export default function onResize(tour: Tour) {
  refresh(tour);
}
