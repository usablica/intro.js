import placeTooltip from "../../src/core/placeTooltip";


describe("placeTooltip", () => {
  test("should skip auto positioning when autoPosition is false", () => {
    const targetElement = document.createElement("div");
    const tooltipLayer = document.createElement("div");
    const arrowLayer = document.createElement("div");

    placeTooltip.call({
      _currentStep: 0,
      _introItems: [{
        tooltip: 'hello',
        position: 'top'
      }],
      _options: {
        positionPrecedence: ['top', 'bottom'],
        autoPosition: false
      }
    }, targetElement, tooltipLayer, arrowLayer, false);

    expect(tooltipLayer.className).toBe('introjs-tooltip introjs-top');
  });

  test("should determine tooltip positions automatically", () => {
    const targetElement = document.createElement("div");
    targetElement.clientHeight = '100px';

    const tooltipLayer = document.createElement("div");
    const arrowLayer = document.createElement("div");

    placeTooltip.call({
      _currentStep: 0,
      _introItems: [{
        tooltip: 'hello',
        position: 'bottom'
      }],
      _options: {
        positionPrecedence: ['top', 'bottom']
      }
    }, targetElement, tooltipLayer, arrowLayer, false);

    expect(tooltipLayer.className).toBe('introjs-tooltip introjs-top');
  });
});