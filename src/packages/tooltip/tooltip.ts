import dom, { ChildDom, State } from "../dom";
import { arrowClassName, tooltipClassName } from "../tour/classNames";
import { TooltipPosition } from "./tooltipPosition";
import { placeTooltip } from "./placeTooltip";

const { div } = dom.tags;

export const TooltipArrow = (props: {
  tooltipPosition: State<TooltipPosition>;
  // set when the tooltip was shifted to stay on screen, so the arrow keeps
  // pointing at the target
  arrowX: State<number | undefined>;
  arrowY: State<number | undefined>;
}) => {
  const classNames = dom.derive(() => {
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
        classNames.push("left");
        break;
      case "left":
        classNames.push("right");
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
    style: () => {
      const x = props.arrowX.val;
      const y = props.arrowY.val;
      const display = `display: ${
        props.tooltipPosition.val === "floating" ? "none" : "block"
      };`;

      if (x !== undefined) {
        return `${display} left: ${x}px; right: auto; margin-left: 0;`;
      }
      if (y !== undefined) {
        return `${display} top: ${y}px; bottom: auto;`;
      }
      return display;
    },
  });
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
  className?: string;
  text: string;

  // called once the tooltip has been measured and positioned
  onRendered?: () => void;
};

export const Tooltip = (
  {
    position: initialPosition,
    element: _element,
    refreshes,
    hintMode: _hintMode = false,
    showStepNumbers: _showStepNumbers = false,

    transitionDuration = 0,

    // auto-alignment properties
    positionPrecedence = [],
    className,
    autoPosition = true,
    text,
    onClick,
    onRendered,
  }: TooltipProps,
  children?: ChildDom[]
) => {
  // until it is placed, the tooltip grows up and to the left of the
  // reference layer: overflow on that side never makes the page scrollable
  const top = dom.state<string>("auto");
  const left = dom.state<string>("auto");
  const right = dom.state<string>("0");
  const bottom = dom.state<string>("0");
  const marginLeft = dom.state<string>("0");
  const marginTop = dom.state<string>("0");
  const opacity = dom.state<number>(0);
  const position = dom.state<TooltipPosition>(initialPosition);
  const arrowX = dom.state<number | undefined>(undefined);
  const arrowY = dom.state<number | undefined>(undefined);
  // read by min() in the CSS, so themes keep their own sizes. It is part of
  // the style string, which replaces the whole style attribute on a change
  const availableWidth = dom.state<number | undefined>(undefined);

  const arrowElement = TooltipArrow({
    tooltipPosition: position,
    arrowX,
    arrowY,
  });

  const tooltip = div(
    {
      style: () =>
        `top: ${top.val}; right: ${right.val}; bottom: ${bottom.val}; left: ${
          left.val
        }; margin-left: ${marginLeft.val}; margin-top: ${
          marginTop.val
        };opacity: ${opacity.val};${
          availableWidth.val === undefined
            ? ""
            : `--introjs-tooltip-available-width: ${availableWidth.val}px;`
        }`,
      className: () =>
        `${tooltipClassName} introjs-${position.val} ${className || ""}`,
      role: "dialog",
      "aria-label": text,
      onclick: onClick ?? null,
    },
    [arrowElement, [children]]
  );

  const update = async () => {
    if (initialPosition === "floating") {
      // centered on the screen, there is no target to place it next to
      left.val = "50%";
      top.val = "50%";
      right.val = "auto";
      bottom.val = "auto";
      marginLeft.val = `-${tooltip.offsetWidth / 2}px`;
      marginTop.val = `-${tooltip.offsetHeight / 2}px`;
      return;
    }

    const reference = tooltip.parentElement;
    if (!reference || !tooltip.isConnected) return;

    const result = await placeTooltip(
      reference,
      tooltip,
      arrowElement,
      initialPosition,
      autoPosition,
      positionPrecedence
    );

    position.val = result.position;
    right.val = "auto";
    bottom.val = "auto";
    left.val = `${result.x}px`;
    top.val = `${result.y}px`;
    marginLeft.val = "0";
    marginTop.val = "0";
    arrowX.val = result.arrowX;
    arrowY.val = result.arrowY;
    availableWidth.val = result.availableWidth;
  };

  // the reference layer is moved onto the target in a timeout as well, so
  // wait for it before measuring
  const scheduleUpdate = (done?: () => void) =>
    setTimeout(
      () =>
        setTimeout(async () => {
          await update();
          // the new position is applied by the batched update scheduled by
          // the assignments above; a timeout queued after them runs after it
          setTimeout(() => done?.(), 0);
        }, 0),
      1
    );

  let firstRefresh = true;
  dom.derive(() => {
    if (refreshes.val === undefined) return;
    // the initial render is handled below
    if (firstRefresh) {
      firstRefresh = false;
      return;
    }
    scheduleUpdate();
  });

  // apply the transition effect
  setTimeout(() => {
    opacity.val = 1;
  }, transitionDuration);

  scheduleUpdate(onRendered);

  return tooltip;
};
