import { setPositionRelativeTo } from "../../../util/positionRelativeTo";
import dom, { State } from "../../dom";
import {
  hintReferenceClassName,
  tooltipReferenceLayerClassName,
} from "../className";
import { dataStepAttribute } from "../dataAttributes";
import { HintTooltip, HintTooltipProps } from "./HintTooltip";

const { div } = dom.tags;

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
  const initialActiveHintSignal = activeHintSignal.val;

  return () => {
    // remove the reference layer if the active hint signal is set to undefined
    // e.g. when the user clicks outside the hint
    if (activeHintSignal.val == undefined) return null;

    // remove the reference layer if the active hint signal changes
    // and the initial active hint signal is not same as the current active hint signal (e.g. when the user clicks on another hint)
    if (initialActiveHintSignal !== activeHintSignal.val) return null;

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
        props.hintItem.hintTooltipElement as HTMLElement,
        helperElementPadding
      );
    }, 1);

    return referenceLayer;
  };
};
