import van, { State } from "../../dom/van";
import { disableInteractionClassName } from "../classNames";
import { setPositionRelativeToStep } from "../position";
import { TourStep } from "../steps";

const { div } = van.tags;

export type HelperLayerProps = {
  currentStep: State<number | undefined>;
  steps: TourStep[];
  refreshes: State<number>;
  targetElement: HTMLElement;
  helperElementPadding: number;
};

export const DisableInteraction = ({
  currentStep,
  steps,
  refreshes,
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

    van.derive(() => {
      // set the position of the reference layer if the refreshes signal changes
      if (!step.val || refreshes.val == undefined) return;

      setPositionRelativeToStep(
        targetElement,
        disableInteraction,
        step.val,
        helperElementPadding
      );
    });

    return disableInteraction;
  };
};
