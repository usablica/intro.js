import isFixed from "../../util/isFixed";
import dom, { ChildDom, State } from "../dom";
import { tooltipClassName } from "../tour/classNames";
import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
  Placement,
} from "../positioning";
import { TooltipPosition } from "./index";
import {
  computeArrowStyles,
  TooltipArrow,
  type TooltipArrowStyles,
} from "./tooltipArrow";

export type { TooltipArrowStyles } from "./tooltipArrow";

const { div } = dom.tags;

// Maps project-specific position names to generic Placement values.
const resolveTooltipPlacement = (
  placement: TooltipPosition,
  allowCenter = true
): Placement => {
  switch (placement) {
    case "top":
    case "top-left-aligned":
      return "top-start";
    case "top-middle-aligned":
      return "top";
    case "top-right-aligned":
      return "top-end";
    case "bottom":
    case "bottom-left-aligned":
      return "bottom-start";
    case "bottom-middle-aligned":
      return "bottom";
    case "bottom-right-aligned":
      return "bottom-end";
    case "left":
      return "left";
    case "right":
      return "right";
    case "floating":
      return allowCenter ? "center" : "bottom";
    default:
      return "bottom";
  }
};

// Preferred fallback placements to try when the primary one overflows.
const fallbackPlacementsFor = (placement: TooltipPosition): Placement[] => {
  switch (placement) {
    case "top":
    case "top-left-aligned":
      return ["top", "top-end"];
    case "top-middle-aligned":
      return ["top-start", "top-end"];
    case "top-right-aligned":
      return ["top", "top-start"];
    case "bottom":
    case "bottom-left-aligned":
      return ["bottom", "bottom-end"];
    case "bottom-middle-aligned":
      return ["bottom-start", "bottom-end"];
    case "bottom-right-aligned":
      return ["bottom", "bottom-start"];
    case "left":
      return ["left-start", "left-end"];
    case "right":
      return ["right-start", "right-end"];
    default:
      return [];
  }
};

export type TooltipProps = {
  position: TooltipPosition;
  element: HTMLElement;
  refreshes: State<number>;
  hintMode: boolean;
  showStepNumbers: boolean;
  autoUpdateOnScroll?: boolean;

  transitionDuration?: number;

  // auto-alignment properties
  autoPosition: boolean;
  positionPrecedence: TooltipPosition[];

  onClick?: (e: any) => void;
  className?: string;
  text: string;
};

