import dom, { State } from "../../dom";
import { floatingElementClassName } from "../classNames";

const { div } = dom.tags;

export type FloatingElementProps = {
  currentStep: State<number | undefined>;
};

export const FloatingElement = ({ currentStep }: FloatingElementProps) => {
  const floatingElement = div({
    className: floatingElementClassName,
  });

  dom.derive(() => {
    // meaning the tour has ended so we should remove the floating element
    if (currentStep.val === undefined) {
      floatingElement.remove();
    }
  });

  return floatingElement;
};
