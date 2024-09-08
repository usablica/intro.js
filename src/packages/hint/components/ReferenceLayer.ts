import { setPositionRelativeTo } from "../../../util/positionRelativeTo";
import van, { State } from "../../dom/van";
import {
  hintReferenceClassName,
  tooltipReferenceLayerClassName,
} from "../className";
import { dataStepAttribute } from "../dataAttributes";
import { HintTooltip, HintTooltipProps } from "./HintTooltip";

const { div } = van.tags;

export type ReferenceLayerProps = HintTooltipProps & {
  activeHintSignal: State<number | undefined>;
  targetElement: HTMLElement;
  helperElementPadding: number;
};

export const ReferenceLayer = ({
  activeHintSignal,
  targetElement,
  helperElementPadding,
  ...props
}: ReferenceLayerProps) => {
  return () => {
    // remove the reference layer if the active hint signal is set to undefined
    // e.g. when the user clicks outside the hint
    if (activeHintSignal.val == undefined) return null;

    const referenceLayer = div(
      {
        [dataStepAttribute]: activeHintSignal.val,
        className: `${tooltipReferenceLayerClassName} ${hintReferenceClassName}`,
      },
      HintTooltip(props)
    );

    setTimeout(() => {
      setPositionRelativeTo(
        targetElement,
        referenceLayer,
        props.element as HTMLElement,
        helperElementPadding
      );
    }, 1);

    return referenceLayer;
  };
};
