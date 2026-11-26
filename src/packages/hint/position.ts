import getOffset from "../../util/getOffset";
import { HintPosition } from "./hintItem";

const iconWidth = 20;
const iconHeight = 20;

/**
 * Where the hint icon goes in its target element: the offset of its top
 * left corner from the top left corner of the element
 */
const iconOffset = (
  position: HintPosition,
  width: number,
  height: number
): { x: number; y: number } => {
  const right = width - iconWidth;
  const bottom = height - iconHeight;
  const center = (width - iconWidth) / 2;
  const middle = (height - iconHeight) / 2;

  switch (position) {
    case "top-right":
      return { x: right, y: 0 };
    case "bottom-left":
      return { x: 0, y: bottom };
    case "bottom-right":
      return { x: right, y: bottom };
    case "middle-left":
      return { x: 0, y: middle };
    case "middle-right":
      return { x: right, y: middle };
    case "middle-middle":
      return { x: center, y: middle };
    case "bottom-middle":
      return { x: center, y: bottom };
    case "top-middle":
      return { x: center, y: 0 };
    case "top-left":
    default:
      return { x: 0, y: 0 };
  }
};

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
  const { x, y } = iconOffset(position, offset.width, offset.height);

  // align the hint element
  hintElement.style.left = `${offset.left + x}px`;
  hintElement.style.top = `${offset.top + y}px`;
};

/**
 * The center of the hint icon of an element, in viewport coordinates
 *
 * @api private
 */
export const hintIconCenter = (
  position: HintPosition,
  targetElement: HTMLElement
) => {
  const rect = targetElement.getBoundingClientRect();
  const { x, y } = iconOffset(position, rect.width, rect.height);

  return {
    x: rect.left + x + iconWidth / 2,
    y: rect.top + y + iconHeight / 2,
  };
};
