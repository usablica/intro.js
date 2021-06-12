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
});
