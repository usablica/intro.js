import getOffset, { Offset } from "../../util/getOffset";
import getWindowSize from "../../util/getWindowSize";
import van, { ChildDom, State } from "../dom/van";
import { arrowClassName, tooltipClassName } from "../tour/classNames";
import { determineAutoPosition, TooltipPosition } from "./tooltipPosition";

const { div } = van.tags;

export const TooltipArrow = (props: {
  tooltipPosition: State<TooltipPosition>;
  tooltipBottomOverflow: State<boolean>;
}) => {
  const classNames = van.derive(() => {
    const classNames = [arrowClassName];

    switch (props.tooltipPosition.val) {
      case "top-right-aligned":
        classNames.push("bottom-right");
        break;

      case "top-middle-aligned":
        classNames.push("bottom-middle");
        break;

      case "top-left-aligned":
      // top-left-aligned is the same as the default top
      case "top":
        classNames.push("bottom");
        break;
      case "right":
        if (props.tooltipBottomOverflow) {
          // In this case, right would have fallen below the bottom of the screen.
          // Modify so that the bottom of the tooltip connects with the target
          classNames.push("left-bottom");
        } else {
          classNames.push("left");
        }
        break;
      case "left":
        if (props.tooltipBottomOverflow) {
          // In this case, left would have fallen below the bottom of the screen.
          // Modify so that the bottom of the tooltip connects with the target
          classNames.push("right-bottom");
        } else {
          classNames.push("right");
        }

        break;
      case "floating":
        // no arrow element for floating tooltips
        break;
      case "bottom-right-aligned":
        classNames.push("top-right");
        break;

      case "bottom-middle-aligned":
        classNames.push("top-middle");
        break;

      // case 'bottom-left-aligned':
      // Bottom-left-aligned is the same as the default bottom
      // case 'bottom':
      // Bottom going to follow the default behavior
      default:
        classNames.push("top");
    }

    return classNames;
  });

  return div({
    className: () => classNames.val?.filter(Boolean).join(" "),
    style: () =>
      `display: ${
        props.tooltipPosition.val === "floating" ? "none" : "block"
      };`,
  });
};

/**
 * Set tooltip right so it doesn't go off the left side of the window
 *
 * @return boolean true, if tooltipLayerStyleRight is ok. false, otherwise.
 */
function checkLeft(
  targetOffset: {
    top: number;
    left: number;
    width: number;
    height: number;
  },
  tooltipLayerStyleRight: number,
  tooltipWidth: number,
  tooltipLeft: State<string>,
  tooltipRight: State<string>
): boolean {
  if (
    targetOffset.left +
      targetOffset.width -
      tooltipLayerStyleRight -
      tooltipWidth <
    0
  ) {
    // off the left side of the window
    tooltipLeft.val = `-${targetOffset.left}px`;
    return false;
  }
  tooltipRight.val = `${tooltipLayerStyleRight}px`;
  return true;
}

/**
 * Set tooltip left so it doesn't go off the right side of the window
 *
 * @return boolean true, if tooltipLayerStyleLeft is ok.  false, otherwise.
 */
function checkRight(
  targetOffset: {
    top: number;
    left: number;
    width: number;
    height: number;
  },
  windowSize: {
    width: number;
    height: number;
  },
  tooltipLayerStyleLeft: number,
  tooltipWidth: number,
  tooltipLeft: State<string>
): boolean {
  if (
    targetOffset.left + tooltipLayerStyleLeft + tooltipWidth >
    windowSize.width
  ) {
    // off the right side of the window
    tooltipLeft.val = `${
      windowSize.width - tooltipWidth - targetOffset.left
    }px`;
    return false;
  }

  tooltipLeft.val = `${tooltipLayerStyleLeft}px`;
  return true;
}

