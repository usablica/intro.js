/**
 * Set tooltip right so it doesn't go off the left side of the window
 *
 * @return boolean true, if tooltipLayerStyleRight is ok.  false, otherwise.
 */
export default function checkLeft(
  targetOffset,
  tooltipLayerStyleRight,
  tooltipOffset,
  tooltipLayer
) {
  if (
    targetOffset.left +
      targetOffset.width -
      tooltipLayerStyleRight -
      tooltipOffset.width <
    0
  ) {
    // off the left side of the window
    tooltipLayer.style.left = `${-targetOffset.left}px`;
    return false;
  }
  tooltipLayer.style.right = `${tooltipLayerStyleRight}px`;
  return true;
}
