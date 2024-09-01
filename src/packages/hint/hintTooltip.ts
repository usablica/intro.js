import { Tooltip, TooltipProps } from "../tooltip/tooltip";
import van from "../dom/van";

const { a } = van.tags;

export type HintTooltipProps = Omit<TooltipProps, "hintMode"> & {
  closeButtonEnabled: boolean;
  closeButtonOnClick: () => void;
  closeButtonLabel: string;
  closeButtonClassName: string;
};

export const HintTooltip = ({
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
      closeButtonEnabled ?
        a(
          {
            className: closeButtonClassName,
            role: "button",
            onclick: closeButtonOnClick,
          },
          closeButtonLabel
        ) : null,
    ]
  );
};
