/**
 * Export all trigger setup functions
 */
export { setupFirstVisitTrigger } from "./firstVisit";
export { setupElementClickTrigger } from "./elementClick";
export { setupElementHoverTrigger } from "./elementHover";
export { setupIdleUserTrigger } from "./idleUser";
export { setupPageLoadTrigger } from "./pageLoad";
export { setupScrollToElementTrigger } from "./scrollToElement";
export { setupTimeOnPageTrigger } from "./timeOnPage";
export { setupExitIntentTrigger } from "./exitIntent";
export { setupFormInteractionTrigger } from "./formInteraction";
export { setupCustomEventTrigger } from "./customEvent";
export { setupUrlMatchTrigger } from "./urlMatch";
export { setupDeviceTypeTrigger } from "./deviceType";
export { setupReturningUserTrigger } from "./returningUser";
export { setupSessionCountTrigger } from "./sessionCount";
export { setupScrollDepthTrigger } from "./scrollDepth";
export { setupElementVisibleTrigger } from "./elementVisible";

export type { TriggerCallback, TriggerCleanup } from "./types";
export { detectDeviceType } from "./utils";
