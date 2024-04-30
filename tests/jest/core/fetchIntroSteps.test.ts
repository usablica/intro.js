import { IntroJs } from "../../../src/intro";
import fetchIntroSteps from "../../../src/core/fetchIntroSteps";

describe("fetchIntroSteps", () => {
  test("should add floating element from options.steps to the list", () => {
    // Arrange
    const targetElement = document.createElement("div");

    // Act
    const steps = fetchIntroSteps(
      {
        _options: {
          steps: [
            {
              element: "#element_does_not_exist",
              intro: "hello world",
            },
            {
              intro: "second",
            },
          ],
        },
      } as IntroJs,
      targetElement
    );

    // Assert
    expect(steps.length).toBe(2);

    expect(steps[0].position).toBe("floating");
    expect(steps[0].intro).toBe("hello world");
    expect(steps[0].step).toBe(1);

    expect(steps[1].position).toBe("floating");
    expect(steps[1].intro).toBe("second");
    expect(steps[1].step).toBe(2);
  });

  test("should find and add elements from options.steps to the list", () => {
    // Arrange
    const targetElement = document.createElement("div");

    const stepOne = document.createElement("div");
    stepOne.setAttribute("id", "first");

    const stepTwo = document.createElement("div");
    stepTwo.setAttribute("id", "second");

    document.body.appendChild(stepOne);
    document.body.appendChild(stepTwo);

    // Act
    const steps = fetchIntroSteps(
      {
        _options: {
          tooltipPosition: "bottom",
          steps: [
            {
              element: "#first",
              intro: "first",
            },
            {
              element: "#second",
              intro: "second",
              position: "top",
            },
            {
              element: "#not_found",
              intro: "third",
            },
          ],
        },
      } as IntroJs,
      targetElement
    );

    // Assert
    expect(steps.length).toBe(3);

    expect(steps[0].element).toBe(stepOne);
    expect(steps[0].position).toBe("bottom");
    expect(steps[0].intro).toBe("first");
    expect(steps[0].step).toBe(1);

    expect(steps[1].element).toBe(stepTwo);
    expect(steps[1].position).toBe("top");
    expect(steps[1].intro).toBe("second");
    expect(steps[1].step).toBe(2);

    expect(steps[2].position).toBe("floating");
    expect(steps[2].intro).toBe("third");
    expect(steps[2].step).toBe(3);
  });

  test("should find the data-* elements from the DOM", () => {
    // Arrange
    const targetElement = document.createElement("div");

    const stepOne = document.createElement("div");
    stepOne.setAttribute("data-intro", "first");

    const stepTwo = document.createElement("div");
    stepTwo.setAttribute("data-intro", "second");
    stepTwo.setAttribute("data-position", "left");

    targetElement.appendChild(stepOne);
    targetElement.appendChild(stepTwo);

    // Act
    const steps = fetchIntroSteps(
      {
        _options: {
          tooltipPosition: "bottom",
        },
      } as IntroJs,
      targetElement
    );

    // Assert
    expect(steps.length).toBe(2);

    expect(steps[0].position).toBe("bottom");
    expect(steps[0].intro).toBe("first");
    expect(steps[0].step).toBe(1);

    expect(steps[1].position).toBe("left");
    expect(steps[1].intro).toBe("second");
    expect(steps[1].step).toBe(2);
  });

  test("should respect the custom step attribute (DOM)", () => {
    // Arrange
    const targetElement = document.createElement("div");

    const stepOne = document.createElement("div");
    stepOne.setAttribute("data-intro", "second");
    stepOne.setAttribute("data-step", "5");

    const stepTwo = document.createElement("div");
    stepTwo.setAttribute("data-intro", "first");

    targetElement.appendChild(stepOne);
    targetElement.appendChild(stepTwo);

    // Act
    const steps = fetchIntroSteps(
      {
        _options: {
          tooltipPosition: "bottom",
        },
      } as IntroJs,
      targetElement
    );

    // Assert
    expect(steps.length).toBe(2);

    expect(steps[0].intro).toBe("first");
    expect(steps[0].step).toBe(1);

    expect(steps[1].intro).toBe("second");
    expect(steps[1].step).toBe(5);
  });

  test("should ignore DOM elements when options.steps is available", () => {
    // Arrange
    const targetElement = document.createElement("div");

    const stepOne = document.createElement("div");
    stepOne.setAttribute("data-intro", "first");

    const stepTwo = document.createElement("div");
    stepTwo.setAttribute("data-intro", "second");

    targetElement.appendChild(stepOne);
    targetElement.appendChild(stepTwo);

    // Act
    const steps = fetchIntroSteps(
      {
        _options: {
          steps: [
            {
              intro: "steps-first",
            },
            {
              intro: "steps-second",
            },
          ],
        },
      } as IntroJs,
      targetElement
    );

    // Assert
    expect(steps.length).toBe(2);
    expect(steps[0].intro).toBe("steps-first");
    expect(steps[1].intro).toBe("steps-second");
  });

  it("should correctly sort based on data-step", () => {
    // Arrange
    const targetElement = document.createElement("div");

    const stepOne = document.createElement("div");
    stepOne.setAttribute("data-intro", "one");

    const stepTwo = document.createElement("div");
    stepTwo.setAttribute("data-intro", "two");

    const stepThree = document.createElement("div");
    stepThree.setAttribute("data-intro", "three");
    stepThree.setAttribute("data-step", "3");

    const stepFour = document.createElement("div");
    stepFour.setAttribute("data-intro", "four");
    stepFour.setAttribute("data-step", "5");

    targetElement.appendChild(stepThree);
    targetElement.appendChild(stepOne);
    targetElement.appendChild(stepFour);
    targetElement.appendChild(stepTwo);

    // Act
    const steps = fetchIntroSteps(
      {
        _options: {},
      } as IntroJs,
      targetElement
    );

    // Assert
    expect(steps.length).toBe(4);

    expect(steps[0].intro).toBe("one");
    expect(steps[0].step).toBe(1);

    expect(steps[1].intro).toBe("two");
    expect(steps[1].step).toBe(2);

    expect(steps[2].intro).toBe("three");
    expect(steps[2].step).toBe(3);

    expect(steps[3].intro).toBe("four");
    expect(steps[3].step).toBe(5);
  });
});
