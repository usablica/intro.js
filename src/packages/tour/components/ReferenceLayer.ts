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

  van.derive(() => {
    // set the position of the reference layer if the refreshes signal changes
    if (props.refreshes.val == undefined) return;

    setPositionRelativeToStep(
      targetElement,
      referenceLayer,
      props.step,
      helperElementPadding
    );
  });

  return referenceLayer;
};
