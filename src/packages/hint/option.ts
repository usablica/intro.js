import { TooltipPosition } from "../../packages/tooltip";
import { HintItem, HintPosition } from "./hintItem";

export interface HintOptions {
  /* List of all HintItems */
  hints: Partial<HintItem>[];
  /* True if the Hint instance is set to active */
  isActive: boolean;
  /* Default tooltip box position */
  tooltipPosition: string;
  /* Next CSS class for tooltip boxes */
  tooltipClass: string;
  /* Default hint position */
  hintPosition: HintPosition;
  /* Hint button label */
  hintButtonLabel: string;
  /* Display the "Got it" button? */
  hintShowButton: boolean;
  /* Hints auto-refresh interval in ms (set to -1 to disable) */
  hintAutoRefreshInterval: number;
  /* Adding animation to hints? */
  hintAnimation: boolean;
  /* additional classes to put on the buttons */
  buttonClass: string;
  /* Set how much padding to be used around helper element */
  helperElementPadding: number;
  /* To determine the tooltip position automatically based on the window.width/height */
  autoPosition: boolean;
  /* Precedence of positions, when auto is enabled */
  positionPrecedence: TooltipPosition[];
}

export function getDefaultHintOptions(): HintOptions {
  return {
    hints: [],
    isActive: true,
    tooltipPosition: "bottom",
    tooltipClass: "",
    hintPosition: "top-middle",
    hintButtonLabel: "Got it",
    hintShowButton: true,
    hintAutoRefreshInterval: 10,
    hintAnimation: true,
    buttonClass: "introjs-button",
    helperElementPadding: 10,
    autoPosition: true,
    positionPrecedence: ["bottom", "top", "right", "left"],
  };
}
