import DOMEvent from "../../util/DOMEvent";
import getScrollParent from "../../util/getScrollParent";

export type Placement =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end"
  | "right"
  | "right-start"
  | "right-end"
  | "center";

export type Strategy = "absolute" | "fixed";

export type OffsetOptions = number | { mainAxis?: number; crossAxis?: number };

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
  top: number;
  left: number;
  right: number;
  bottom: number;
};

export type Overflow = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

// ─── Middleware types (floating-ui inspired) ──────────────────────────────────

/** Data stored by the `offset` middleware. */
export type OffsetData = { x: number; y: number };

/** Data stored by the `shift` middleware — how far the tooltip was nudged. */
export type ShiftData = { x: number; y: number };

/** Internal data stored by the `flip` middleware. */
export type FlipData = { skip: boolean };

export type MiddlewareData = {
  offset?: OffsetData;
  shift?: ShiftData;
  flip?: FlipData;
  [key: string]: unknown;
};

export type MiddlewareState = {
  x: number;
  y: number;
  placement: Placement;
  initialPlacement: Placement;
  strategy: Strategy;
  rects: {
    reference: Rect;
    floating: Rect;
    boundary: Rect;
  };
  middlewareData: MiddlewareData;
};

export type MiddlewareReturn = Partial<{
  x: number;
  y: number;
  data: Record<string, unknown>;
  // Return `reset` to restart the middleware pipeline from the beginning,
  // optionally switching to a different placement first (used by flip).
  reset: { placement?: Placement } | boolean;
}>;

export type Middleware = {
  name: string;
  fn: (state: MiddlewareState) => MiddlewareReturn;
};

// ─── computePosition options / result ────────────────────────────────────────

export type ComputePositionOptions = {
  reference: HTMLElement;
  floating: HTMLElement;
  placement?: Placement;
  strategy?: Strategy;
  middleware?: Middleware[];
};

export type ComputePositionResult = {
  x: number;
  y: number;
  // Viewport-relative coords (before CSS conversion) — useful for overflow checks.
  viewport: { x: number; y: number };
  placement: Placement;
  strategy: Strategy;
  rects: {
    reference: Rect;
    floating: Rect;
    boundary: Rect;
  };
  middlewareData: MiddlewareData;
};

export type AutoUpdateOptions = {
  ancestorScroll?: boolean;
  ancestorResize?: boolean;
  elementResize?: boolean;
};

// ─── Internal helpers ─────────────────────────────────────────────────────────

const normalizeOffset = (value?: OffsetOptions) => {
  if (typeof value === "number") return { mainAxis: value, crossAxis: 0 };
  return { mainAxis: value?.mainAxis ?? 0, crossAxis: value?.crossAxis ?? 0 };
};

const toRect = (x: number, y: number, width: number, height: number): Rect => ({
  x,
  y,
  width,
  height,
  top: y,
  left: x,
  right: x + width,
  bottom: y + height,
});

const getScrollOffsets = () => ({
  x: window.pageXOffset || document.documentElement.scrollLeft || 0,
  y: window.pageYOffset || document.documentElement.scrollTop || 0,
});

// Always returns viewport-relative (BCR) coordinates.
const getRect = (element: HTMLElement): Rect => {
  const rect = element.getBoundingClientRect();
  return toRect(rect.left, rect.top, rect.width, rect.height);
};

const getBoundaryRect = (): Rect =>
  toRect(0, 0, window.innerWidth, window.innerHeight);

// Returns the offsetParent rect in PAGE-ABSOLUTE coords (BCR + scroll).
const getOffsetParentRect = (floating: HTMLElement): Rect => {
  const offsetParent = floating.offsetParent as HTMLElement | null;
  if (
    !offsetParent ||
    offsetParent === document.body ||
    offsetParent === document.documentElement
  ) {
    return toRect(0, 0, 0, 0);
  }
  const rect = offsetParent.getBoundingClientRect();
  const scroll = getScrollOffsets();
  return toRect(
    rect.left + scroll.x,
    rect.top + scroll.y,
    rect.width,
    rect.height
  );
};

