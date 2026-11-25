import { arrow, computePosition, flip, offset, shift, size } from "./floating";

type Side = "top" | "bottom" | "left" | "right";
type Placement = Side | `${Side}-start` | `${Side}-end`;
import type { TooltipPosition } from "./tooltipPosition";

// gap between the reference layer (target + helperElementPadding) and the
// tooltip; the 10px arrow fills it
const GAP = 10;
// keep the tooltip this far from the edges of the viewport
const VIEWPORT_PADDING = 10;

export const toPlacement = (position: TooltipPosition): Placement => {
  switch (position) {
    case "top":
    case "top-left-aligned":
      return "top-start";
    case "top-middle-aligned":
      return "top";
    case "top-right-aligned":
      return "top-end";
    case "bottom-middle-aligned":
      return "bottom";
    case "bottom-right-aligned":
      return "bottom-end";
    case "left":
      return "left-start";
    case "right":
      return "right-start";
    default:
      return "bottom-start";
  }
};

export const toPosition = (placement: Placement): TooltipPosition => {
  const [side, alignment] = placement.split("-");

  if (side === "left" || side === "right") return side;
  if (alignment === "start") return side as TooltipPosition;

  return `${side}-${
    alignment === "end" ? "right" : "middle"
  }-aligned` as TooltipPosition;
};

export type PlaceTooltipResult = {
  x: number;
  y: number;
  position: TooltipPosition;
  // set when shift() moved the tooltip, so the arrow has to follow the target
  arrowX?: number;
  arrowY?: number;
  // room for the tooltip on its side, for the CSS max-width
  availableWidth?: number;
};

/**
 * Computes where the tooltip goes next to its reference element. Our own
 * types only, so nothing from @floating-ui leaks into the published .d.ts
 */
export const placeTooltip = (
  reference: HTMLElement,
  tooltip: HTMLElement,
  arrowElement: HTMLElement,
  position: TooltipPosition,
  autoPosition: boolean,
  positionPrecedence: TooltipPosition[]
): Promise<PlaceTooltipResult> => {
  const placement = toPlacement(position);
  const [, alignment] = placement.split("-");
  let available: number | undefined;

  return computePosition(reference, tooltip, {
    placement,
    middleware: [
      offset(GAP),
      autoPosition &&
        flip({
          padding: VIEWPORT_PADDING,
          // only change the side when the tooltip doesn't fit on it;
          // shift() handles overflow along the side
          crossAxis: false,
          // keep the requested alignment on the fallback sides
          fallbackPlacements: positionPrecedence
            .map((p) => p.split("-")[0])
            .map(
              (side) => (alignment ? `${side}-${alignment}` : side) as Placement
            ),
        }),
      shift({ padding: VIEWPORT_PADDING }),
      size({
        padding: VIEWPORT_PADDING,
        apply({ availableWidth, elements }) {
          const floating = elements.floating as HTMLElement;
          // the CSS clamps the width of the content box: themes with
          // box-sizing: content-box add their padding and border to it
          const style = getComputedStyle(floating);
          const extra =
            style.boxSizing === "border-box"
              ? 0
              : [
                  style.paddingLeft,
                  style.paddingRight,
                  style.borderLeftWidth,
                  style.borderRightWidth,
                ].reduce((sum, value) => sum + (parseFloat(value) || 0), 0);

          available = Math.max(0, availableWidth - extra);
          // set it right away, so the tooltip is measured and placed again
          // with its new size; the Tooltip keeps it in its style afterwards
          floating.style.setProperty(
            "--introjs-tooltip-available-width",
            `${available}px`
          );
        },
      }),
      arrow({ element: arrowElement, padding: GAP }),
    ],
  }).then(({ x, y, placement: finalPlacement, middlewareData }) => {
    const shifted =
      !!middlewareData.shift &&
      (middlewareData.shift.x !== 0 || middlewareData.shift.y !== 0);

    return {
      x,
      y,
      position: toPosition(finalPlacement as Placement),
      arrowX: shifted ? middlewareData.arrow?.x : undefined,
      arrowY: shifted ? middlewareData.arrow?.y : undefined,
      availableWidth: available,
    };
  });
};
