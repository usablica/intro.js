import { style } from "../../../util/style";
import van, { State } from "../../dom/van";
import { helperLayerClassName } from "../classNames";
import { setPositionRelativeToStep } from "../position";
import { TourStep } from "../steps";

const { div } = van.tags;

const getClassName = ({
  step,
  tourHighlightClass,
}: {
  step: State<TourStep | null>;
  tourHighlightClass: string;
}) => {
  let highlightClass = helperLayerClassName;

  // check for a current step highlight class
  if (step.val && typeof step.val.highlightClass === "string") {
    highlightClass += ` ${step.val.highlightClass}`;
  }

  // check for options highlight class
  if (typeof tourHighlightClass === "string") {
    highlightClass += ` ${tourHighlightClass}`;
  }

  return highlightClass;
};

export type HelperLayerProps = {
  currentStep: State<number | undefined>;
  steps: TourStep[];
  targetElement: HTMLElement;
  tourHighlightClass: string;
  overlayOpacity: number;
  helperLayerPadding: number;
};

export const HelperLayer = ({
  currentStep,
  steps,
  targetElement,
  tourHighlightClass,
  overlayOpacity,
  helperLayerPadding,
}: HelperLayerProps) => {
  const step = van.derive(() =>
    currentStep.val !== undefined ? steps[currentStep.val] : null
  );

  const helperLayer = div({
    className: () => getClassName({ step, tourHighlightClass }),
    style: style({
      // the inner box shadow is the border for the highlighted element
      // the outer box shadow is the overlay effect
      "box-shadow": `0 0 1px 2px rgba(33, 33, 33, 0.8), rgba(33, 33, 33, ${overlayOpacity.toString()}) 0 0 0 5000px`,
    }),
  });

  van.derive(() => {
    if (!step.val) return;

    setPositionRelativeToStep(
      targetElement,
      helperLayer,
      step.val,
      helperLayerPadding
    );
  });

  return helperLayer;
};