// Compute placement coords WITHOUT any offset applied.
// All results are viewport-relative (BCR space).
const computeBaseCoords = (
  referenceRect: Rect,
  floatingRect: Rect,
  placement: Placement,
  boundaryRect: Rect
): { x: number; y: number } => {
  if (placement === "center") {
    return {
      x: boundaryRect.x + (boundaryRect.width - floatingRect.width) / 2,
      y: boundaryRect.y + (boundaryRect.height - floatingRect.height) / 2,
    };
  }
  switch (placement) {
    case "top":
      return {
        x: referenceRect.x + (referenceRect.width - floatingRect.width) / 2,
        y: referenceRect.y - floatingRect.height,
      };
    case "top-start":
      return { x: referenceRect.x, y: referenceRect.y - floatingRect.height };
    case "top-end":
      return {
        x: referenceRect.x + referenceRect.width - floatingRect.width,
        y: referenceRect.y - floatingRect.height,
      };
    case "bottom":
      return {
        x: referenceRect.x + (referenceRect.width - floatingRect.width) / 2,
        y: referenceRect.y + referenceRect.height,
      };
    case "bottom-start":
      return { x: referenceRect.x, y: referenceRect.y + referenceRect.height };
    case "bottom-end":
      return {
        x: referenceRect.x + referenceRect.width - floatingRect.width,
        y: referenceRect.y + referenceRect.height,
      };
    case "left":
      return {
        x: referenceRect.x - floatingRect.width,
        y: referenceRect.y + (referenceRect.height - floatingRect.height) / 2,
      };
    case "left-start":
      return { x: referenceRect.x - floatingRect.width, y: referenceRect.y };
    case "left-end":
      return {
        x: referenceRect.x - floatingRect.width,
        y: referenceRect.y + referenceRect.height - floatingRect.height,
      };
    case "right":
      return {
        x: referenceRect.x + referenceRect.width,
        y: referenceRect.y + (referenceRect.height - floatingRect.height) / 2,
      };
    case "right-start":
      return { x: referenceRect.x + referenceRect.width, y: referenceRect.y };
    case "right-end":
      return {
        x: referenceRect.x + referenceRect.width,
        y: referenceRect.y + referenceRect.height - floatingRect.height,
      };
    default:
      return { x: referenceRect.x, y: referenceRect.y };
  }
};

const getOppositePlacement = (placement: Placement): Placement => {
  switch (placement) {
    case "top":
      return "bottom";
    case "top-start":
      return "bottom-start";
    case "top-end":
      return "bottom-end";
    case "bottom":
      return "top";
    case "bottom-start":
      return "top-start";
    case "bottom-end":
      return "top-end";
    case "left":
      return "right";
    case "left-start":
      return "right-start";
    case "left-end":
      return "right-end";
    case "right":
      return "left";
    case "right-start":
      return "left-start";
    case "right-end":
      return "left-end";
    default:
      return placement;
  }
};

const detectOverflow = (
  coords: { x: number; y: number },
  floatingRect: Rect,
  boundaryRect: Rect,
  padding: number
): Overflow => {
  const right =
    coords.x +
    floatingRect.width -
    (boundaryRect.x + boundaryRect.width - padding);
  const bottom =
    coords.y +
    floatingRect.height -
    (boundaryRect.y + boundaryRect.height - padding);
  const left = boundaryRect.x + padding - coords.x;
  const top = boundaryRect.y + padding - coords.y;
  return {
    top: Math.max(0, top),
    right: Math.max(0, right),
    bottom: Math.max(0, bottom),
    left: Math.max(0, left),
  };
};

// Picks the placement with the least overflow from a list of candidates.
// Evaluates using BASE coords (no offset) — offset is applied later by middleware.
const pickBestPlacement = (
  placements: Placement[],
  referenceRect: Rect,
  floatingRect: Rect,
  boundaryRect: Rect,
  padding: number
): Placement => {
  let best = placements[0];
  let bestScore = Infinity;

  for (const p of placements) {
    const coords = computeBaseCoords(
      referenceRect,
      floatingRect,
      p,
      boundaryRect
    );
    const overflow = detectOverflow(
      coords,
      floatingRect,
      boundaryRect,
      padding
    );
    const score =
      overflow.top + overflow.right + overflow.bottom + overflow.left;

    if (score === 0) return p;
    if (score < bestScore) {
      best = p;
      bestScore = score;
    }
  }

  return best;
};

// ─── Middleware factories ─────────────────────────────────────────────────────

/**
 * Translates the floating element along the main and cross axes.
 * Equivalent to floating-ui's `offset` middleware.
 */
export const offset = (value: OffsetOptions = 0): Middleware => ({
  name: "offset",
  fn({ x, y, placement }) {
    if (placement === "center") return {};
    const { mainAxis, crossAxis } = normalizeOffset(value);
    const side = placement.split("-")[0];
    let newX = x;
    let newY = y;
    if (side === "top") {
      newY -= mainAxis;
      newX += crossAxis;
    } else if (side === "bottom") {
      newY += mainAxis;
      newX += crossAxis;
    } else if (side === "left") {
      newX -= mainAxis;
      newY += crossAxis;
    } else if (side === "right") {
      newX += mainAxis;
      newY += crossAxis;
    }
    return { x: newX, y: newY, data: { x: newX - x, y: newY - y } };
  },
});

/**
 * Flips the floating element to the placement with the most available space
 * when the primary placement overflows the boundary.
 * Equivalent to floating-ui's `flip` middleware.
 */
export const flip = (
  options: { fallbackPlacements?: Placement[]; padding?: number } = {}
): Middleware => ({
  name: "flip",
  fn({ placement, rects, middlewareData }) {
    // Guard: already decided in a previous reset pass — don't flip again.
    if (middlewareData.flip?.skip) return {};

    const { fallbackPlacements = [], padding = 0 } = options;
    const opposite = getOppositePlacement(placement);
    const candidates = [
      placement,
      ...fallbackPlacements,
      ...(fallbackPlacements.indexOf(opposite) === -1 ? [opposite] : []),
    ];

    const best = pickBestPlacement(
      candidates,
      rects.reference,
      rects.floating,
      rects.boundary,
      padding
    );

    // Mark as done so the restarted pass skips this middleware.
    const data = { skip: true };
    if (best === placement) return { data };
    return { data, reset: { placement: best } };
  },
});

