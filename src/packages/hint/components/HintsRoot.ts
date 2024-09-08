import van from "../../dom/van";
import { hintsClassName } from "../className";
import { hideHint } from "../hide";
import { Hint } from "../hint";
import { showHintDialog } from "../tooltip";
import { HintIcon } from "./HintIcon";
import { ReferenceLayer } from "./ReferenceLayer";

const { div } = van.tags;

export type HintsRootProps = {
  hint: Hint;
};

/**
 * Returns an event handler unique to the hint iteration
 */
const getHintClick = (hint: Hint, i: number) => (e: Event) => {
  const evt = e ? e : window.event;

  if (evt && evt.stopPropagation) {
    evt.stopPropagation();
  }

  if (evt && evt.cancelBubble !== null) {
    evt.cancelBubble = true;
  }

  showHintDialog(hint, i);
};

export const HintsRoot = ({ hint }: HintsRootProps) => {
  const hintElements = [];

  for (const [i, hintItem] of hint.getHints().entries()) {
    hintElements.push(
      HintIcon({
        index: i,
        hintItem,
        onClick: getHintClick(hint, i),
      })
    );
  }

  const root = div(
    {
      className: hintsClassName,
    },
    ...hintElements
  );

  van.derive(() => {
    if (hint._activeHintSignal.val === undefined) return;

    const stepId = hint._activeHintSignal.val;
    const hints = hint.getHints();
    const hintItem = hints[stepId];

    const referenceLayer = ReferenceLayer({
      activeHintSignal: hint._activeHintSignal,
      text: hintItem.hint || "",
      element: hintItem.element as HTMLElement,
      position: hintItem.position,

      helperElementPadding: hint.getOption("helperElementPadding"),
      targetElement: hint.getTargetElement(),

      refreshes: hint._refreshes,

      // hints don't have step numbers
      showStepNumbers: false,

      autoPosition: hint.getOption("autoPosition"),
      positionPrecedence: hint.getOption("positionPrecedence"),

      closeButtonEnabled: hint.getOption("hintShowButton"),
      closeButtonLabel: hint.getOption("hintButtonLabel"),
      closeButtonClassName: hint.getOption("buttonClass"),
      closeButtonOnClick: () => hideHint(hint, stepId),
    });

    van.add(root, referenceLayer);
  });

  return root;
};
