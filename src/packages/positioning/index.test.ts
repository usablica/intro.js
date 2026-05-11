import {
  clamp,
  computePosition,
  flip,
  offset,
  shift,
  type MiddlewareData,
  type MiddlewareState,
  type Rect,
} from "./index";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const makeRect = (
  x: number,
  y: number,
  width: number,
  height: number
): Rect => ({
  x,
  y,
  width,
  height,
  top: y,
  left: x,
  right: x + width,
  bottom: y + height,
});

/** Builds a MiddlewareState for direct middleware unit tests (no DOM needed). */
const makeState = (
  overrides: Partial<MiddlewareState> & {
    reference?: Rect;
    floating?: Rect;
    boundary?: Rect;
    middlewareData?: MiddlewareData;
  } = {}
): MiddlewareState => ({
  x: overrides.x ?? 0,
  y: overrides.y ?? 0,
  placement: overrides.placement ?? "bottom",
  initialPlacement:
    overrides.initialPlacement ?? overrides.placement ?? "bottom",
  strategy: overrides.strategy ?? "absolute",
  rects: {
    reference: overrides.reference ?? makeRect(100, 100, 80, 40),
    floating: overrides.floating ?? makeRect(0, 0, 200, 100),
    boundary: overrides.boundary ?? makeRect(0, 0, 800, 600),
  },
  middlewareData: overrides.middlewareData ?? {},
});

/** Creates a mock HTMLElement with a given bounding rect. */
const mockEl = (
  x: number,
  y: number,
  width: number,
  height: number
): HTMLElement => {
  const el = document.createElement("div");
  el.getBoundingClientRect = jest.fn(
    () =>
      ({
        x,
        y,
        left: x,
        top: y,
        width,
        height,
        right: x + width,
        bottom: y + height,
        toJSON: jest.fn(),
      } as DOMRect)
  );
  return el;
};

// ─── clamp ────────────────────────────────────────────────────────────────────

describe("clamp", () => {
  it("returns value when within range", () => {
    expect(clamp(50, 0, 100)).toBe(50);
  });

  it("returns min when value is below min", () => {
    expect(clamp(-5, 0, 100)).toBe(0);
  });

  it("returns max when value exceeds max", () => {
    expect(clamp(150, 0, 100)).toBe(100);
  });

  it("returns boundary value when equal to min or max", () => {
    expect(clamp(0, 0, 100)).toBe(0);
    expect(clamp(100, 0, 100)).toBe(100);
  });
});

// ─── offset ───────────────────────────────────────────────────────────────────

describe("offset middleware", () => {
  it("does nothing for center placement", () => {
    const state = makeState({ placement: "center", x: 100, y: 200 });
    const result = offset(20).fn(state);
    expect(result).toEqual({});
  });

  it("subtracts mainAxis from y for top placements", () => {
    const state = makeState({ placement: "top", x: 100, y: 50 });
    const result = offset(20).fn(state);
    expect(result.y).toBe(30);
    expect(result.x).toBe(100);
  });

  it("adds mainAxis to y for bottom placements", () => {
    const state = makeState({ placement: "bottom", x: 100, y: 200 });
    const result = offset(20).fn(state);
    expect(result.y).toBe(220);
    expect(result.x).toBe(100);
  });

  it("subtracts mainAxis from x for left placements", () => {
    const state = makeState({ placement: "left", x: 80, y: 100 });
    const result = offset(20).fn(state);
    expect(result.x).toBe(60);
    expect(result.y).toBe(100);
  });

  it("adds mainAxis to x for right placements", () => {
    const state = makeState({ placement: "right", x: 200, y: 100 });
    const result = offset(20).fn(state);
    expect(result.x).toBe(220);
    expect(result.y).toBe(100);
  });

  it("applies crossAxis perpendicular to main axis (top: shifts x)", () => {
    const state = makeState({ placement: "top", x: 100, y: 50 });
    const result = offset({ mainAxis: 10, crossAxis: 5 }).fn(state);
    expect(result.y).toBe(40);
    expect(result.x).toBe(105);
  });

  it("accepts a plain number and treats it as mainAxis", () => {
    const state = makeState({ placement: "bottom", x: 0, y: 0 });
    const result = offset(15).fn(state);
    expect(result.y).toBe(15);
  });

  it("stores delta in middlewareData.offset", () => {
    const state = makeState({ placement: "bottom", x: 0, y: 0 });
    const result = offset(20).fn(state);
    expect(result.data).toEqual({ x: 0, y: 20 });
  });

  it("works with top-start variant", () => {
    const state = makeState({ placement: "top-start", x: 100, y: 50 });
    const result = offset(10).fn(state);
    expect(result.y).toBe(40);
  });

  it("works with bottom-end variant", () => {
    const state = makeState({ placement: "bottom-end", x: 100, y: 200 });
    const result = offset(10).fn(state);
    expect(result.y).toBe(210);
  });
});

