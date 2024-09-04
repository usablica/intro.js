import van from "../dom/van";
import { tooltipReferenceLayerClassName } from "./classNames";
import { setPositionRelativeToStep } from "./position";
import { TourStep } from "./steps";
import { TourTooltip, TourTooltipProps } from "./tourTooltip";

const { div } = van.tags;

export type ReferenceLayerProps = TourTooltipProps & {
  step: TourStep;
  targetElement: HTMLElement;
  helperElementPadding: number;
};

export const ReferenceLayer = ({
  step,
  targetElement,
  helperElementPadding,
  ...props
}: ReferenceLayerProps) => {
  const referenceLayer = div(
    {
      className: tooltipReferenceLayerClassName,
    },
    TourTooltip(props)
  );

  setPositionRelativeToStep(
    targetElement,
    referenceLayer,
    step,
    helperElementPadding
  );

  return referenceLayer;
};
