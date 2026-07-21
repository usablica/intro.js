/**
 * Detect device type based on screen size and user agent
 */
export function detectDeviceType(): "mobile" | "tablet" | "desktop" {
  const width = window.innerWidth;
  const userAgent = navigator.userAgent.toLowerCase();

  if (
    width <= 768 ||
    /mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent
    )
  ) {
    return "mobile";
  } else if (width <= 1024 || /tablet|ipad/i.test(userAgent)) {
    return "tablet";
  } else {
    return "desktop";
  }
}