// ─── flip ─────────────────────────────────────────────────────────────────────

describe("flip middleware", () => {
  it("skips when middlewareData.flip.skip is true", () => {
    const state = makeState({
      placement: "top",
      middlewareData: { flip: { skip: true } },
    });
    const result = flip().fn(state);
    expect(result).toEqual({});
  });

  it("keeps placement and marks skip when no overflow", () => {
    // Reference centered in a large viewport, plenty of room on all sides.
    const state = makeState({
      placement: "bottom",
      x: 300,
      y: 200,
      reference: makeRect(300, 200, 80, 40),
      floating: makeRect(0, 0, 100, 50),
      boundary: makeRect(0, 0, 800, 600),
    });
    const result = flip().fn(state);
    expect(result.reset).toBeUndefined();
    expect(result.data).toEqual({ skip: true });
  });

  it("flips to opposite placement when primary side overflows", () => {
    // Reference at very top of viewport: top placement would be off-screen.
    const state = makeState({
      placement: "top",
      reference: makeRect(300, 5, 80, 40),
      floating: makeRect(0, 0, 200, 150),
      boundary: makeRect(0, 0, 800, 600),
    });
    const result = flip().fn(state);
    expect(result.reset).toEqual({ placement: "bottom" });
    expect((result.data as any).skip).toBe(true);
  });

  it("prefers fallbackPlacements over the auto-opposite when fallback fits first", () => {
    // reference at (400, 50, 80, 40), floating 200x80, boundary 800x600
    // "top": y = 50 - 80 = -30 → overflow=30
    // "right": x = 480, y = 50+20-40=30 → no overflow → score=0, returned first
    // "bottom": also score=0, but "right" is evaluated before "bottom"
    const state = makeState({
      placement: "top",
      reference: makeRect(400, 50, 80, 40),
      floating: makeRect(0, 0, 200, 80),
      boundary: makeRect(0, 0, 800, 600),
    });
    const result = flip({ fallbackPlacements: ["right"] }).fn(state);
    expect(result.reset).toEqual({ placement: "right" });
  });

  it("does not duplicate opposite in candidate list when already in fallbackPlacements", () => {
    // If opposite is explicitly in fallbackPlacements, it appears only once.
    const state = makeState({
      placement: "top",
      reference: makeRect(300, 5, 80, 40),
      floating: makeRect(0, 0, 200, 150),
      boundary: makeRect(0, 0, 800, 600),
    });
    // "bottom" is both fallback and opposite — should not cause double evaluation.
    const result = flip({ fallbackPlacements: ["bottom"] }).fn(state);
    expect(result.reset).toEqual({ placement: "bottom" });
  });
});

// ─── shift ────────────────────────────────────────────────────────────────────

