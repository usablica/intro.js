import van from "../dom/van";
import { Tour } from "../tour";
import { doneButtonClassName, tooltipReferenceLayerClassName } from "../tour/classNames";
import { setPositionRelativeToStep } from "../tour/position";
import { nextStep, previousStep } from "../tour/steps";
import { TourTooltip } from "../tour/tourTooltip";

const { div } = van.tags;

export type ReferenceLayerProps = {
    tour: Tour
};

export const ReferenceLayer = ({
    tour
}: ReferenceLayerProps) => {
  const currentStep = tour.currentStepSignal;
  const steps = tour.getSteps();
  const targetElement = tour.getTargetElement();
  const helperElementPadding = tour.getOption("helperElementPadding");

  const step = van.derive(() =>
    currentStep.val !== undefined ? steps[currentStep.val] : null
  );

  return () => {
    if (!step.val) {
      return null;
    }

    const referenceLayer = div({
      className: tooltipReferenceLayerClassName,
    }, TourTooltip({
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
    }));

    setPositionRelativeToStep(
      targetElement,
      referenceLayer,
      step.val,
      helperElementPadding
    );

    return referenceLayer;
  };
};
