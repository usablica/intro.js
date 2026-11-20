import { OverlayLayer, setOverlayHole } from "./OverlayLayer";
import { Tour } from "../tour";

const rect = (left: number, top: number, width: number, height: number) =>
  ({
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
  } as DOMRect);

describe("OverlayLayer", () => {
  describe("setOverlayHole", () => {
    test("cuts a hole around the target in viewport coordinates", () => {
      // Arrange
      const overlay = document.createElement("div");
      const target = document.createElement("button");
      target.getBoundingClientRect = () => rect(10, 20, 100, 30);

      // Act
      setOverlayHole(overlay, target);

      // Assert
      expect(overlay.style.clipPath).toBe(
        "polygon(0 0, 0 100%, 10px 100%, 10px 20px, 110px 20px, " +
          "110px 50px, 10px 50px, 10px 100%, 100% 100%, 100% 0)"
      );
    });

    test("removes the hole when there is no target", () => {
      // Arrange
      const overlay = document.createElement("div");
      overlay.style.clipPath = "polygon(0 0, 100% 0, 100% 100%)";

      // Act
      setOverlayHole(overlay, undefined);

      // Assert
      expect(overlay.style.clipPath).toBe("");
    });

    test("removes the hole when the target has no size (floating steps)", () => {
      // Arrange
      const overlay = document.createElement("div");
      const target = document.createElement("div");
      target.getBoundingClientRect = () => rect(300, 200, 0, 0);

      // Act
      setOverlayHole(overlay, target);

      // Assert
      expect(overlay.style.clipPath).toBe("");
    });
  });

  describe("click", () => {
    const click = (overlay: HTMLElement) =>
      (overlay.onclick as (e: Partial<MouseEvent>) => Promise<void>)({
        clientX: 5,
        clientY: 5,
      });

    test("exits the tour on a click outside the highlighted area", async () => {
      // Arrange
      const onExitTour = jest.fn(async () => ({} as Tour));
      const overlay = OverlayLayer({
        exitOnOverlayClick: true,
        onExitTour,
        isInHighlight: () => false,
      });

      // Act
      await click(overlay);

      // Assert
      expect(onExitTour).toBeCalledTimes(1);
    });

    test("does not exit the tour on a click on the highlight padding", async () => {
      // Arrange
      const onExitTour = jest.fn(async () => ({} as Tour));
      const overlay = OverlayLayer({
        exitOnOverlayClick: true,
        onExitTour,
        isInHighlight: () => true,
      });

      // Act
      await click(overlay);

      // Assert
      expect(onExitTour).not.toBeCalled();
    });
  });
});
