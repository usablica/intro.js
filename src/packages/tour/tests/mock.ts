import createElement from "../../../util/createElement";
import { TourStep } from "../steps";
import { Tour } from "../tour";
import {
  dataIntroAttribute,
  dataPosition,
  dataStepAttribute,
} from "../dataAttributes";

export const appendMockSteps = (targetElement: HTMLElement = document.body) => {
  const mockElementOne = createElement("div");
  mockElementOne.setAttribute(dataIntroAttribute, "Mock element");

  const mockElementTwo = createElement("b");
  mockElementTwo.setAttribute(dataIntroAttribute, "Mock element left position");
  mockElementTwo.setAttribute(dataPosition, "left");

  const mockElementThree = createElement("a");
  mockElementThree.setAttribute(dataIntroAttribute, "Mock element last");
  mockElementThree.setAttribute(dataStepAttribute, "20");

  const mockElementFour = createElement("h1");
  mockElementFour.setAttribute(dataIntroAttribute, "Mock element second to last");
  mockElementFour.setAttribute(dataStepAttribute, "10");

  targetElement.appendChild(mockElementOne);
  targetElement.appendChild(mockElementTwo);
  targetElement.appendChild(mockElementThree);
  targetElement.appendChild(mockElementFour);

  return [mockElementOne, mockElementTwo, mockElementThree, mockElementFour];
};

export const getMockSteps = (): Partial<TourStep>[] => {
  return [
    {
      title: "Floating title 1",
      intro: "Step One of the tour",
    },
    {
      title: "Floating title 2",
      intro: "Step Two of the tour",
    },
    {
      title: "First title",
      intro: "Step Three of the tour",
      position: "top",
      scrollTo: "tooltip",
    },
    {
      intro: "Step Four of the tour",
      position: "right",
      scrollTo: "off",
      element: document.createElement("div"),
    },
    {
      element: ".not-found",
      intro: "Element not found",
    },
  ];
};

export const getMockTour = (targetElement: HTMLElement = document.body) => {
  return new Tour(targetElement);
};