describe("shift middleware", () => {
  it("does nothing for center placement", () => {
    const state = makeState({ placement: "center", x: 300, y: 250 });
    const result = shift().fn(state);
    expect(result).toEqual({});
  });

  it("returns zero shift when element is within boundary", () => {
    const state = makeState({
      placement: "bottom",
      x: 100,
      y: 100,
      floating: makeRect(0, 0, 200, 100),
      boundary: makeRect(0, 0, 800, 600),
    });
    const result = shift().fn(state);
    expect(result.x).toBe(100);
    expect(result.y).toBe(100);
    expect(result.data).toEqual({ x: 0, y: 0 });
  });

  it("clamps x when floating overflows right boundary", () => {
    // x=650, floating width=200, boundary width=800 → overflows by 50.
    const state = makeState({
      placement: "bottom",
      x: 650,
      y: 100,
      floating: makeRect(0, 0, 200, 100),
      boundary: makeRect(0, 0, 800, 600),
    });
    const result = shift({ padding: 0 }).fn(state);
    expect(result.x).toBe(600); // 800 - 200
    expect((result.data as any).x).toBe(-50);
  });

  it("clamps x when floating overflows left boundary", () => {
    const state = makeState({
      placement: "bottom",
      x: -30,
      y: 100,
      floating: makeRect(0, 0, 200, 100),
      boundary: makeRect(0, 0, 800, 600),
    });
    const result = shift({ padding: 0 }).fn(state);
    expect(result.x).toBe(0);
    expect((result.data as any).x).toBe(30);
  });

  it("clamps y when floating overflows bottom boundary", () => {
    const state = makeState({
      placement: "bottom",
      x: 100,
      y: 550,
      floating: makeRect(0, 0, 200, 100),
      boundary: makeRect(0, 0, 800, 600),
    });
    const result = shift({ padding: 0 }).fn(state);
    expect(result.y).toBe(500); // 600 - 100
    expect((result.data as any).y).toBe(-50);
  });

  it("clamps y when floating overflows top boundary", () => {
    const state = makeState({
      placement: "top",
      x: 100,
      y: -20,
      floating: makeRect(0, 0, 200, 100),
      boundary: makeRect(0, 0, 800, 600),
    });
    const result = shift({ padding: 0 }).fn(state);
    expect(result.y).toBe(0);
    expect((result.data as any).y).toBe(20);
  });

  it("respects padding option", () => {
    const state = makeState({
      placement: "bottom",
      x: 700,
      y: 100,
      floating: makeRect(0, 0, 200, 100),
      boundary: makeRect(0, 0, 800, 600),
    });
    const result = shift({ padding: 8 }).fn(state);
    // max x = 800 - 200 - 8 = 592
    expect(result.x).toBe(592);
  });
});

// ─── computePosition ──────────────────────────────────────────────────────────

