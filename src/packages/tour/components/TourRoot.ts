import van from "../../dom/van";
import { ReferenceLayer } from "./ReferenceLayer";
import { HelperLayer } from "./HelperLayer";
import { Tour } from "../tour";
import { DisableInteraction } from "./DisableInteraction";
import { OverlayLayer } from "./OverlayLayer";
import { nextStep, previousStep } from "../steps";
import { doneButtonClassName } from "../classNames";
import { style } from "../../../util/style";

const { div } = van.tags;

export type TourRootProps = {
  tour: Tour;
};

export const TourRoot = ({ tour }: TourRootProps) => {
  const currentStep = tour.getCurrentStepSignal();
  const steps = tour.getSteps();

  const helperLayer = HelperLayer({
    currentStep,
    steps,
    targetElement: tour.getTargetElement(),
    tourHighlightClass: tour.getOption("highlightClass"),
    overlayOpacity: tour.getOption("overlayOpacity"),
    helperLayerPadding: tour.getOption("helperElementPadding"),
  });

  const opacity = van.state(0);

  const root = div(
    {
      className: "introjs-tour",
      style: () =>
        style({ opacity: `${opacity.val}` }),
    },
    // helperLayer should not be re-rendered when the state changes for the transition to work
    helperLayer,
    () => {
      // do not remove this check, it is necessary for this state-binding to work
      // and render the entire section every time the state changes
      if (currentStep.val === undefined) {
        return null;
      }

      const step = van.derive(() =>
        currentStep.val !== undefined ? steps[currentStep.val] : null
      );

      if (!step.val) {
        return null;
      }

      const exitOnOverlayClick = tour.getOption("exitOnOverlayClick") === true;
      const overlayLayer = OverlayLayer({
        exitOnOverlayClick,
        onExitTour: async () => {
          return tour.exit();
        },
      });

      const referenceLayer = ReferenceLayer({
        step: step.val,
        targetElement: tour.getTargetElement(),
        helperElementPadding: tour.getOption("helperElementPadding"),

        positionPrecedence: tour.getOption("positionPrecedence"),
        autoPosition: tour.getOption("autoPosition"),
        showStepNumbers: tour.getOption("showStepNumbers"),

        steps: tour.getSteps(),
        currentStep: currentStep.val,

        onBulletClick: (stepNumber: number) => {
          tour.goToStep(stepNumber);
        },

        bullets: tour.getOption("showBullets"),

        buttons: tour.getOption("showButtons"),
        nextLabel: "Next",
        onNextClick: async (e: any) => {
          if (!tour.isLastStep()) {
            await nextStep(tour);
          } else if (
            new RegExp(doneButtonClassName, "gi").test(
              (e.target as HTMLElement).className
            )
          ) {
            await tour
              .callback("complete")
              ?.call(tour, tour.getCurrentStep(), "done");

            await tour.exit();
          }
        },
        prevLabel: tour.getOption("prevLabel"),
        onPrevClick: async () => {
          const currentStep = tour.getCurrentStep();
          if (currentStep !== undefined && currentStep > 0) {
            await previousStep(tour);
          }
        },
        skipLabel: tour.getOption("skipLabel"),
        onSkipClick: async () => {
          if (tour.isLastStep()) {
            await tour
              .callback("complete")
              ?.call(tour, tour.getCurrentStep(), "skip");
          }

          await tour.callback("skip")?.call(tour, tour.getCurrentStep());

          await tour.exit();
        },
        buttonClass: tour.getOption("buttonClass"),
        nextToDone: tour.getOption("nextToDone"),
        doneLabel: tour.getOption("doneLabel"),
        hideNext: tour.getOption("hideNext"),
        hidePrev: tour.getOption("hidePrev"),

        progress: tour.getOption("showProgress"),
        progressBarAdditionalClass: tour.getOption(
          "progressBarAdditionalClass"
        ),

        stepNumbers: tour.getOption("showStepNumbers"),
        stepNumbersOfLabel: tour.getOption("stepNumbersOfLabel"),

        scrollToElement: tour.getOption("scrollToElement"),
        scrollPadding: tour.getOption("scrollPadding"),

        dontShowAgain: tour.getOption("dontShowAgain"),
        onDontShowAgainChange: (e: any) => {
          tour.setDontShowAgain((<HTMLInputElement>e.target).checked);
        },
        dontShowAgainLabel: tour.getOption("dontShowAgainLabel"),
      });

      const disableInteraction = step.val.disableInteraction
        ? DisableInteraction({
            currentStep,
            steps: tour.getSteps(),
            targetElement: tour.getTargetElement(),
            helperElementPadding: tour.getOption("helperElementPadding"),
          })
        : null;

      return div(
        overlayLayer,
        referenceLayer,
        disableInteraction
      );
    }
  );

  van.derive(() => {
    // to clean up the root element when the tour is done
    if (currentStep.val === undefined) {
      opacity.val = 0;

      setTimeout(() => {
        root.remove();
      }, 250);
    }

  });

  setTimeout(() => {
    opacity.val = 1;
  }, 1);

  return root;
};
