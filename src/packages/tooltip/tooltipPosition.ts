import getWindowSize from "../../util/getWindowSize";
import removeEntry from "../../util/removeEntry";
import { Offset } from "../../util/getOffset";

export type TooltipPosition =
  | "floating"
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-right-aligned"
  | "top-left-aligned"
  | "top-middle-aligned"
  | "bottom-right-aligned"
  | "bottom-left-aligned"
  | "bottom-middle-aligned";

/**
 * auto-determine alignment
 */
export function determineAutoAlignment(
  offsetLeft: number,
  tooltipWidth: number,
  windowWidth: number,
  desiredAlignment: TooltipPosition[]
): TooltipPosition | null {
  const halfTooltipWidth = tooltipWidth / 2;
  const winWidth = Math.min(windowWidth, window.screen.width);

  // valid left must be at least a tooltipWidth
  // away from right side
  if (winWidth - offsetLeft < tooltipWidth) {
    removeEntry<TooltipPosition>(desiredAlignment, "top-left-aligned");
    removeEntry<TooltipPosition>(desiredAlignment, "bottom-left-aligned");
  }

  // valid middle must be at least half
  // width away from both sides
  if (
    offsetLeft < halfTooltipWidth ||
    winWidth - offsetLeft < halfTooltipWidth
  ) {
    removeEntry<TooltipPosition>(desiredAlignment, "top-middle-aligned");
    removeEntry<TooltipPosition>(desiredAlignment, "bottom-middle-aligned");
  }

  // valid right must be at least a tooltipWidth
  // width away from left side
  if (offsetLeft < tooltipWidth) {
    removeEntry<TooltipPosition>(desiredAlignment, "top-right-aligned");
    removeEntry<TooltipPosition>(desiredAlignment, "bottom-right-aligned");
  }

  if (desiredAlignment.length) {
    return desiredAlignment[0];
  }

  return null;
}

/**
 * Determines the position of the tooltip based on the position precedence and availability
 * of screen space.
 */
export function determineAutoPosition(
  positionPrecedence: TooltipPosition[],
  targetOffset: Offset,
  tooltipWidth: number,
  tooltipHeight: number,
  desiredTooltipPosition: TooltipPosition
): TooltipPosition {
  // Take a clone of position precedence. These will be the available
  const possiblePositions = positionPrecedence.slice();

  const windowSize = getWindowSize();

  // Add some padding to the tooltip height and width for better positioning
  tooltipHeight = tooltipHeight + 10;
  tooltipWidth = tooltipWidth + 20;

  // If we check all the possible areas, and there are no valid places for the tooltip, the element
  // must take up most of the screen real estate. Show the tooltip floating in the middle of the screen.
  let calculatedPosition: TooltipPosition = "floating";

  /*
   * auto determine position
   */

  // Check for space below
  if (targetOffset.absoluteBottom + tooltipHeight > windowSize.height) {
    removeEntry<TooltipPosition>(possiblePositions, "bottom");
  }

  // Check for space above
  if (targetOffset.absoluteTop - tooltipHeight < 0) {
    removeEntry<TooltipPosition>(possiblePositions, "top");
  }

  // Check for space to the right
  if (targetOffset.absoluteRight + tooltipWidth > windowSize.width) {
    removeEntry<TooltipPosition>(possiblePositions, "right");
  }

  // Check for space to the left
  if (targetOffset.absoluteLeft - tooltipWidth < 0) {
    removeEntry<TooltipPosition>(possiblePositions, "left");
  }

  // strip alignment from position
  if (desiredTooltipPosition) {
    // ex: "bottom-right-aligned"
    // should return 'bottom'
    desiredTooltipPosition = desiredTooltipPosition.split(
      "-"
    )[0] as TooltipPosition;
  }

  if (possiblePositions.length) {
    // Pick the first valid position, in order
    calculatedPosition = possiblePositions[0];

    if (possiblePositions.includes(desiredTooltipPosition)) {
      // If the requested position is in the list, choose that
      calculatedPosition = desiredTooltipPosition;
    }
  }

  // only "top" and "bottom" positions have optional alignments
  if (calculatedPosition === "top" || calculatedPosition === "bottom") {
    let defaultAlignment: TooltipPosition;
    let desiredAlignment: TooltipPosition[] = [];

    if (calculatedPosition === "top") {
      // if screen width is too small
      // for ANY alignment, middle is
      // probably the best for visibility
      defaultAlignment = "top-middle-aligned";

      desiredAlignment = [
        "top-left-aligned",
        "top-middle-aligned",
        "top-right-aligned",
      ];
    } else {
      defaultAlignment = "bottom-middle-aligned";

      desiredAlignment = [
        "bottom-left-aligned",
        "bottom-middle-aligned",
        "bottom-right-aligned",
      ];
    }

    calculatedPosition =
      determineAutoAlignment(
        targetOffset.absoluteLeft,
        tooltipWidth,
        windowSize.width,
        desiredAlignment
      ) || defaultAlignment;
  }

  return calculatedPosition;
}
