import getOffset from "../util/getOffset";
import getWindowSize from "../util/getWindowSize";
import addClass from "../util/addClass";
import checkRight from "../util/checkRight";
import checkLeft from "../util/checkLeft";
import removeEntry from "../util/removeEntry";
import { Step, TooltipPosition } from "./steps";
import { IntroJs } from "src/intro";

/**
 * auto-determine alignment
 */
function _determineAutoAlignment(
  offsetLeft: number,
  tooltipWidth: number,
  windowWidth: number,
  desiredAlignment: string
): string {
  const halfTooltipWidth = tooltipWidth / 2;
  const winWidth = Math.min(windowWidth, window.screen.width);
  const possibleAlignments = [
    "-left-aligned",
    "-middle-aligned",
    "-right-aligned",
  ];
  let calculatedAlignment = "";

  // valid left must be at least a tooltipWidth
  // away from right side
  if (winWidth - offsetLeft < tooltipWidth) {
    removeEntry(possibleAlignments, "-left-aligned");
  }

  // valid middle must be at least half
  // width away from both sides
  if (
    offsetLeft < halfTooltipWidth ||
    winWidth - offsetLeft < halfTooltipWidth
  ) {
    removeEntry(possibleAlignments, "-middle-aligned");
  }

  // valid right must be at least a tooltipWidth
  // width away from left side
  if (offsetLeft < tooltipWidth) {
    removeEntry(possibleAlignments, "-right-aligned");
  }

  if (possibleAlignments.length) {
    if (possibleAlignments.includes(desiredAlignment)) {
      // the desired alignment is valid
      calculatedAlignment = desiredAlignment;
    } else {
      // pick the first valid position, in order
      calculatedAlignment = possibleAlignments[0];
    }
  } else {
    // if screen width is too small
    // for ANY alignment, middle is
    // probably the best for visibility
    calculatedAlignment = "-middle-aligned";
  }

  return calculatedAlignment;
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
    removeEntry(possiblePositions, "bottom");
  }

  // Check for space above
  if (targetElementRect.top - tooltipHeight < 0) {
    removeEntry(possiblePositions, "top");
  }

  // Check for space to the right
  if (targetElementRect.right + tooltipWidth > windowSize.width) {
    removeEntry(possiblePositions, "right");
  }

  // Check for space to the left
  if (targetElementRect.left - tooltipWidth < 0) {
    removeEntry(possiblePositions, "left");
  }

  // ex: 'right-aligned'
  const desiredAlignment = ((pos) => {
    const hyphenIndex = pos.indexOf("-");
    if (hyphenIndex !== -1) {
      // has alignment
      return pos.substr(hyphenIndex);
    }
    return "";
  })(desiredTooltipPosition || "");

  // strip alignment from position
  if (desiredTooltipPosition) {
    // ex: "bottom-right-aligned"
    // should return 'bottom'
    desiredTooltipPosition = desiredTooltipPosition.split(
      "-"
    )[0] as TooltipPosition;
  }

  if (possiblePositions.length) {
    if (possiblePositions.includes(desiredTooltipPosition)) {
      // If the requested position is in the list, choose that
      calculatedPosition = desiredTooltipPosition;
    } else {
      // Pick the first valid position, in order
      calculatedPosition = possiblePositions[0];
    }
  }

  // only top and bottom positions have optional alignments
  if (["top", "bottom"].includes(calculatedPosition)) {
    calculatedPosition += _determineAutoAlignment(
      targetElementRect.left,
      tooltipWidth,
      windowSize.width,
      desiredAlignment
    );
  }

  return calculatedPosition;
}

/**
 * Render tooltip box in the page
 *
 * @api private
 */
export default function placeTooltip(
  intro: IntroJs,
  targetElement: HTMLElement,
  tooltipLayer: HTMLElement,
  arrowLayer: HTMLElement,
  hintMode: boolean = false
) {
  let tooltipCssClass = "";
  let currentStepObj: Step;
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
  let currentTooltipPosition: TooltipPosition;

  //reset the old style
  tooltipLayer.style.top = null;
  tooltipLayer.style.right = null;
  tooltipLayer.style.bottom = null;
  tooltipLayer.style.left = null;
  tooltipLayer.style.marginLeft = null;
  tooltipLayer.style.marginTop = null;

  arrowLayer.style.display = "inherit";

  // prevent error when `_currentStep` is undefined
  if (!intro._introItems[intro._currentStep]) return;

  //if we have a custom css class for each step
  currentStepObj = intro._introItems[intro._currentStep];
  if (typeof currentStepObj.tooltipClass === "string") {
    tooltipCssClass = currentStepObj.tooltipClass;
  } else {
    tooltipCssClass = intro._options.tooltipClass;
  }

  tooltipLayer.className = ["introjs-tooltip", tooltipCssClass]
    .filter(Boolean)
    .join(" ");

  tooltipLayer.setAttribute("role", "dialog");

  currentTooltipPosition = intro._introItems[intro._currentStep].position;

  // Floating is always valid, no point in calculating
  if (currentTooltipPosition !== "floating" && intro._options.autoPosition) {
    currentTooltipPosition = _determineAutoPosition(
      intro._options.positionPrecedence,
      targetElement,
      tooltipLayer,
      currentTooltipPosition
    );
  }

  let tooltipLayerStyleLeft: number;
  targetOffset = getOffset(targetElement);
  tooltipOffset = getOffset(tooltipLayer);
  windowSize = getWindowSize();

  addClass(tooltipLayer, `introjs-${currentTooltipPosition}`);

  let tooltipLayerStyleLeftRight =
    targetOffset.width / 2 - tooltipOffset.width / 2;

  switch (currentTooltipPosition) {
    case "top-right-aligned":
      arrowLayer.className = "introjs-arrow bottom-right";

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
      arrowLayer.className = "introjs-arrow bottom-middle";

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
        tooltipLayer.style.right = null;
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
      arrowLayer.className = "introjs-arrow bottom";

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
        arrowLayer.className = "introjs-arrow left-bottom";
        tooltipLayer.style.top = `-${
          tooltipOffset.height - targetOffset.height - 20
        }px`;
      } else {
        arrowLayer.className = "introjs-arrow left";
      }
      break;
    case "left":
      if (!hintMode && intro._options.showStepNumbers === true) {
        tooltipLayer.style.top = "15px";
      }

      if (targetOffset.top + tooltipOffset.height > windowSize.height) {
        // In this case, left would have fallen below the bottom of the screen.
        // Modify so that the bottom of the tooltip connects with the target
        tooltipLayer.style.top = `-${
          tooltipOffset.height - targetOffset.height - 20
        }px`;
        arrowLayer.className = "introjs-arrow right-bottom";
      } else {
        arrowLayer.className = "introjs-arrow right";
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
      arrowLayer.className = "introjs-arrow top-right";

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
      arrowLayer.className = "introjs-arrow top-middle";

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
        tooltipLayer.style.right = null;
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
      arrowLayer.className = "introjs-arrow top";

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
