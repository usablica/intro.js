import van from "../dom/van";
import { ReferenceLayer } from "./referenceLayer";
import { HelperLayer } from "./helperLayer";
import { Tour } from "./tour";
import { DisableInteraction } from "./disableInteraction";
import { OverlayLayer } from "./overlayLayer";
import { nextStep, previousStep } from "./steps";
import { doneButtonClassName } from "./classNames";

const { div } = van.tags;

export type TourRootProps = {
  tour: Tour;
};

export const TourRoot = ({ tour }: TourRootProps) => {
  const currentStep = tour.currentStepSignal;
  const steps = tour.getSteps();
  const step = van.derive(() =>
    currentStep.val !== undefined ? steps[currentStep.val] : null
  );

  return () => {
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

    const helperLayer = HelperLayer({
      step: step.val,
      targetElement: tour.getTargetElement(),
      tourHighlightClass: tour.getOption("highlightClass"),
      overlayOpacity: tour.getOption("overlayOpacity"),
      helperLayerPadding: tour.getOption("helperElementPadding"),
    });

    const referenceLayer = ReferenceLayer({
      step: step.val,
      targetElement: tour.getTargetElement(),
      helperElementPadding: tour.getOption("helperElementPadding"),

      positionPrecedence: tour.getOption("positionPrecedence"),
      autoPosition: tour.getOption("autoPosition"),
      showStepNumbers: tour.getOption("showStepNumbers"),

      steps: tour.getSteps(),
      currentStep: tour.currentStepSignal,

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
        if (tour.getCurrentStep() > 0) {
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
      progressBarAdditionalClass: tour.getOption("progressBarAdditionalClass"),

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
          currentStep: tour.currentStepSignal,
          steps: tour.getSteps(),
          targetElement: tour.getTargetElement(),
          helperElementPadding: tour.getOption("helperElementPadding"),
        })
      : null;

    return div(
      { className: "introjs-tour" },
      overlayLayer,
      helperLayer,
      referenceLayer,
      disableInteraction
    );
  };
};
