import getOffset from "../util/getOffset";
import getWindowSize from "../util/getWindowSize";
import { addClass, setClass } from "../util/className";
import checkRight from "../util/checkRight";
import checkLeft from "../util/checkLeft";
import removeEntry from "../util/removeEntry";

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
function _determineAutoAlignment(
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
function _determineAutoPosition(
  positionPrecedence: TooltipPosition[],
  targetElement: HTMLElement,
  tooltipLayer: HTMLElement,
  desiredTooltipPosition: TooltipPosition
): TooltipPosition {
  // Take a clone of position precedence. These will be the available
  const possiblePositions = positionPrecedence.slice();

  const windowSize = getWindowSize();
  const tooltipHeight = getOffset(tooltipLayer).height + 10;
  const tooltipWidth = getOffset(tooltipLayer).width + 20;
  const targetElementRect = targetElement.getBoundingClientRect();

  // If we check all the possible areas, and there are no valid places for the tooltip, the element
  // must take up most of the screen real estate. Show the tooltip floating in the middle of the screen.
  let calculatedPosition: TooltipPosition = "floating";

  /*
   * auto determine position
   */

  // Check for space below
  if (targetElementRect.bottom + tooltipHeight > windowSize.height) {
    removeEntry<TooltipPosition>(possiblePositions, "bottom");
  }

  // Check for space above
  if (targetElementRect.top - tooltipHeight < 0) {
    removeEntry<TooltipPosition>(possiblePositions, "top");
  }

  // Check for space to the right
  if (targetElementRect.right + tooltipWidth > windowSize.width) {
    removeEntry<TooltipPosition>(possiblePositions, "right");
  }

  // Check for space to the left
  if (targetElementRect.left - tooltipWidth < 0) {
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
      _determineAutoAlignment(
        targetElementRect.left,
        tooltipWidth,
        windowSize.width,
        desiredAlignment
      ) || defaultAlignment;
  }

  return calculatedPosition;
}

/**
 * Render tooltip box in the page
 *
 * @api private
 */
export default function placeTooltip(
  tooltipLayer: HTMLElement,
  arrowLayer: HTMLElement,
  targetElement: HTMLElement,
  position: TooltipPosition,
  positionPrecedence: TooltipPosition[],
  showStepNumbers = false,
  autoPosition = true,
  tooltipClassName = "",
  hintMode: boolean = false
) {
  let tooltipOffset: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  let targetOffset: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  let windowSize: { width: number; height: number };

  //reset the old style
  tooltipLayer.style.top = "";
  tooltipLayer.style.right = "";
  tooltipLayer.style.bottom = "";
  tooltipLayer.style.left = "";
  tooltipLayer.style.marginLeft = "";
  tooltipLayer.style.marginTop = "";

  arrowLayer.style.display = "inherit";

  setClass(tooltipLayer, "introjs-tooltip", tooltipClassName);

  tooltipLayer.setAttribute("role", "dialog");

  // Floating is always valid, no point in calculating
  if (position !== "floating" && autoPosition) {
    position = _determineAutoPosition(
      positionPrecedence,
      targetElement,
      tooltipLayer,
      position
    );
  }

  let tooltipLayerStyleLeft: number;
  targetOffset = getOffset(targetElement as HTMLElement);
  tooltipOffset = getOffset(tooltipLayer);
  windowSize = getWindowSize();

  addClass(tooltipLayer, `introjs-${position}`);

  let tooltipLayerStyleLeftRight =
    targetOffset.width / 2 - tooltipOffset.width / 2;

  switch (position) {
    case "top-right-aligned":
      setClass(arrowLayer, "introjs-arrow bottom-right");

      let tooltipLayerStyleRight = 0;
      checkLeft(
        targetOffset,
        tooltipLayerStyleRight,
        tooltipOffset,
        tooltipLayer
      );
      tooltipLayer.style.bottom = `${targetOffset.height + 20}px`;
      break;

    case "top-middle-aligned":
      setClass(arrowLayer, "introjs-arrow bottom-middle");

      // a fix for middle aligned hints
      if (hintMode) {
        tooltipLayerStyleLeftRight += 5;
      }

      if (
        checkLeft(
          targetOffset,
          tooltipLayerStyleLeftRight,
          tooltipOffset,
          tooltipLayer
        )
      ) {
        tooltipLayer.style.right = "";
        checkRight(
          targetOffset,
          tooltipLayerStyleLeftRight,
          tooltipOffset,
          windowSize,
          tooltipLayer
        );
      }
      tooltipLayer.style.bottom = `${targetOffset.height + 20}px`;
      break;

    case "top-left-aligned":
    // top-left-aligned is the same as the default top
    case "top":
      setClass(arrowLayer, "introjs-arrow bottom");

      tooltipLayerStyleLeft = hintMode ? 0 : 15;

      checkRight(
        targetOffset,
        tooltipLayerStyleLeft,
        tooltipOffset,
        windowSize,
        tooltipLayer
      );
      tooltipLayer.style.bottom = `${targetOffset.height + 20}px`;
      break;
    case "right":
      tooltipLayer.style.left = `${targetOffset.width + 20}px`;
      if (targetOffset.top + tooltipOffset.height > windowSize.height) {
        // In this case, right would have fallen below the bottom of the screen.
        // Modify so that the bottom of the tooltip connects with the target
        setClass(arrowLayer, "introjs-arrow left-bottom");
        tooltipLayer.style.top = `-${
          tooltipOffset.height - targetOffset.height - 20
        }px`;
      } else {
        setClass(arrowLayer, "introjs-arrow left");
      }
      break;
    case "left":
      if (!hintMode && showStepNumbers === true) {
        tooltipLayer.style.top = "15px";
      }

      if (targetOffset.top + tooltipOffset.height > windowSize.height) {
        // In this case, left would have fallen below the bottom of the screen.
        // Modify so that the bottom of the tooltip connects with the target
        tooltipLayer.style.top = `-${
          tooltipOffset.height - targetOffset.height - 20
        }px`;
        setClass(arrowLayer, "introjs-arrow right-bottom");
      } else {
        setClass(arrowLayer, "introjs-arrow right");
      }
      tooltipLayer.style.right = `${targetOffset.width + 20}px`;

      break;
    case "floating":
      arrowLayer.style.display = "none";

      //we have to adjust the top and left of layer manually for intro items without element
      tooltipLayer.style.left = "50%";
      tooltipLayer.style.top = "50%";
      tooltipLayer.style.marginLeft = `-${tooltipOffset.width / 2}px`;
      tooltipLayer.style.marginTop = `-${tooltipOffset.height / 2}px`;

      break;
    case "bottom-right-aligned":
      setClass(arrowLayer, "introjs-arrow top-right");

      tooltipLayerStyleRight = 0;
      checkLeft(
        targetOffset,
        tooltipLayerStyleRight,
        tooltipOffset,
        tooltipLayer
      );
      tooltipLayer.style.top = `${targetOffset.height + 20}px`;
      break;

    case "bottom-middle-aligned":
      setClass(arrowLayer, "introjs-arrow top-middle");

      // a fix for middle aligned hints
      if (hintMode) {
        tooltipLayerStyleLeftRight += 5;
      }

      if (
        checkLeft(
          targetOffset,
          tooltipLayerStyleLeftRight,
          tooltipOffset,
          tooltipLayer
        )
      ) {
        tooltipLayer.style.right = "";
        checkRight(
          targetOffset,
          tooltipLayerStyleLeftRight,
          tooltipOffset,
          windowSize,
          tooltipLayer
        );
      }
      tooltipLayer.style.top = `${targetOffset.height + 20}px`;
      break;

    // case 'bottom-left-aligned':
    // Bottom-left-aligned is the same as the default bottom
    // case 'bottom':
    // Bottom going to follow the default behavior
    default:
      setClass(arrowLayer, "introjs-arrow top");

      tooltipLayerStyleLeft = 0;
      checkRight(
        targetOffset,
        tooltipLayerStyleLeft,
        tooltipOffset,
        windowSize,
        tooltipLayer
      );
      tooltipLayer.style.top = `${targetOffset.height + 20}px`;
  }
}
