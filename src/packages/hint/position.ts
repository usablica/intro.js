import { computePosition, offset, shift, Placement } from "../positioning";
import isFixed from "../../util/isFixed";
import { HintPosition } from "./hintItem";

/**
 * Positions a hint icon element over its target element according to the
 * requested HintPosition.
 *
 * Hint icons sit ON the target's edge/corner rather than beside it, so the
 * mainAxis offset pulls each icon back by its own dimension so it overlaps the
 * target boundary. crossAxis is always 0 because computeCoords already centres
 * the icon on the cross axis for "top", "bottom", "left", and "right" placements.
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

  const targetRect = targetElement.getBoundingClientRect();
  const hintRect = hintElement.getBoundingClientRect();

  const placementMap: Record<HintPosition, Placement> = {
    "top-left": "top-start",
    "top-right": "top-end",
    "top-middle": "top",
    "bottom-left": "bottom-start",
    "bottom-right": "bottom-end",
    "bottom-middle": "bottom",
    "middle-left": "left",
    "middle-right": "right",
    // "top" centres horizontally; mainAxis pushes the icon to the vertical centre.
    "middle-middle": "top",
  };

  // Pull the icon back so it sits on the target's edge instead of outside it.
  // For top/bottom edges: retract by full icon height.
  // For left/right edges: retract by full icon width.
  // For centre: retract by half the combined height to centre vertically.
  const mainAxis = (): number => {
    switch (position) {
      case "top-left":
      case "top-right":
      case "top-middle":
      case "bottom-left":
      case "bottom-right":
      case "bottom-middle":
        return -hintRect.height;
      case "middle-left":
      case "middle-right":
        return -hintRect.width;
      case "middle-middle":
        return -(targetRect.height + hintRect.height) / 2;
      default:
        return 0;
    }
  };

  const strategy = isFixed(targetElement) ? "fixed" : "absolute";
  const result = computePosition({
    reference: targetElement,
    floating: hintElement,
    placement: placementMap[position],
    strategy,
    middleware: [
      offset({ mainAxis: mainAxis(), crossAxis: 0 }),
      shift({ padding: 8 }),
    ],
  });

  hintElement.style.left = `${result.x}px`;
  hintElement.style.top = `${result.y}px`;
};
