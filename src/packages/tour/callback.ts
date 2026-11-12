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

export type TourEventType = "start" | "step" | "skip" | "complete" | "exit";

/**
 * A tour lifecycle event, delivered to listeners added with `tour.onEvent()`.
 * Designed to be forwarded to analytics tools (Google Analytics, Mixpanel,
 * Segment, ...) to measure where users drop off.
 */
export type TourEvent = {
  /**
   * - `start`: the tour started
   * - `step`: a step was shown to the user
   * - `skip`: the user skipped the tour
   * - `complete`: the tour completed (see `reason`)
   * - `exit`: the tour closed, for any reason (always the last event)
   */
  type: TourEventType;
  /** Value of the `tourId` option, if set */
  tourId?: string;
  /** Zero-based index of the current step. Not set on `start`. */
  step?: number;
  /** Total number of steps in the tour */
  totalSteps: number;
  /** Title of the current step, if it has one */
  stepTitle?: string;
  /** Why the tour completed. Only set on `complete` events. */
  reason?: "skip" | "end" | "done";
  /** When the event happened, in milliseconds since the epoch */
  timestamp: number;
};

export type introEventListener = (this: Tour, event: TourEvent) => void;

export type hintsAddedCallback = (this: Tour) => void | Promise<void>;