const alignTooltip = (
  position: TooltipPosition,
  targetOffset: { width: number; height: number; left: number; top: number },
  windowSize: { width: number; height: number },
  tooltipWidth: number,
  tooltipHeight: number,
  tooltipTop: State<string>,
  tooltipBottom: State<string>,
  tooltipLeft: State<string>,
  tooltipRight: State<string>,
  tooltipMarginLeft: State<string>,
  tooltipMarginTop: State<string>,
  tooltipBottomOverflow: State<boolean>,
  showStepNumbers: boolean,
  hintMode: boolean
) => {
  tooltipTop.val = "initial";
  tooltipBottom.val = "initial";
  tooltipLeft.val = "initial";
  tooltipRight.val = "initial";
  tooltipMarginLeft.val = "initial";
  tooltipMarginTop.val = "initial";

  let tooltipLayerStyleLeftRight = targetOffset.width / 2 - tooltipWidth / 2;

  switch (position) {
    case "top-right-aligned":
      let tooltipLayerStyleRight = 0;
      checkLeft(
        targetOffset,
        tooltipLayerStyleRight,
        tooltipWidth,
        tooltipLeft,
        tooltipRight
      );
      tooltipBottom.val = `${targetOffset.height + 20}px`;
      break;

    case "top-middle-aligned":
      // a fix for middle aligned hints
      if (hintMode) {
        tooltipLayerStyleLeftRight += 5;
      }

      if (
        checkLeft(
          targetOffset,
          tooltipLayerStyleLeftRight,
          tooltipWidth,
          tooltipLeft,
          tooltipRight
        )
      ) {
        tooltipRight.val = undefined;
        checkRight(
          targetOffset,
          windowSize,
          tooltipLayerStyleLeftRight,
          tooltipWidth,
          tooltipLeft
        );
      }
      tooltipBottom.val = `${targetOffset.height + 20}px`;
      break;

    case "top-left-aligned":
    // top-left-aligned is the same as the default top
    case "top":
      const tooltipLayerStyleLeft = hintMode ? 0 : 15;

      checkRight(
        targetOffset,
        windowSize,
        tooltipLayerStyleLeft,
        tooltipWidth,
        tooltipLeft
      );
      tooltipBottom.val = `${targetOffset.height + 20}px`;
      break;
    case "right":
      tooltipLeft.val = `${targetOffset.width + 20}px`;

      if (tooltipBottomOverflow) {
        // In this case, right would have fallen below the bottom of the screen.
        // Modify so that the bottom of the tooltip connects with the target
        tooltipTop.val = `-${tooltipHeight - targetOffset.height - 20}px`;
      }
      break;
    case "left":
      if (!hintMode && showStepNumbers === true) {
        tooltipTop.val = "15px";
      }

      if (tooltipBottomOverflow) {
        // In this case, left would have fallen below the bottom of the screen.
        // Modify so that the bottom of the tooltip connects with the target
        tooltipTop.val = `-${tooltipHeight - targetOffset.height - 20}px`;
      }
      tooltipRight.val = `${targetOffset.width + 20}px`;

      break;
    case "floating":
      //we have to adjust the top and left of layer manually for intro items without element
      tooltipLeft.val = "50%";
      tooltipTop.val = "50%";
      tooltipMarginLeft.val = `-${tooltipWidth / 2}px`;
      tooltipMarginTop.val = `-${tooltipHeight / 2}px`;

      break;
    case "bottom-right-aligned":
      tooltipLayerStyleRight = 0;
      checkLeft(
        targetOffset,
        tooltipLayerStyleRight,
        tooltipWidth,
        tooltipLeft,
        tooltipRight
      );
      tooltipTop.val = `${targetOffset.height + 20}px`;
      break;

    case "bottom-middle-aligned":
      // a fix for middle aligned hints
      if (hintMode) {
        tooltipLayerStyleLeftRight += 5;
      }

      if (
        checkLeft(
          targetOffset,
          tooltipLayerStyleLeftRight,
          tooltipWidth,
          tooltipLeft,
          tooltipRight
        )
      ) {
        tooltipRight.val = "";
        checkRight(
          targetOffset,
          windowSize,
          tooltipLayerStyleLeftRight,
          tooltipWidth,
          tooltipLeft
        );
      }
      tooltipTop.val = `${targetOffset.height + 20}px`;
      break;

    // case 'bottom-left-aligned':
    // Bottom-left-aligned is the same as the default bottom
    // case 'bottom':
    // Bottom going to follow the default behavior
    default:
      checkRight(targetOffset, windowSize, 0, tooltipWidth, tooltipLeft);
      tooltipTop.val = `${targetOffset.height + 20}px`;
  }
};

