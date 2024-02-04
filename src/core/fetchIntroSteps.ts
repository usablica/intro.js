import { IntroJs } from "../intro";
import cloneObject from "../util/cloneObject";
import createElement from "../util/createElement";
import { IntroStep, ScrollTo, TooltipPosition } from "./steps";

/**
 * Finds all Intro steps from the data-* attributes and the options.steps array
 *
 * @api private
 */
export default function fetchIntroSteps(
  intro: IntroJs,
  targetElm: HTMLElement
) {
  const allIntroSteps: HTMLElement[] = Array.from(
    targetElm.querySelectorAll("*[data-intro]")
  );
  let introItems: IntroStep[] = [];

  if (intro._options.steps && intro._options.steps.length) {
    //use steps passed programmatically
    for (const step of intro._options.steps) {
      const currentItem = cloneObject(step);

      //set the step
      currentItem.step = introItems.length + 1;

      currentItem.title = currentItem.title || "";

      //use querySelector function only when developer used CSS selector
      if (typeof currentItem.element === "string") {
        //grab the element with given selector from the page
        currentItem.element =
          document.querySelector<HTMLElement>(currentItem.element) || undefined;
      }

      //intro without element
      if (
        typeof currentItem.element === "undefined" ||
        currentItem.element === null
      ) {
        let floatingElementQuery = document.querySelector<HTMLElement>(
          ".introjsFloatingElement"
        );

        if (floatingElementQuery === null) {
          floatingElementQuery = createElement("div", {
            className: "introjsFloatingElement",
          });

          document.body.appendChild(floatingElementQuery);
        }

        currentItem.element = floatingElementQuery;
        currentItem.position = "floating";
      }

      currentItem.position =
        currentItem.position ||
        (intro._options.tooltipPosition as TooltipPosition);
      currentItem.scrollTo = currentItem.scrollTo || intro._options.scrollTo;

      if (typeof currentItem.disableInteraction === "undefined") {
        currentItem.disableInteraction = intro._options.disableInteraction;
      }

      if (currentItem.element !== null) {
        introItems.push(currentItem as IntroStep);
      }
    }
  } else {
    //use steps from data-* annotations
    const elmsLength = allIntroSteps.length;
    let disableInteraction: boolean;

    //if there's no element to intro
    if (elmsLength < 1) {
      return [];
    }

    const itemsWithoutStep: IntroStep[] = [];

    for (const currentElement of allIntroSteps) {
      // start intro for groups of elements
      if (
        intro._options.group &&
        currentElement.getAttribute("data-intro-group") !== intro._options.group
      ) {
        continue;
      }

      // skip hidden elements
      if (currentElement.style.display === "none") {
        continue;
      }

      // get the step for the current element or set as 0 if is not present
      const step = parseInt(
        currentElement.getAttribute("data-step") || "0",
        10
      );

      disableInteraction = intro._options.disableInteraction;
      if (currentElement.hasAttribute("data-disable-interaction")) {
        disableInteraction = !!currentElement.getAttribute(
          "data-disable-interaction"
        );
      }
      const newIntroStep: IntroStep = {
        step: step,
        element: currentElement,
        title: currentElement.getAttribute("data-title") || "",
        intro: currentElement.getAttribute("data-intro") || "",
        tooltipClass:
          currentElement.getAttribute("data-tooltip-class") || undefined,
        highlightClass:
          currentElement.getAttribute("data-highlight-class") || undefined,
        position: (currentElement.getAttribute("data-position") ||
          intro._options.tooltipPosition) as TooltipPosition,
        scrollTo:
          (currentElement.getAttribute("data-scroll-to") as ScrollTo) ||
          intro._options.scrollTo,
        disableInteraction,
      };

      if (step > 0) {
        introItems[step - 1] = newIntroStep;
      } else {
        itemsWithoutStep.push(newIntroStep);
      }
    }

    //fill items without step in blanks and update their step
    for (let i = 0; itemsWithoutStep.length > 0; i++) {
      if (typeof introItems[i] === "undefined") {
        const newStep = itemsWithoutStep.shift();
        if (!newStep) break;

        newStep.step = i + 1;
        introItems[i] = newStep;
      }
    }
  }

  //removing undefined/null elements
  const tempIntroItems = [];
  for (let z = 0; z < introItems.length; z++) {
    if (introItems[z]) {
      // copy non-falsy values to the end of the array
      tempIntroItems.push(introItems[z]);
    }
  }

  introItems = tempIntroItems;

  //Ok, sort all items with given steps
  introItems.sort((a, b) => a.step - b.step);

  return introItems;
}
