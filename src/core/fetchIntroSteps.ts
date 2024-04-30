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
    const elements: HTMLElement[] = Array.from(
      targetElm.querySelectorAll("*[data-intro]")
    );

    //if there's no element to intro
    if (elements.length < 1) {
      return [];
    }

    const itemsWithoutStep: IntroStep[] = [];

    for (const element of elements) {
      // start intro for groups of elements
      if (
        intro._options.group &&
        element.getAttribute("data-intro-group") !== intro._options.group
      ) {
        continue;
      }

      // skip hidden elements
      if (element.style.display === "none") {
        continue;
      }

      // get the step for the current element or set as 0 if is not present
      const step = parseInt(element.getAttribute("data-step") || "0", 10);

      let disableInteraction = intro._options.disableInteraction;
      if (element.hasAttribute("data-disable-interaction")) {
        disableInteraction = !!element.getAttribute("data-disable-interaction");
      }

      const newIntroStep: IntroStep = {
        step,
        element,
        title: element.getAttribute("data-title") || "",
        intro: element.getAttribute("data-intro") || "",
        tooltipClass: element.getAttribute("data-tooltip-class") || undefined,
        highlightClass:
          element.getAttribute("data-highlight-class") || undefined,
        position: (element.getAttribute("data-position") ||
          intro._options.tooltipPosition) as TooltipPosition,
        scrollTo:
          (element.getAttribute("data-scroll-to") as ScrollTo) ||
          intro._options.scrollTo,
        disableInteraction,
      };

      if (step > 0) {
        introItems[step - 1] = newIntroStep;
      } else {
        itemsWithoutStep.push(newIntroStep);
      }
    }

    // fill items without step in blanks and update their step
    for (let i = 0; itemsWithoutStep.length > 0; i++) {
      if (typeof introItems[i] === "undefined") {
        const newStep = itemsWithoutStep.shift();
        if (!newStep) break;

        newStep.step = i + 1;
        introItems[i] = newStep;
      }
    }
  }

  // removing undefined/null elements
  introItems = introItems.filter((n) => n);

  // Sort all items with given steps
  introItems.sort((a, b) => a.step - b.step);

  return introItems;
}
