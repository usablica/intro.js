import { IntroJs } from "../../../src/intro";
import { IntroStep } from "../../../src/core/steps";
import setHelperLayerPosition from "../../../src/core/setHelperLayerPosition";
import _createElement from "../../../src/util/createElement";
import { getBoundingClientRectSpy } from "../helper";

describe("setHelperLayerPosition", () => {
  let context: IntroJs;

  beforeEach(() => {
    context = {
      _currentStep: 0,
      _introItems: [
        {
          intro: "hello",
          position: "top",
        },
        {
          intro: "world",
          position: "top",
        },
      ],
      _targetElement: document.body,
      _introBeforeChangeCallback: undefined,
      _options: {
        helperElementPadding: 10,
      },
    } as IntroJs;
  });

  it("should return if helperLayer or currentStep is null", () => {
    // Act
    const returned = setHelperLayerPosition(
      context,
      null as unknown as IntroStep,
      null as unknown as HTMLElement
    );

    // Assert
    expect(returned).toBeUndefined();
  });

  it("should set the correct width, height, top, left", () => {
    // Arrange
    const elm = _createElement("div");
    elm.getBoundingClientRect = getBoundingClientRectSpy(
      200,
      100,
      10,
      50,
      100,
      100
    );

    const step: IntroStep = {
      step: 0,
      title: "hi",
      intro: "hi",
      position: "bottom",
      scrollTo: "element",
      element: elm,
    };
    const helperLayer = _createElement("div");
    helperLayer.getBoundingClientRect = getBoundingClientRectSpy(
      500,
      500,
      5,
      10,
      15,
      20
    );

    // Act
    setHelperLayerPosition(context, step, helperLayer);

    // Assert
    expect(helperLayer.style.width).toBe("210px");
    expect(helperLayer.style.height).toBe("110px");
    expect(helperLayer.style.top).toBe("5px");
    expect(helperLayer.style.left).toBe("45px");
  });

  it("should add fixedTooltip if element is fixed", () => {
    // Arrange
    const elmParent = _createElement("div");
    const elm = _createElement("div");
    elm.style.position = "fixed";
    elmParent.appendChild(elm);

    const step: IntroStep = {
      step: 0,
      title: "hi",
      intro: "hi",
      position: "bottom",
      scrollTo: "element",
      element: elm,
    };
    const helperLayer = _createElement("div");

    // Act
    setHelperLayerPosition(context, step, helperLayer);

    // Assert
    expect(helperLayer.className).toBe("introjs-fixedTooltip");
  });

  it("should remove the fixedTooltip className if element is not fixed", () => {
    // Arrange
    const elm = _createElement("div");
    elm.style.position = "absolute";

    const step: IntroStep = {
      step: 0,
      title: "hi",
      intro: "hi",
      position: "bottom",
      scrollTo: "element",
      element: elm,
    };
    const helperLayer = _createElement("div");
    helperLayer.className = "introjs-fixedTooltip";

    // Act
    setHelperLayerPosition(context, step, helperLayer);

    // Assert
    expect(helperLayer.className).not.toBe("introjs-fixedTooltip");
  });
});
