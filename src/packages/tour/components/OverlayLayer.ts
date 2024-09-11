import { style } from "../../../util/style";
import { overlayClassName } from "../classNames";
import dom from "../../dom";
import { Tour } from "../tour";

const { div } = dom.tags;

export type OverlayLayerProps = {
  exitOnOverlayClick: boolean;
  onExitTour: () => Promise<Tour>;
};

export const OverlayLayer = ({
  exitOnOverlayClick,
  onExitTour,
}: OverlayLayerProps) => {
  const overlayLayer = div({
    className: overlayClassName,
    style: style({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      position: "fixed",
      cursor: exitOnOverlayClick ? "pointer" : "auto",
    }),
  });

  if (exitOnOverlayClick) {
    overlayLayer.onclick = async () => {
      await onExitTour();
    };
  }

  return overlayLayer;
};
