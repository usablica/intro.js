import fetchIntroSteps from "../../src/core/fetchIntroSteps";

describe("fetchIntroSteps", () => {
  test("should add floating element from options.steps to the list", () => {
    const targetElement = document.createElement("div");

    const steps = fetchIntroSteps.call(
      {
        _options: {
          steps: [{
            element: '#element_does_not_exist',
            intro: 'hello world'
          }, {
            intro: 'second'
          }]
        },
      },
      targetElement
    );

    expect(steps.length).toBe(2);

    expect(steps[0].position).toBe('floating');
    expect(steps[0].intro).toBe('hello world');
    expect(steps[0].step).toBe(1);

    expect(steps[1].position).toBe('floating');
    expect(steps[1].intro).toBe('second');
    expect(steps[1].step).toBe(2);
  });

  test("should find the data-* elements from the DOM", () => {
    const targetElement = document.createElement("div");

    const stepOne = document.createElement('div');
    stepOne.setAttribute('data-intro', 'first');

    const stepTwo = document.createElement('div');
    stepTwo.setAttribute('data-intro', 'second');
    stepTwo.setAttribute('data-position', 'left');

    targetElement.appendChild(stepOne);
    targetElement.appendChild(stepTwo);

    const steps = fetchIntroSteps.call(
      {
        _options: {
          tooltipPosition: 'bottom'
        },
      },
      targetElement
    );

    expect(steps.length).toBe(2);

    expect(steps[0].position).toBe('bottom');
    expect(steps[0].intro).toBe('first');
    expect(steps[0].step).toBe(1);

    expect(steps[1].position).toBe('left');
    expect(steps[1].intro).toBe('second');
    expect(steps[1].step).toBe(2);
  });

  test("should respect the custom step attribute (DOM)", () => {
    const targetElement = document.createElement("div");

    const stepOne = document.createElement('div');
    stepOne.setAttribute('data-intro', 'second');
    stepOne.setAttribute('data-step', '5');

    const stepTwo = document.createElement('div');
    stepTwo.setAttribute('data-intro', 'first');

    targetElement.appendChild(stepOne);
    targetElement.appendChild(stepTwo);

    const steps = fetchIntroSteps.call(
      {
        _options: {
          tooltipPosition: 'bottom'
        },
      },
      targetElement
    );

    expect(steps.length).toBe(2);

    expect(steps[0].intro).toBe('first');
    expect(steps[0].step).toBe(1);

    expect(steps[1].intro).toBe('second');
    expect(steps[1].step).toBe(5);
  });

  test("should ignore DOM elements when options.steps is available", () => {
    const targetElement = document.createElement("div");

    const stepOne = document.createElement('div');
    stepOne.setAttribute('data-intro', 'first');

    const stepTwo = document.createElement('div');
    stepTwo.setAttribute('data-intro', 'second');

    targetElement.appendChild(stepOne);
    targetElement.appendChild(stepTwo);

    const steps = fetchIntroSteps.call(
      {
        _options: {
          steps: [{
            intro: 'steps-first',
          }, {
            intro: 'steps-second',
          }]
        },
      },
      targetElement
    );

    expect(steps.length).toBe(2);
    expect(steps[0].intro).toBe('steps-first');
    expect(steps[1].intro).toBe('steps-second');
  });


});
