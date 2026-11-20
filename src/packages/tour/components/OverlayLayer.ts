import { style } from "../../../util/style";
import { overlayClassName } from "../classNames";
import dom from "../../dom";
import { Tour } from "../tour";

const { div } = dom.tags;

export type OverlayLayerProps = {
  exitOnOverlayClick: boolean;
  onExitTour: () => Promise<Tour>;
  /* returns true when a click at these viewport coordinates lands on the
     highlighted area (the target and its padding), which is not overlay */
  isInHighlight?: (x: number, y: number) => boolean;
};

export const OverlayLayer = ({
  exitOnOverlayClick,
  onExitTour,
  isInHighlight,
}: OverlayLayerProps) => {
  const overlayLayer = div({
    className: overlayClassName,
    style: style({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      position: "fixed",
      cursor: exitOnOverlayClick ? "pointer" : "auto",
      // the hole cut for the target (see setOverlayHole) must follow it
      // right away when the page scrolls, not animate
      transition: "opacity 0.3s ease-out",
    }),
  });

  if (exitOnOverlayClick) {
    overlayLayer.onclick = async (e: MouseEvent) => {
      // a click on the padding around the target is not an overlay click
      if (isInHighlight?.(e.clientX, e.clientY)) return;

      await onExitTour();
    };
  }

  return overlayLayer;
};

/**
 * Cut a hole in the overlay where the target element is, so the target stays
 * clickable even when it sits inside a parent with its own stacking context
 * (z-index, transform, filter, opacity...), where its own z-index can't lift
 * it above the tour layers. Clears the hole when there is no visible target.
 *
 * The overlay is `position: fixed`, so the hole uses viewport coordinates and
 * has to be updated when the page scrolls or resizes.
 */
export const setOverlayHole = (
  overlayLayer: HTMLElement,
  target: Element | null | undefined
) => {
  const rect = target?.getBoundingClientRect();

  if (!rect || rect.width === 0 || rect.height === 0) {
    overlayLayer.style.clipPath = "";
    return;
  }

  const l = `${rect.left}px`;
  const t = `${rect.top}px`;
  const r = `${rect.right}px`;
  const b = `${rect.bottom}px`;

  // the whole viewport, with a slit from the bottom edge into a rectangle
  // around the target that is traced the other way round, so it is left out
  overlayLayer.style.clipPath =
    `polygon(0 0, 0 100%, ${l} 100%, ${l} ${t}, ${r} ${t}, ` +
    `${r} ${b}, ${l} ${b}, ${l} 100%, 100% 100%, 100% 0)`;
};
