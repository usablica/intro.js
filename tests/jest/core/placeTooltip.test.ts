import * as getOffset from "../../../src/util/getOffset";
import * as getWindowSize from "../../../src/util/getWindowSize";
import placeTooltip from "../../../src/core/placeTooltip";
import { IntroJs } from "../../../src/intro";
import { IntroStep } from "../../../src/core/steps";

describe("placeTooltip", () => {
  test("should automatically place the tooltip position when there is enough space", () => {
    jest.spyOn(getOffset, "default").mockReturnValue({
      height: 100,
      width: 100,
      top: 0,
      left: 0,
    });

    jest.spyOn(getWindowSize, "default").mockReturnValue({
      height: 1000,
      width: 1000,
    });

    jest.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      toJSON: jest.fn,
      width: 100,
      height: 100,
      top: 200,
      left: 200,
      bottom: 300,
      right: 300,
    });

    const currentStep: IntroStep = {
      step: 0,
      intro: "hello",
      title: "hello",
      position: "top",
      element: document.createElement("div"),
      scrollTo: "element",
    };
    const tooltipLayer = document.createElement("div");
    const arrowLayer = document.createElement("div");

    placeTooltip(
      {
        _currentStep: 0,
        _introItems: [currentStep],
        _options: {
          positionPrecedence: ["top", "bottom", "left", "right"],
          autoPosition: true,
        },
      } as IntroJs,
      currentStep,
      tooltipLayer,
      arrowLayer,
      false
    );

    expect(tooltipLayer.className).toBe(
      "introjs-tooltip introjs-top-right-aligned"
    );
  });

  test("should skip auto positioning when autoPosition is false", () => {
    const currentStep: IntroStep = {
      step: 0,
      intro: "hello",
      title: "hello",
      position: "top",
      element: document.createElement("div"),
      scrollTo: "element",
    };
    const tooltipLayer = document.createElement("div");
    const arrowLayer = document.createElement("div");

    placeTooltip(
      {
        _currentStep: 0,
        _introItems: [
          {
            intro: "intro",
            position: "top",
          },
        ],
        _options: {
          positionPrecedence: ["top", "bottom"],
          autoPosition: false,
        },
      } as IntroJs,
      currentStep,
      tooltipLayer,
      arrowLayer,
      false
    );

    expect(tooltipLayer.className).toBe("introjs-tooltip introjs-top");
  });

  test("should use floating tooltips when height/width is limited", () => {
    jest.spyOn(getOffset, "default").mockReturnValue({
      height: 100,
      width: 100,
      top: 0,
      left: 0,
    });

    jest.spyOn(getWindowSize, "default").mockReturnValue({
      height: 100,
      width: 100,
    });

    jest.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      toJSON: jest.fn,
      width: 100,
      height: 100,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    });

    const currentStep: IntroStep = {
      step: 0,
      intro: "hello",
      title: "hello",
      position: "left",
      element: document.createElement("div"),
      scrollTo: "element",
    };
    const tooltipLayer = document.createElement("div");
    const arrowLayer = document.createElement("div");

    placeTooltip(
      {
        _currentStep: 0,
        _introItems: [currentStep],
        _options: {
          positionPrecedence: ["top", "bottom", "left", "right"],
          autoPosition: true,
        },
      } as IntroJs,
      currentStep,
      tooltipLayer,
      arrowLayer,
      false
    );

    expect(tooltipLayer.className).toBe("introjs-tooltip introjs-floating");
  });

  test("should use bottom middle aligned when there is enough vertical space", () => {
    jest.spyOn(getOffset, "default").mockReturnValue({
      height: 100,
      width: 100,
      top: 0,
      left: 0,
    });

    jest.spyOn(getWindowSize, "default").mockReturnValue({
      height: 500,
      width: 100,
    });

    jest.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      toJSON: jest.fn,
      width: 100,
      height: 100,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    });

    const currentStep: IntroStep = {
      step: 0,
      intro: "hello",
      title: "hello",
      position: "left",
      element: document.createElement("div"),
      scrollTo: "element",
    };
    const tooltipLayer = document.createElement("div");
    const arrowLayer = document.createElement("div");

    placeTooltip(
      {
        _currentStep: 0,
        _introItems: [currentStep],
        _options: {
          positionPrecedence: ["top", "bottom", "left", "right"],
          autoPosition: true,
        },
      } as IntroJs,
      currentStep,
      tooltipLayer,
      arrowLayer,
      false
    );

    expect(tooltipLayer.className).toBe(
      "introjs-tooltip introjs-bottom-middle-aligned"
    );
  });

  test("should attach the global custom tooltip css class", () => {
    const currentStep: IntroStep = {
      step: 0,
      intro: "hello",
      title: "hello",
      position: "left",
      element: document.createElement("div"),
      scrollTo: "element",
    };
    const tooltipLayer = document.createElement("div");
    const arrowLayer = document.createElement("div");

    placeTooltip(
      {
        _currentStep: 0,
        _introItems: [currentStep],
        _options: {
          positionPrecedence: ["top", "bottom", "left", "right"],
          autoPosition: true,
          tooltipClass: "newclass",
        },
      } as IntroJs,
      currentStep,
      tooltipLayer,
      arrowLayer,
      false
    );

    expect(tooltipLayer.className).toBe(
      "introjs-tooltip newclass introjs-bottom-middle-aligned"
    );
  });

  test("should attach the step custom tooltip css class", () => {
    const currentStep: IntroStep = {
      step: 0,
      intro: "hello",
      title: "hello",
      position: "left",
      element: document.createElement("div"),
      scrollTo: "element",
      tooltipClass: "myclass",
    };
    const tooltipLayer = document.createElement("div");
    const arrowLayer = document.createElement("div");

    placeTooltip(
      {
        _currentStep: 0,
        _introItems: [currentStep],
        _options: {
          positionPrecedence: ["top", "bottom", "left", "right"],
          autoPosition: true,
        },
      } as IntroJs,
      currentStep,
      tooltipLayer,
      arrowLayer,
      false
    );

    expect(tooltipLayer.className).toBe(
      "introjs-tooltip myclass introjs-bottom-middle-aligned"
    );
  });
});
