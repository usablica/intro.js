export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// time to wait for the derivations to update
export const waitMsForDerivations = 5;

// time to wait for the exit transition to complete
export const waitMsForExitTransition = 260;