describe("computePosition", () => {
  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", {
      value: 800,
      configurable: true,
    });
    Object.defineProperty(window, "innerHeight", {
      value: 600,
      configurable: true,
    });
  });

  it("places floating below reference for bottom placement", () => {
    // reference: 80x40 at (360, 280) — centered in 800x600 viewport
    const reference = mockEl(360, 280, 80, 40);
    const floating = mockEl(0, 0, 200, 100);

    const result = computePosition({
      reference,
      floating,
      placement: "bottom",
      strategy: "fixed",
    });

    // base x: 360 + 80/2 - 200/2 = 300; base y: 280 + 40 = 320
    expect(result.x).toBe(300);
    expect(result.y).toBe(320);
    expect(result.placement).toBe("bottom");
  });

  it("places floating above reference for top placement", () => {
    const reference = mockEl(360, 280, 80, 40);
    const floating = mockEl(0, 0, 200, 100);

    const result = computePosition({
      reference,
      floating,
      placement: "top",
      strategy: "fixed",
    });

    // base y: 280 - 100 = 180
    expect(result.x).toBe(300);
    expect(result.y).toBe(180);
  });

  it("places floating to the right of reference for right placement", () => {
    const reference = mockEl(200, 200, 80, 40);
    const floating = mockEl(0, 0, 150, 100);

    const result = computePosition({
      reference,
      floating,
      placement: "right",
      strategy: "fixed",
    });

    // x: 200 + 80 = 280; y: 200 + 40/2 - 100/2 = 200 + 20 - 50 = 170
    expect(result.x).toBe(280);
    expect(result.y).toBe(170);
  });

  it("centers floating in viewport for center placement", () => {
    const reference = mockEl(100, 100, 80, 40);
    const floating = mockEl(0, 0, 200, 100);

    const result = computePosition({
      reference,
      floating,
      placement: "center",
      strategy: "fixed",
    });

    // x: (800 - 200) / 2 = 300; y: (600 - 100) / 2 = 250
    expect(result.x).toBe(300);
    expect(result.y).toBe(250);
    expect(result.placement).toBe("center");
  });

  it("applies offset middleware correctly", () => {
    const reference = mockEl(360, 280, 80, 40);
    const floating = mockEl(0, 0, 200, 100);

    const result = computePosition({
      reference,
      floating,
      placement: "bottom",
      strategy: "fixed",
      middleware: [offset(20)],
    });

    // base y: 320, + offset 20 = 340
    expect(result.y).toBe(340);
    expect(result.middlewareData.offset).toEqual({ x: 0, y: 20 });
  });

  it("flip restarts pipeline and offset applies to new placement", () => {
    // Reference at top of viewport — "top" overflows, flip switches to "bottom".
    const reference = mockEl(360, 5, 80, 40);
    const floating = mockEl(0, 0, 200, 150);

    const result = computePosition({
      reference,
      floating,
      placement: "top",
      strategy: "fixed",
      middleware: [offset(20), flip()],
    });

    expect(result.placement).toBe("bottom");
    // base y for bottom: 5 + 40 = 45, + offset 20 = 65
    expect(result.y).toBe(65);
    expect(result.middlewareData.flip).toEqual({ skip: true });
  });

  it("shift keeps tooltip in viewport and stores shift data", () => {
    // Reference near right edge — floating overflows right.
    const reference = mockEl(700, 300, 80, 40);
    const floating = mockEl(0, 0, 200, 100);

    const result = computePosition({
      reference,
      floating,
      placement: "bottom",
      strategy: "fixed",
      middleware: [shift({ padding: 0 })],
    });

    // base x: 700 + 40 - 100 = 640; boundary right: 800; max x = 800 - 200 = 600
    expect(result.x).toBe(600);
    expect((result.middlewareData.shift as any).x).toBe(-40);
  });

  it("returns viewport coords separately from css coords", () => {
    // With fixed strategy, viewport === css.
    const reference = mockEl(360, 280, 80, 40);
    const floating = mockEl(0, 0, 200, 100);

    const result = computePosition({
      reference,
      floating,
      placement: "bottom",
      strategy: "fixed",
    });

    expect(result.viewport).toEqual({ x: result.x, y: result.y });
  });

  it("aggregates middlewareData from multiple middleware", () => {
    const reference = mockEl(360, 280, 80, 40);
    const floating = mockEl(0, 0, 200, 100);

    const result = computePosition({
      reference,
      floating,
      placement: "bottom",
      strategy: "fixed",
      middleware: [offset(20), shift({ padding: 0 })],
    });

    expect(result.middlewareData.offset).toBeDefined();
    expect(result.middlewareData.shift).toBeDefined();
  });

  it("uses absolute strategy: adds scroll and subtracts offsetParent", () => {
    // In jsdom, offsetParent is null → treated as (0,0,0,0).
    // scroll is 0 by default in jsdom.
    const reference = mockEl(360, 280, 80, 40);
    const floating = mockEl(0, 0, 200, 100);
    document.body.appendChild(floating);

    const result = computePosition({
      reference,
      floating,
      placement: "bottom",
      strategy: "absolute",
    });

    // No scroll, no offsetParent → same as viewport coords.
    expect(result.x).toBe(result.viewport.x);
    expect(result.y).toBe(result.viewport.y);

    document.body.removeChild(floating);
  });

  it("returns correct strategy in result", () => {
    const reference = mockEl(100, 100, 80, 40);
    const floating = mockEl(0, 0, 200, 100);

    const fixed = computePosition({
      reference,
      floating,
      placement: "bottom",
      strategy: "fixed",
    });
    expect(fixed.strategy).toBe("fixed");

    const absolute = computePosition({
      reference,
      floating,
      placement: "bottom",
      strategy: "absolute",
    });
    expect(absolute.strategy).toBe("absolute");
  });
});
