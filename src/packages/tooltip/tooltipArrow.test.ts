import { computeArrowStyles } from "./tooltipArrow";

// ─── computeArrowStyles ───────────────────────────────────────────────────────

describe("computeArrowStyles", () => {
  const noShift = { x: 0, y: 0 };

  // ── Passthrough cases ────────────────────────────────────────────────────────

  it("returns empty object for floating placement", () => {
    expect(
      computeArrowStyles("floating", "floating", noShift, 300, 200)
    ).toEqual({});
  });

  it("returns empty object for center placement", () => {
    expect(computeArrowStyles("center", "floating", noShift, 300, 200)).toEqual(
      {}
    );
  });

  it("returns empty object for top placement when shift.x is zero", () => {
    expect(
      computeArrowStyles("top-start", "top-left-aligned", noShift, 300, 200)
    ).toEqual({});
  });

  it("returns empty object for bottom placement when shift.x is zero", () => {
    expect(
      computeArrowStyles(
        "bottom-start",
        "bottom-left-aligned",
        noShift,
        300,
        200
      )
    ).toEqual({});
  });

  // ── Top/bottom horizontal correction ────────────────────────────────────────

  it("corrects arrow left for top-start / top-left-aligned when shifted right", () => {
    // shift.x = 30 means tooltip moved 30px right → arrow must move 30px left.
    // cssBaseLeft = 10 (default); corrected = clamp(10 - 30, 10, 290) = 10 (clamped)
    const result = computeArrowStyles(
      "top-start",
      "top-left-aligned",
      { x: 30, y: 0 },
      300,
      200
    );
    expect(result).toEqual({ left: "10px" });
  });

  it("corrects arrow left for top-start / top-left-aligned when shifted left", () => {
    // shift.x = -30 means tooltip moved 30px left → arrow moves 30px right.
    // corrected = clamp(10 - (-30), 10, 290) = clamp(40, 10, 290) = 40
    const result = computeArrowStyles(
      "top-start",
      "top-left-aligned",
      { x: -30, y: 0 },
      300,
      200
    );
    expect(result).toEqual({ left: "40px" });
  });

  it("corrects arrow left for top / top-middle-aligned", () => {
    // cssBaseLeft = 300/2 - 5 = 145; shift.x = 20
    // corrected = clamp(145 - 20, 10, 290) = 125
    const result = computeArrowStyles(
      "top",
      "top-middle-aligned",
      { x: 20, y: 0 },
      300,
      200
    );
    expect(result).toEqual({ left: "125px" });
  });

  it("corrects arrow left for top-end / top-right-aligned", () => {
    // cssBaseLeft = 300 - 20 = 280; shift.x = 20
    // corrected = clamp(280 - 20, 10, 290) = 260
    const result = computeArrowStyles(
      "top-end",
      "top-right-aligned",
      { x: 20, y: 0 },
      300,
      200
    );
    expect(result).toEqual({ left: "260px" });
  });

  it("corrects arrow for bottom-start / bottom-left-aligned", () => {
    // cssBaseLeft = 10; shift.x = -15
    // corrected = clamp(10 + 15, 10, 290) = 25
    const result = computeArrowStyles(
      "bottom-start",
      "bottom-left-aligned",
      { x: -15, y: 0 },
      300,
      200
    );
    expect(result).toEqual({ left: "25px" });
  });

  it("corrects arrow for bottom / bottom-middle-aligned", () => {
    // cssBaseLeft = 300/2 - 5 = 145; shift.x = -10
    // corrected = clamp(145 + 10, 10, 290) = 155
    const result = computeArrowStyles(
      "bottom",
      "bottom-middle-aligned",
      { x: -10, y: 0 },
      300,
      200
    );
    expect(result).toEqual({ left: "155px" });
  });

  it("clamps arrow left to arrowPadding minimum", () => {
    // cssBaseLeft = 10; shift.x = 200 (very large → corrected would be -190, clamped to 10)
    const result = computeArrowStyles(
      "top-start",
      "top-left-aligned",
      { x: 200, y: 0 },
      300,
      200
    );
    expect(result).toEqual({ left: "10px" });
  });

  it("clamps arrow left to tooltipWidth - arrowPadding maximum", () => {
    // cssBaseLeft = 10; shift.x = -500 → corrected = 510, clamped to 300 - 10 = 290
    const result = computeArrowStyles(
      "top-start",
      "top-left-aligned",
      { x: -500, y: 0 },
      300,
      200
    );
    expect(result).toEqual({ left: "290px" });
  });

  // ── Left/right vertical correction ──────────────────────────────────────────

  it("returns centered arrow top for right placement with no shift", () => {
    // cssBaseTop = 200/2 - 5 = 95; shift.y = 0 → corrected = clamp(95, 10, 190) = 95
    const result = computeArrowStyles("right", "right", noShift, 300, 200);
    expect(result).toEqual({ top: "95px" });
  });

  it("returns centered arrow top for left placement with no shift", () => {
    const result = computeArrowStyles("left", "left", noShift, 300, 200);
    expect(result).toEqual({ top: "95px" });
  });

  it("corrects arrow top for right placement when shifted down", () => {
    // shift.y = 30 → tooltip moved 30px down → arrow moves up
    // corrected = clamp(95 - 30, 10, 190) = 65
    const result = computeArrowStyles(
      "right",
      "right",
      { x: 0, y: 30 },
      300,
      200
    );
    expect(result).toEqual({ top: "65px" });
  });

  it("corrects arrow top for left placement when shifted up", () => {
    // shift.y = -30 → tooltip moved 30px up → arrow moves down
    // corrected = clamp(95 - (-30), 10, 190) = 125
    const result = computeArrowStyles(
      "left",
      "left",
      { x: 0, y: -30 },
      300,
      200
    );
    expect(result).toEqual({ top: "125px" });
  });

  it("clamps arrow top to arrowPadding minimum for left/right", () => {
    // shift.y = 200 → corrected = clamp(95 - 200, 10, 190) = clamp(-105, 10, 190) = 10
    const result = computeArrowStyles(
      "right",
      "right",
      { x: 0, y: 200 },
      300,
      200
    );
    expect(result).toEqual({ top: "10px" });
  });

  it("clamps arrow top to tooltipHeight - arrowPadding maximum for left/right", () => {
    // shift.y = -200 → corrected = clamp(95 + 200, 10, 190) = 190
    const result = computeArrowStyles(
      "right",
      "right",
      { x: 0, y: -200 },
      300,
      200
    );
    expect(result).toEqual({ top: "190px" });
  });
});
