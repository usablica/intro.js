import { placeTooltip, toPlacement, toPosition } from "./placeTooltip";
import { originOf } from "./floating";
import type { TooltipPosition } from "./tooltipPosition";

const setSize = (element: Element, prop: string, value: unknown) =>
  Object.defineProperty(element, prop, { value, configurable: true });

// jsdom has no layout: give the viewport, the reference layer and the
// tooltip their sizes by hand
const setup = (layer: { left: number; top: number }) => {
  setSize(document.documentElement, "clientWidth", 1000);
  setSize(document.documentElement, "clientHeight", 800);

  const reference = document.createElement("div");
  reference.style.position = "absolute";
  reference.style.left = `${layer.left}px`;
  reference.style.top = `${layer.top}px`;
  reference.style.width = "100px";
  reference.style.height = "40px";

  const tooltip = document.createElement("div");
  const arrow = document.createElement("div");
  tooltip.appendChild(arrow);
  reference.appendChild(tooltip);
  document.body.appendChild(reference);

  setSize(tooltip, "offsetParent", reference);
  setSize(tooltip, "offsetWidth", 300);
  setSize(tooltip, "offsetHeight", 150);
  setSize(arrow, "offsetWidth", 10);
  setSize(arrow, "offsetHeight", 10);

  return { reference, tooltip, arrow };
};

const precedence: TooltipPosition[] = ["bottom", "top", "right", "left"];

describe("placeTooltip", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  test("maps every position to a placement and back", () => {
    const positions: TooltipPosition[] = [
      "top",
      "bottom",
      "left",
      "right",
      "top-middle-aligned",
      "top-right-aligned",
      "bottom-middle-aligned",
      "bottom-right-aligned",
    ];

    positions.forEach((position) => {
      expect(toPosition(toPlacement(position))).toBe(position);
    });

    // left-aligned is the same as the plain side
    expect(toPosition(toPlacement("top-left-aligned"))).toBe("top");
    expect(toPosition(toPlacement("bottom-left-aligned"))).toBe("bottom");
  });

  test("places the tooltip below the reference with a 10px gap", async () => {
    const { reference, tooltip, arrow } = setup({ left: 300, top: 100 });

    const result = await placeTooltip(
      reference,
      tooltip,
      arrow,
      "bottom",
      true,
      precedence
    );

    expect(result.position).toBe("bottom");
    expect(result.x).toBe(0);
    expect(result.y).toBe(50);
    expect(result.arrowX).toBeUndefined();
  });

  test("flips to the top when there is no room below", async () => {
    const { reference, tooltip, arrow } = setup({ left: 300, top: 700 });

    const result = await placeTooltip(
      reference,
      tooltip,
      arrow,
      "bottom",
      true,
      precedence
    );

    expect(result.position).toBe("top");
    expect(result.y).toBe(-160);
  });

  test("keeps the side when autoPosition is false", async () => {
    const { reference, tooltip, arrow } = setup({ left: 300, top: 700 });

    const result = await placeTooltip(
      reference,
      tooltip,
      arrow,
      "bottom",
      false,
      precedence
    );

    expect(result.position).toBe("bottom");
  });

  test("shifts the tooltip into the viewport and moves the arrow to the target", async () => {
    // the reference ends 10px before the right edge of the viewport
    const { reference, tooltip, arrow } = setup({ left: 890, top: 100 });

    const result = await placeTooltip(
      reference,
      tooltip,
      arrow,
      "bottom",
      true,
      precedence
    );

    // stays below instead of flipping to another side
    expect(result.position).toBe("bottom");
    // 10px from the right edge: 890 + x + 300 = 990
    expect(result.x).toBe(-200);
    // the arrow points at the middle of the reference: 200 + 50 - 5
    expect(result.arrowX).toBe(245);
  });

  test("reports the width available on the side of the tooltip", async () => {
    const { reference, tooltip, arrow } = setup({ left: 300, top: 100 });

    const result = await placeTooltip(
      reference,
      tooltip,
      arrow,
      "bottom",
      true,
      precedence
    );

    // the viewport width minus the padding on both sides
    expect(result.availableWidth).toBe(980);
  });
});

describe("originOf", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  test("is the page origin for the document and a static body", () => {
    expect(originOf(document.documentElement)).toEqual({ x: 0, y: 0 });
    expect(originOf(document.body)).toEqual({ x: 0, y: 0 });
    expect(originOf(null)).toEqual({ x: 0, y: 0 });
  });

  test("uses the inline position an element is moving to", () => {
    const layer = document.createElement("div");
    layer.style.position = "absolute";
    layer.style.left = "120px";
    layer.style.top = "40px";
    document.body.appendChild(layer);
    // where a CSS transition currently has it
    layer.getBoundingClientRect = () => new DOMRect(10, 10, 100, 40);

    expect(originOf(layer)).toEqual({ x: 120, y: 40 });
  });

  test("is relative to the viewport for a fixed element", () => {
    const layer = document.createElement("div");
    layer.style.position = "fixed";
    layer.style.left = "5px";
    layer.style.top = "7px";
    document.body.appendChild(layer);

    expect(originOf(layer)).toEqual({ x: 5, y: 7 });
  });

  test("measures elements without an inline position", () => {
    const box = document.createElement("div");
    box.style.position = "relative";
    document.body.appendChild(box);
    box.getBoundingClientRect = () => new DOMRect(30, 60, 100, 40);

    expect(originOf(box)).toEqual({ x: 30, y: 60 });
  });
});
