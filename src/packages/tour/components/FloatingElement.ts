import van, { State } from "../../dom/van";
import { floatingElementClassName } from "../classNames";

const { div } = van.tags;

export type FloatingElementProps = {
  currentStep: State<number | undefined>;
};

export const FloatingElement = ({ currentStep }: FloatingElementProps) => {
  const floatingElement = div({
    className: floatingElementClassName,
  });

  van.derive(() => {
    // meaning the tour has ended so we should remove the floating element
    if (currentStep.val === undefined) {
      floatingElement.remove();
    }
  });

  return floatingElement;
};
