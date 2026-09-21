import { Tour } from "./tour";

export type introBeforeChangeCallback = (
  this: Tour,
  targetElement: HTMLElement,
  currentStep: number,
  direction: "backward" | "forward"
) => Promise<boolean> | boolean;

export type introChangeCallback = (
  this: Tour,
  targetElement: HTMLElement
) => void | Promise<void>;

export type introAfterChangeCallback = (
  this: Tour,
  targetElement: HTMLElement
) => void | Promise<void>;

export type introCompleteCallback = (
  this: Tour,
  currentStep: number,
  reason: "skip" | "end" | "done"
) => void | Promise<void>;

export type introStartCallback = (
  this: Tour,
  targetElement: HTMLElement
) => void | Promise<void>;

export type introExitCallback = (this: Tour) => void | Promise<void>;

/**
 * Called when the user skips the tour (clicking, or pressing Enter on, the
 * skip button). Return `false` (or a Promise resolving to `false`) to
 * cancel the skip and keep the tour open - mirrors
 * {@link introBeforeExitCallback}. Returning anything else (including
 * `void`) lets the skip proceed as normal.
 */
export type introSkipCallback = (
  this: Tour,
  currentStep: number
) => boolean | Promise<boolean> | void | Promise<void>;

export type introBeforeExitCallback = (
  this: Tour,
  targetElement: HTMLElement
) => boolean | Promise<boolean>;

export type hintsAddedCallback = (this: Tour) => void | Promise<void>;
