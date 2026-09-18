import { style } from "../../../util/style";
import dom, { State } from "../../dom";
import { helperLayerClassName } from "../classNames";
import { setPositionRelativeToStep } from "../position";
import { TourStep } from "../steps";

const { div } = dom.tags;

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
  refreshes: State<number>;
  targetElement: HTMLElement;
  tourHighlightClass: string;
  overlayOpacity: number;
  helperLayerPadding: number;
};

export const HelperLayer = ({
  currentStep,
  steps,
  refreshes,
  targetElement,
  tourHighlightClass,
  overlayOpacity,
  helperLayerPadding,
}: HelperLayerProps) => {
  const step = dom.derive(() =>
    currentStep.val !== undefined ? steps[currentStep.val] : null
  );

  const helperLayer = div({
    className: () => getClassName({ step, tourHighlightClass }),
    style: style({
      // the inner box shadow is the border for the highlighted element
      // the outer box shadow is the overlay effect
      //
      // the inner shadow's 3px spread (rather than 2px) is deliberate: this
      // layer sits at the exact same position/size as the highlighted
      // element when helperElementPadding is 0, and a 2px spread put its
      // inner edge exactly flush against that element's own border, which
      // visibly ate into the border's color on two sides (a rendering
      // artifact, not a z-index bug - the element and this layer's edges
      // land on the same pixels either way) - see #1702. The extra 1px
      // gives the shadow room to start just outside the border instead of
      // right on top of it; at any non-zero padding it's imperceptible.
      "box-shadow": `0 0 1px 3px rgba(33, 33, 33, 0.8), rgba(33, 33, 33, ${overlayOpacity.toString()}) 0 0 0 5000px`,
    }),
  });

  dom.derive(() => {
    // set the new position if the step or refreshes change
    if (!step.val || refreshes.val === undefined) return;

    setPositionRelativeToStep(
      targetElement,
      helperLayer,
      step.val,
      helperLayerPadding
    );
  });

  return helperLayer;
};
