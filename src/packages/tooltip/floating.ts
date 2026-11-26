/**
 * The only module that imports Floating UI. We use its platform-agnostic
 * core (bundled into intro.js at build time, so users install nothing) with
 * a small DOM platform of our own, see `platform` below.
 */
import { computePosition as coreComputePosition } from "@floating-ui/core";
import type {
  ComputePositionConfig,
  Coords,
  Platform,
  Rect,
} from "@floating-ui/core";

export { arrow, flip, offset, shift, size } from "@floating-ui/core";

const px = (value: string) =>
  value.endsWith("px") ? parseFloat(value) : Number.NaN;

const isFixed = (element: Element) =>
  getComputedStyle(element).position === "fixed";

/**
 * Where the (0, 0) of an element's padding box is, in viewport coordinates:
 * the origin of the coordinates of its absolutely positioned children.
 *
 * The reference layers of intro.js slide to a new target with a CSS
 * transition. For an element with an inline left and top in px (as
 * setPositionRelativeTo() sets them) this is where it is going, not where
 * the transition currently has it, so the tooltip doesn't have to wait for
 * the transition and moves along with the layer.
 */
export const originOf = (element: Element | null): Coords => {
  // "0 -" so that no scroll gives 0, not -0
  const page = { x: 0 - window.scrollX, y: 0 - window.scrollY };

  if (
    !element ||
    element === document.documentElement ||
    (element === document.body &&
      getComputedStyle(element).position === "static")
  ) {
    return page;
  }

  const el = element as HTMLElement;
  const left = px(el.style.left);
  const top = px(el.style.top);

  if (!Number.isNaN(left) && !Number.isNaN(top)) {
    const parent = isFixed(el) ? { x: 0, y: 0 } : originOf(el.offsetParent);
    return {
      x: parent.x + left + el.clientLeft,
      y: parent.y + top + el.clientTop,
    };
  }

  const rect = el.getBoundingClientRect();
  return {
    x: rect.left + el.clientLeft - el.scrollLeft,
    y: rect.top + el.clientTop - el.scrollTop,
  };
};

const sizeOf = (element: HTMLElement) => {
  // like left and top, an inline size in px is the one it is going to
  const width = px(element.style.width);
  const height = px(element.style.height);

  return {
    width: Number.isNaN(width) ? element.offsetWidth : width,
    height: Number.isNaN(height) ? element.offsetHeight : height,
  };
};

const platform: Platform = {
  // the reference, in the coordinates of the floating element's offset parent
  getElementRects: ({ reference, floating }) => {
    const ref = reference as HTMLElement;
    const float = floating as HTMLElement;
    const offsetParent = float.offsetParent;
    let referenceRect: Rect;

    if (offsetParent === ref) {
      // the tooltip is a child of its reference layer
      referenceRect = { x: -ref.clientLeft, y: -ref.clientTop, ...sizeOf(ref) };
    } else {
      const rect = ref.getBoundingClientRect();
      const origin = originOf(offsetParent);
      referenceRect = {
        x: rect.left - origin.x,
        y: rect.top - origin.y,
        width: rect.width,
        height: rect.height,
      };
    }

    return {
      reference: referenceRect,
      floating: {
        x: 0,
        y: 0,
        width: float.offsetWidth,
        height: float.offsetHeight,
      },
    };
  },

  // only the viewport: the tooltip lives in a layer of its own under the
  // target element of the tour (usually body), not in a scroll container.
  // On mobile, a page wider than the screen is panned inside the layout
  // viewport, so the part the user sees is the visual viewport
  getClippingRect: () => {
    const viewport = window.visualViewport;
    if (viewport) {
      return {
        x: viewport.offsetLeft,
        y: viewport.offsetTop,
        width: viewport.width,
        height: viewport.height,
      };
    }

    return {
      x: 0,
      y: 0,
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    };
  },

  getDimensions: (element) => ({
    width: (element as HTMLElement).offsetWidth,
    height: (element as HTMLElement).offsetHeight,
  }),

  convertOffsetParentRelativeRectToViewportRelativeRect: ({
    rect,
    offsetParent,
  }) => {
    const origin = originOf(offsetParent as Element);
    return { ...rect, x: rect.x + origin.x, y: rect.y + origin.y };
  },

  getOffsetParent: (element) => (element as HTMLElement).offsetParent,
  isElement: (value) => value instanceof Element,
  getDocumentElement: () => document.documentElement,
};

export const computePosition = (
  reference: HTMLElement,
  floating: HTMLElement,
  options: Partial<ComputePositionConfig>
) => coreComputePosition(reference, floating, { ...options, platform });
