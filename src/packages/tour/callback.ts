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

export type introSkipCallback = (
  this: Tour,
  currentStep: number
) => void | Promise<void>;

export type introBeforeExitCallback = (
  this: Tour,
  targetElement: HTMLElement
) => boolean | Promise<boolean>;

export type hintsAddedCallback = (this: Tour) => void | Promise<void>;
