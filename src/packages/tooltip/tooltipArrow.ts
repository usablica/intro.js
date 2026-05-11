import { clamp, Placement } from "../positioning";
import dom, { State } from "../dom";
import { arrowClassName } from "../tour/classNames";
import { TooltipPosition } from "./index";

const { div } = dom.tags;

export type TooltipArrowStyles = {
  left?: string;
  top?: string;
};

const isTopPlacement = (p: TooltipPosition | Placement) =>
  p.toString().startsWith("top");
const isBottomPlacement = (p: TooltipPosition | Placement) =>
  p.toString().startsWith("bottom");

// When the tooltip is shifted to stay in viewport, the arrow must move in the
// opposite direction so it keeps pointing at the reference element.
export const computeArrowStyles = (
  placement: TooltipPosition | Placement,
  tooltipPosition: TooltipPosition,
  shift: { x: number; y: number },
  tooltipWidth: number,
  tooltipHeight: number
): TooltipArrowStyles => {
  if (placement === "floating" || placement === "center") return {};

  const arrowPadding = 10;

  if (isTopPlacement(placement) || isBottomPlacement(placement)) {
    // Arrow moves horizontally — only correct when there's horizontal shift.
    if (shift.x === 0) return {};

    // Derive the CSS base left position for this arrow class.
    let cssBaseLeft: number;
    if (
      tooltipPosition === "top-right-aligned" ||
      tooltipPosition === "bottom-right-aligned"
    ) {
      cssBaseLeft = tooltipWidth - 20; // right: 10px → from left
    } else if (
      tooltipPosition === "top-middle-aligned" ||
      tooltipPosition === "bottom-middle-aligned"
    ) {
      cssBaseLeft = tooltipWidth / 2 - 5; // left: 50%, margin-left: -5px
    } else {
      cssBaseLeft = 10; // left: 10px (default for top / bottom / left-aligned)
    }

    const corrected = clamp(
      cssBaseLeft - shift.x,
      arrowPadding,
      tooltipWidth - arrowPadding
    );
    return { left: `${corrected}px` };
  }

  if (placement === "left" || placement === "right") {
    // Tooltip is vertically centered on the reference element by computePosition.
    // Arrow must also be centered: tooltipHeight/2 - 5 (half arrow size).
    // Adjust by -shift.y when the tooltip was pushed out of that ideal position.
    const cssBaseTop = tooltipHeight / 2 - 5;
    const corrected = clamp(
      cssBaseTop - shift.y,
      arrowPadding,
      tooltipHeight - arrowPadding
    );
    return { top: `${corrected}px` };
  }

  return {};
};

export const TooltipArrow = (props: {
  tooltipPosition: State<TooltipPosition>;
  tooltipBottomOverflow: State<boolean>;
  arrowStyles: State<TooltipArrowStyles>;
}) => {
  const classNames = dom.derive(() => {
    const names = [arrowClassName];

    switch (props.tooltipPosition.val) {
      case "top-right-aligned":
        names.push("bottom-right");
        break;
      case "top-middle-aligned":
        names.push("bottom-middle");
        break;
      case "top-left-aligned":
      // top-left-aligned is the same as the default top
      case "top":
        names.push("bottom");
        break;
      case "right":
        names.push(props.tooltipBottomOverflow.val ? "left-bottom" : "left");
        break;
      case "left":
        names.push(props.tooltipBottomOverflow.val ? "right-bottom" : "right");
        break;
      case "floating":
        // no arrow for floating tooltips
        break;
      case "bottom-right-aligned":
        names.push("top-right");
        break;
      case "bottom-middle-aligned":
        names.push("top-middle");
        break;
      // bottom-left-aligned and bottom are the default
      default:
        names.push("top");
    }

    return names;
  });

  return div({
    className: () => classNames.val?.filter(Boolean).join(" "),
    style: () => {
      const styles = props.arrowStyles.val;
      const leftStyle = styles?.left
        ? `left: ${styles.left}; right: auto;`
        : "";
      const topStyle = styles?.top ? `top: ${styles.top}; bottom: auto;` : "";
      return `${leftStyle}${topStyle}display: ${
        props.tooltipPosition.val === "floating" ? "none" : "block"
      };`;
    },
  });
};
