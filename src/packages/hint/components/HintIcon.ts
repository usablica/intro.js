import isFixed from "../../../util/isFixed";
import dom, { State } from "../../dom";
import {
  clippedHintClassName,
  fixedHintClassName,
  hideHintClassName,
  hintClassName,
  hintDotClassName,
  hintNoAnimationClassName,
  hintPulseClassName,
} from "../className";
import { HintItem, HintPosition } from "../hintItem";
import { dataStepAttribute } from "../dataAttributes";
import { alignHintPosition, hintIconCenter } from "../position";
import isClippedByContainers from "../../../util/isClippedByContainers";

const { a, div } = dom.tags;

export type HintProps = {
  index: number;
  hintItem: HintItem;
  refreshesSignal: State<number>;
  onClick: (e: any) => void;
  // called when the icon gets cut off by a scroll container of its element
  onClipped?: () => void;
};

const className = (hintItem: HintItem, clipped: boolean) => {
  const classNames = [hintClassName];

  if (clipped) {
    classNames.push(clippedHintClassName);
  }

  if (!hintItem.hintAnimation) {
    classNames.push(hintNoAnimationClassName);
  }

  if (isFixed(hintItem.element as HTMLElement)) {
    classNames.push(fixedHintClassName);
  }

  if (!hintItem.isActive?.val) {
    classNames.push(hideHintClassName);
  }

  return classNames.join(" ");
};

const HintDot = () => div({ className: hintDotClassName });
const HintPulse = () => div({ className: hintPulseClassName });

export const HintIcon = ({
  index,
  hintItem,
  onClick,
  onClipped,
  refreshesSignal,
}: HintProps) => {
  // the element scrolled out of view inside a scroll container
  const clipped = dom.state(false);

  const hintElement = a(
    {
      [dataStepAttribute]: index.toString(),
      className: () => className(hintItem, !!clipped.val),
      role: "button",
      tabindex: 0,
      "aria-label": hintItem?.hint,
      onclick: onClick,
    },
    HintDot(),
    HintPulse()
  );

  dom.derive(() => {
    if (refreshesSignal.val === undefined) return;

    const element = hintItem.element as HTMLElement;
    const position = hintItem.hintPosition as HintPosition;
    alignHintPosition(position, hintElement, element);

    if (!element) return;
    const center = hintIconCenter(position, element);
    const isClipped = isClippedByContainers(element, center.x, center.y);

    if (isClipped && !clipped.val) onClipped?.();
    clipped.val = isClipped;
  });

  return hintElement;
};
