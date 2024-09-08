import { Tooltip, TooltipProps } from "../../tooltip/tooltip";
import van from "../../dom/van";
import { tooltipTextClassName } from "../className";
import { HintItem } from "../hintItem";

const { a, p, div } = van.tags;

export type HintTooltipProps = Omit<
  TooltipProps,
  "hintMode" | "element" | "position"
> & {
  hintItem: HintItem;
  closeButtonEnabled: boolean;
  closeButtonOnClick: (hintItem: HintItem) => void;
  closeButtonLabel: string;
  closeButtonClassName: string;
};

export const HintTooltip = ({
  hintItem,
  closeButtonEnabled,
  closeButtonOnClick,
  closeButtonLabel,
  closeButtonClassName,
  ...props
}: HintTooltipProps) => {
  return Tooltip(
    {
      ...props,
      element: hintItem.hintTooltipElement as HTMLElement,
      position: hintItem.position,
      hintMode: true,
    },
    [
      div(
        { className: tooltipTextClassName },
        p(hintItem.hint || ""),
        closeButtonEnabled
          ? a(
              {
                className: closeButtonClassName,
                role: "button",
                onclick: () => closeButtonOnClick(hintItem),
              },
              closeButtonLabel
            )
          : null
      ),
    ]
  );
};
