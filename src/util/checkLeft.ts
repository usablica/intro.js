/**
 * Set tooltip right so it doesn't go off the left side of the window
 *
 * @return boolean true, if tooltipLayerStyleRight is ok.  false, otherwise.
 */
import {Offset} from "./getOffset";

export default function checkLeft(
  targetOffset: Offset,
  tooltipLayerStyleRight: number,
  tooltipOffset: Offset,
  tooltipLayer: HTMLElement
) {
  if (targetOffset.left + targetOffset.width - tooltipLayerStyleRight - tooltipOffset.width < 0) {
    // off the left side of the window
    tooltipLayer.style.left = `${-targetOffset.left}px`;
    return false;
  }
  tooltipLayer.style.right = `${tooltipLayerStyleRight}px`;
  return true;
}
