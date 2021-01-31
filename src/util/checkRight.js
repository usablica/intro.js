/**
 * Set tooltip left so it doesn't go off the right side of the window
 *
 * @return boolean true, if tooltipLayerStyleLeft is ok.  false, otherwise.
 */
export default function checkRight(
  targetOffset,
  tooltipLayerStyleLeft,
  tooltipOffset,
  windowSize,
  tooltipLayer
) {
  if (
    targetOffset.left + tooltipLayerStyleLeft + tooltipOffset.width >
    windowSize.width
  ) {
    // off the right side of the window
    tooltipLayer.style.left = `${
      windowSize.width - tooltipOffset.width - targetOffset.left
    }px`;
    return false;
  }
  tooltipLayer.style.left = `${tooltipLayerStyleLeft}px`;
  return true;
}
