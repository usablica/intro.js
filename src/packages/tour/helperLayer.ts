import { style } from "../../util/style";
import van from "../dom/van";
import { helperLayerClassName } from "./classNames";
import { setPositionRelativeToStep } from "./position";
import { TourStep } from "./steps";

const { div } = van.tags;

const getClassName = ({
  step,
  tourHighlightClass,
}: {
  step: TourStep;
  tourHighlightClass: string;
}) => {
  let highlightClass = helperLayerClassName;

  // check for a current step highlight class
  if (typeof step.highlightClass === "string") {
    highlightClass += ` ${step.highlightClass}`;
  }

  // check for options highlight class
  if (typeof tourHighlightClass === "string") {
    highlightClass += ` ${tourHighlightClass}`;
  }

  return highlightClass;
};

export type HelperLayerProps = {
  step: TourStep;
  targetElement: HTMLElement;
  tourHighlightClass: string;
  overlayOpacity: number;
  helperLayerPadding: number;
};

export const HelperLayer = ({
  step,
  targetElement,
  tourHighlightClass,
  overlayOpacity,
  helperLayerPadding,
}: HelperLayerProps) => {
  if (!step) {
    return null;
  }

  const className = getClassName({ step: step, tourHighlightClass });

  const helperLayer = div({
    className,
    style: style({
      // the inner box shadow is the border for the highlighted element
      // the outer box shadow is the overlay effect
      "box-shadow": `0 0 1px 2px rgba(33, 33, 33, 0.8), rgba(33, 33, 33, ${overlayOpacity.toString()}) 0 0 0 5000px`,
    }),
  });

  setPositionRelativeToStep(
    targetElement,
    helperLayer,
    step,
    helperLayerPadding
  );

  return helperLayer;
};
