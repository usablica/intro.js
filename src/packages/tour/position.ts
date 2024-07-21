import { setPositionRelativeTo } from "../../util/setPositionRelativeTo";
import { TourStep } from "./steps";

/**
 * Sets the position of the element relative to the TourStep
 * @api private
 */
export const setPositionRelativeToStep = (
  relativeElement: HTMLElement,
  element: HTMLElement,
  step: TourStep,
  padding: number
) => {
  setPositionRelativeTo(
    relativeElement,
    element,
    step.element as HTMLElement,
    step.position === "floating" ? 0 : padding
  );
};