export type TooltipProps = {
  position: TooltipPosition;
  element: HTMLElement;
  refreshes: State<number>;
  hintMode: boolean;
  showStepNumbers: boolean;

  transitionDuration?: number;

  // auto-alignment properties
  autoPosition: boolean;
  positionPrecedence: TooltipPosition[];

  onClick?: (e: any) => void;
};

export const Tooltip = (
  {
    position: initialPosition,
    element,
    refreshes,
    hintMode = false,
    showStepNumbers = false,

    transitionDuration = 0,

    // auto-alignment properties
    autoPosition = true,
    positionPrecedence = [],

    onClick,
  }: TooltipProps,
  children?: ChildDom[]
) => {
  const top = van.state<string>("auto");
  const right = van.state<string>("auto");
  const bottom = van.state<string>("auto");
  const left = van.state<string>("auto");
  const marginLeft = van.state<string>("auto");
  const marginTop = van.state<string>("auto");
  const opacity = van.state<number>(0);
  // setting a default height for the tooltip instead of 0 to avoid flickering
  // this default is coming from the CSS class and is overridden after the tooltip is rendered
  const tooltipHeight = van.state<number>(250);
  // max width of the tooltip according to its CSS class
  // this default is coming from the CSS class and is overridden after the tooltip is rendered
  const tooltipWidth = van.state<number>(300);
  const position = van.state<TooltipPosition>(initialPosition);
  // windowSize can change if the window is resized
  const windowSize = van.state(getWindowSize());
  const targetOffset = van.state<Offset>(getOffset(element));
  const tooltipBottomOverflow = van.derive(
    () => targetOffset.val!.top + tooltipHeight.val! > windowSize.val!.height
  );

  van.derive(() => {
    // set the new windowSize and targetOffset if the refreshes signal changes
    if (refreshes.val !== undefined) {
      windowSize.val = getWindowSize();
      targetOffset.val = getOffset(element);
    }
  });

  // auto-align tooltip based on position precedence and target offset
  van.derive(() => {
    if (
      position.val !== undefined &&
      initialPosition !== "floating" &&
      autoPosition &&
      tooltipWidth.val &&
      tooltipHeight.val &&
      targetOffset.val &&
      windowSize.val
    ) {
      position.val = determineAutoPosition(
        positionPrecedence,
        targetOffset.val,
        tooltipWidth.val,
        tooltipHeight.val,
        initialPosition,
        windowSize.val
      );
    }
  });

  // align tooltip based on position and target offset
  van.derive(() => {
    if (
      tooltipWidth.val !== undefined &&
      tooltipHeight.val !== undefined &&
      tooltipBottomOverflow.val !== undefined &&
      position.val !== undefined &&
      targetOffset.val !== undefined &&
      windowSize.val !== undefined
    ) {
      alignTooltip(
        position.val,
        targetOffset.val,
        windowSize.val,
        tooltipWidth.val,
        tooltipHeight.val,
        top,
        bottom,
        left,
        right,
        marginLeft,
        marginTop,
        tooltipBottomOverflow,
        showStepNumbers,
        hintMode
      );
    }
  });

  const tooltip = div(
    {
      style: () =>
        `top: ${top.val}; right: ${right.val}; bottom: ${bottom.val}; left: ${left.val}; margin-left: ${marginLeft.val}; margin-top: ${marginTop.val};opacity: ${opacity.val}`,
      className: () => `${tooltipClassName} introjs-${position.val}`,
      role: "dialog",
      onclick: onClick ?? null,
    },
    [
      TooltipArrow({
        tooltipPosition: position,
        tooltipBottomOverflow: tooltipBottomOverflow,
      }),
      [children],
    ]
  );

  // apply the transition effect
  setTimeout(() => {
    opacity.val = 1;
  }, transitionDuration);

  setTimeout(() => {
    // set the correct height and width of the tooltip after it has been rendered
    tooltipHeight.val = tooltip.offsetHeight;
    tooltipWidth.val = tooltip.offsetWidth;
  }, 1);

  return tooltip;
};