/**
 * Shifts the floating element along its cross axis to keep it in view.
 * Equivalent to floating-ui's `shift` middleware.
 */
export const shift = (options: { padding?: number } = {}): Middleware => ({
  name: "shift",
  fn({ x, y, placement, rects }) {
    if (placement === "center") return {};
    const { padding = 0 } = options;
    const { boundary, floating } = rects;
    const newX = clamp(
      x,
      boundary.x + padding,
      boundary.x + boundary.width - floating.width - padding
    );
    const newY = clamp(
      y,
      boundary.y + padding,
      boundary.y + boundary.height - floating.height - padding
    );
    return { x: newX, y: newY, data: { x: newX - x, y: newY - y } };
  },
});

// ─── Core ─────────────────────────────────────────────────────────────────────

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/**
 * Computes the position of a floating element relative to a reference element.
 * Inspired by @floating-ui/dom — middleware pipeline, viewport-space internals,
 * CSS conversion at the end.
 */
export const computePosition = ({
  reference,
  floating,
  placement: initialPlacement = "bottom",
  strategy = "absolute",
  middleware = [],
}: ComputePositionOptions): ComputePositionResult => {
  // All rects in viewport-relative (BCR) space.
  const referenceRect = getRect(reference);
  const floatingRect = getRect(floating);
  const boundaryRect = getBoundaryRect();
  const rects = {
    reference: referenceRect,
    floating: floatingRect,
    boundary: boundaryRect,
  };

  let placement: Placement = initialPlacement;
  let { x, y } = computeBaseCoords(
    referenceRect,
    floatingRect,
    placement,
    boundaryRect
  );
  const middlewareData: Record<string, any> = {};

  // Run the middleware pipeline. Each middleware can modify x/y, store data,
  // or signal a `reset` (used by flip to switch placement and restart).
  let i = 0;
  let iterations = 0;
  while (i < middleware.length && iterations++ < 100) {
    const mw = middleware[i];
    const result = mw.fn({
      x,
      y,
      placement,
      initialPlacement,
      strategy,
      rects,
      middlewareData,
    });

    if (result.x != null) x = result.x;
    if (result.y != null) y = result.y;
    if (result.data) {
      middlewareData[mw.name] = {
        ...(middlewareData[mw.name] ?? {}),
        ...result.data,
      };
    }

    if (result.reset) {
      const next =
        typeof result.reset === "object" ? result.reset.placement : undefined;
      if (next && next !== placement) {
        placement = next;
        ({ x, y } = computeBaseCoords(
          referenceRect,
          floatingRect,
          placement,
          boundaryRect
        ));
      }
      i = 0;
      continue;
    }

    i++;
  }

  // Convert viewport-relative coords to CSS coordinates.
  //
  // "fixed"    → viewport coords == CSS coords (no scroll adjustment needed).
  // "absolute" → add scroll so the element follows the page, then subtract the
  //              offsetParent's page-absolute position (CSS left/top is relative
  //              to offsetParent, not the document origin).
  const scroll = getScrollOffsets();
  const offsetParentRect = getOffsetParentRect(floating);

  const cssX = strategy === "fixed" ? x : x + scroll.x - offsetParentRect.x;
  const cssY = strategy === "fixed" ? y : y + scroll.y - offsetParentRect.y;

  return {
    x: cssX,
    y: cssY,
    viewport: { x, y },
    placement,
    strategy,
    rects,
    middlewareData,
  };
};

// ─── autoUpdate ──────────────────────────────────────────────────────────────

export const autoUpdate = (
  reference: HTMLElement,
  floating: HTMLElement,
  update: () => void,
  options: AutoUpdateOptions = {}
) => {
  const {
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = true,
  } = options;

  let frame: number | null = null;
  const schedule = () => {
    if (frame != null) return;
    frame = window.requestAnimationFrame(() => {
      frame = null;
      update();
    });
  };

  const scrollParents = new Set<HTMLElement>();
  if (ancestorScroll) {
    scrollParents.add(getScrollParent(reference));
    scrollParents.add(getScrollParent(floating));
  }

  scrollParents.forEach((parent) => {
    DOMEvent.on(parent, "scroll", schedule, true);
  });

  if (ancestorResize) {
    DOMEvent.on(window, "resize", schedule, true);
  }

  let resizeObserver: ResizeObserver | undefined;
  if (elementResize && typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(() => schedule());
    resizeObserver.observe(reference);
    resizeObserver.observe(floating);
  }

  update();

  return () => {
    scrollParents.forEach((parent) => {
      DOMEvent.off(parent, "scroll", schedule, true);
    });

    if (ancestorResize) {
      DOMEvent.off(window, "resize", schedule, true);
    }

    if (resizeObserver) {
      resizeObserver.disconnect();
    }

    if (frame != null) {
      window.cancelAnimationFrame(frame);
      frame = null;
    }
  };
};
