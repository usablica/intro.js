import getOffset from "../../util/getOffset";
import { HintPosition } from "./hintItem";
import { Hint } from "./hint";

/**
 * Aligns hint position
 *
 * @api private
 */
export const alignHintPosition = (
  position: HintPosition,
  hintElement: HTMLElement,
  targetElement?: HTMLElement
) => {
  if (typeof targetElement === "undefined") {
    return;
  }

  // get/calculate offset of target element
  const offset = getOffset(targetElement);
  const iconWidth = 20;
  const iconHeight = 20;

  // align the hint element
  switch (position) {
    default:
    case "top-left":
      hintElement.style.left = `${offset.left}px`;
      hintElement.style.top = `${offset.top}px`;
      break;
    case "top-right":
      hintElement.style.left = `${offset.left + offset.width - iconWidth}px`;
      hintElement.style.top = `${offset.top}px`;
      break;
    case "bottom-left":
      hintElement.style.left = `${offset.left}px`;
      hintElement.style.top = `${offset.top + offset.height - iconHeight}px`;
      break;
    case "bottom-right":
      hintElement.style.left = `${offset.left + offset.width - iconWidth}px`;
      hintElement.style.top = `${offset.top + offset.height - iconHeight}px`;
      break;
    case "middle-left":
      hintElement.style.left = `${offset.left}px`;
      hintElement.style.top = `${
        offset.top + (offset.height - iconHeight) / 2
      }px`;
      break;
    case "middle-right":
      hintElement.style.left = `${offset.left + offset.width - iconWidth}px`;
      hintElement.style.top = `${
        offset.top + (offset.height - iconHeight) / 2
      }px`;
      break;
    case "middle-middle":
      hintElement.style.left = `${
        offset.left + (offset.width - iconWidth) / 2
      }px`;
      hintElement.style.top = `${
        offset.top + (offset.height - iconHeight) / 2
      }px`;
      break;
    case "bottom-middle":
      hintElement.style.left = `${
        offset.left + (offset.width - iconWidth) / 2
      }px`;
      hintElement.style.top = `${offset.top + offset.height - iconHeight}px`;
      break;
    case "top-middle":
      hintElement.style.left = `${
        offset.left + (offset.width - iconWidth) / 2
      }px`;
      hintElement.style.top = `${offset.top}px`;
      break;
  }
};

/**
 * Re-aligns all hint elements
 *
 * @api private
 */
export function reAlignHints(hint: Hint) {
  for (const { hintTooltipElement, hintPosition, element } of hint.getHints()) {
    alignHintPosition(hintPosition, element as HTMLElement, hintTooltipElement);
  }
}