export const Tooltip = (
  {
    position: initialPosition,
    element,
    refreshes,
    hintMode = false,
    showStepNumbers: _showStepNumbers = false,
    autoUpdateOnScroll = true,

    transitionDuration = 0,

    // auto-alignment properties
    positionPrecedence = [],
    className,
    autoPosition = true,
    text,
    onClick,
  }: TooltipProps,
  children?: ChildDom[]
) => {
  const top = dom.state<string>("auto");
  const left = dom.state<string>("auto");
  const opacity = dom.state<number>(0);
  // Default dimensions from CSS — overridden once the element is rendered.
  const tooltipHeight = dom.state<number>(250);
  const tooltipWidth = dom.state<number>(300);
  const position = dom.state<TooltipPosition>(initialPosition);
  const arrowStyles = dom.state<TooltipArrowStyles>({});
  const tooltipBottomOverflow = dom.state<boolean>(false);
  // Inline position keeps fixed-anchor tooltips correct regardless of offsetParent.
  // Floating tooltips use "absolute" so they appear only once in fullPage screenshots
  // (position: fixed duplicates in every stitched viewport segment).
  const positioningStrategy = dom.state<"fixed" | "absolute">(
    isFixed(element) ? "fixed" : "absolute"
  );

  let cleanupAutoUpdate: (() => void) | null = null;

  const updateTooltipPosition = () => {
    if (!tooltip || !tooltip.isConnected) return;

    let desiredPlacement = resolveTooltipPlacement(initialPosition);
    let fallbackPlacements = fallbackPlacementsFor(initialPosition);

    // Floating steps must always use "center" placement — positionPrecedence
    // is irrelevant because there is no real reference element to anchor to.
    if (
      autoPosition &&
      positionPrecedence.length &&
      initialPosition !== "floating"
    ) {
      const mappedPlacements = positionPrecedence
        .map((p) => resolveTooltipPlacement(p, false))
        .filter((p) => p !== "center");
      if (mappedPlacements.length) {
        desiredPlacement = mappedPlacements[0];
        fallbackPlacements = mappedPlacements.slice(1);
      }
    }

    // Elements with a CSS fixed ancestor need fixed positioning so coordinates
    // are viewport-relative. All other cases (including floating/centered steps)
    // use absolute so the tooltip is document-positioned and scroll-aware.
    const strategy = isFixed(element) ? "fixed" : "absolute";

    const result = computePosition({
      reference: element,
      floating: tooltip,
      placement: desiredPlacement,
      strategy,
      middleware: [
        offset({ mainAxis: 20, crossAxis: hintMode ? 5 : 0 }),
        ...(autoPosition ? [flip({ fallbackPlacements, padding: 8 })] : []),
        shift({ padding: 8 }),
      ],
    });

    // Map resolved Placement back to TooltipPosition for CSS class + arrow logic.
    const placementToPosition: Record<Placement, TooltipPosition> = {
      top: "top-middle-aligned",
      "top-start": "top-left-aligned",
      "top-end": "top-right-aligned",
      bottom: "bottom-middle-aligned",
      "bottom-start": "bottom-left-aligned",
      "bottom-end": "bottom-right-aligned",
      left: "left",
      "left-start": "left",
      "left-end": "left",
      right: "right",
      "right-start": "right",
      "right-end": "right",
      center: "floating",
    };

    position.val = autoPosition
      ? placementToPosition[result.placement] ?? initialPosition
      : initialPosition;

    positioningStrategy.val = strategy;
    top.val = `${result.y}px`;
    left.val = `${result.x}px`;

    const resolvedHeight = tooltipHeight.val ?? tooltip.offsetHeight;
    const resolvedWidth = tooltipWidth.val ?? tooltip.offsetWidth;

    // result.viewport.y is always viewport-relative regardless of strategy,
    // so this check is correct without any scroll or offsetParent adjustment.
    tooltipBottomOverflow.val =
      result.viewport.y + resolvedHeight > window.innerHeight;

    arrowStyles.val = computeArrowStyles(
      result.placement,
      position.val,
      result.middlewareData.shift ?? { x: 0, y: 0 },
      resolvedWidth,
      resolvedHeight
    );
  };

  const tooltip = div(
    {
      style: () =>
        `position: ${positioningStrategy.val}; top: ${top.val}; right: auto; bottom: auto; left: ${left.val}; margin: 0; opacity: ${opacity.val}`,
      className: () =>
        `${tooltipClassName} introjs-${position.val} ${className || ""}`,
      role: "dialog",
      "aria-label": text,
      onclick: onClick ?? null,
    },
    [
      TooltipArrow({
        tooltipPosition: position,
        tooltipBottomOverflow,
        arrowStyles,
      }),
      [children],
    ]
  );

  if (autoUpdateOnScroll) {
    cleanupAutoUpdate = autoUpdate(element, tooltip, updateTooltipPosition, {
      ancestorScroll: true,
      ancestorResize: true,
      elementResize: true,
    });

    // autoUpdate has no lifecycle hook — poll until the tooltip leaves the DOM.
    const cleanupInterval = window.setInterval(() => {
      if (!tooltip.isConnected) {
        cleanupAutoUpdate?.();
        cleanupAutoUpdate = null;
        window.clearInterval(cleanupInterval);
      }
    }, 250);
  }

  // Fade in.
  setTimeout(() => {
    opacity.val = 1;
  }, transitionDuration);

  // Measure real dimensions after first render, then recompute position.
  setTimeout(() => {
    tooltipHeight.val = tooltip.offsetHeight;
    tooltipWidth.val = tooltip.offsetWidth;
    updateTooltipPosition();
  }, 1);

  dom.derive(() => {
    // Recompute when the parent signals a refresh (step change, manual refresh).
    if (refreshes.val !== undefined) {
      updateTooltipPosition();
    }
  });

  return tooltip;
};
