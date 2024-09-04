import van, { State } from "../dom/van";
import { disableInteractionClassName } from "./classNames";
import { setPositionRelativeToStep } from "./position";
import { TourStep } from "./steps";

const { div } = van.tags;

export type HelperLayerProps = {
  currentStep: State<number>;
  steps: TourStep[];
  targetElement: HTMLElement;
  helperElementPadding: number;
};

export const DisableInteraction = ({
  currentStep,
  steps,
  targetElement,
  helperElementPadding,
}: HelperLayerProps) => {
  const step = van.derive(() =>
    currentStep.val !== undefined ? steps[currentStep.val] : null
  );

  return () => {
    if (!step.val) {
      return null;
    }

    const disableInteraction = div({
      className: disableInteractionClassName,
    });

    setPositionRelativeToStep(
      targetElement,
      disableInteraction,
      step.val,
      helperElementPadding
    );

    return disableInteraction;
  };
};
