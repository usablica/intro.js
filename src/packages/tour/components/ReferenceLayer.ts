import van from "../../dom/van";
import { tooltipReferenceLayerClassName } from "../classNames";
import { setPositionRelativeToStep } from "../position";
import { TourTooltip, TourTooltipProps } from "./TourTooltip";

const { div } = van.tags;

export type ReferenceLayerProps = TourTooltipProps & {
  targetElement: HTMLElement;
  helperElementPadding: number;
};

export const ReferenceLayer = ({
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
    props.step,
    helperElementPadding
  );

  return referenceLayer;
};
