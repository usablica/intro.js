import { Tooltip, TooltipProps } from "../tooltip/tooltip";
import van from "../dom/van";
import { tooltipTextClassName } from "./className";

const { a, p, div } = van.tags;

export type HintTooltipProps = Omit<TooltipProps, "hintMode"> & {
  text: string;
  closeButtonEnabled: boolean;
  closeButtonOnClick: () => void;
  closeButtonLabel: string;
  closeButtonClassName: string;
};

export const HintTooltip = ({
  text,
  closeButtonEnabled,
  closeButtonOnClick,
  closeButtonLabel,
  closeButtonClassName,
  ...props
}: HintTooltipProps) => {
  return Tooltip(
    {
      ...props,
      hintMode: true,
    },
    [
      div({ className: tooltipTextClassName }, p(text)),
      closeButtonEnabled
        ? a(
            {
              className: closeButtonClassName,
              role: "button",
              onclick: closeButtonOnClick,
            },
            closeButtonLabel
          )
        : null,
    ]
  );
};
