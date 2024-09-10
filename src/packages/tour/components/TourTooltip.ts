import { Tooltip, type TooltipProps } from "../../tooltip/tooltip";
import dom, { PropValueOrDerived } from "../../dom";
import {
  activeClassName,
  bulletsClassName,
  disabledButtonClassName,
  doneButtonClassName,
  dontShowAgainClassName,
  fullButtonClassName,
  helperNumberLayerClassName,
  hiddenButtonClassName,
  nextButtonClassName,
  previousButtonClassName,
  progressBarClassName,
  progressClassName,
  skipButtonClassName,
  tooltipButtonsClassName,
  tooltipHeaderClassName,
  tooltipTextClassName,
  tooltipTitleClassName,
} from "../classNames";
import { TourStep } from "../steps";
import { dataStepNumberAttribute } from "../dataAttributes";
import scrollParentToElement from "../../../util/scrollParentToElement";
import scrollTo from "../../../util/scrollTo";

const { h1, div, input, label, ul, li, a } = dom.tags;

const DontShowAgain = ({
  dontShowAgainLabel,
  onDontShowAgainChange,
}: {
  dontShowAgainLabel: string;
  onDontShowAgainChange: (checked: boolean) => void;
}) => {
  return div({ className: dontShowAgainClassName }, [
    input({
      type: "checkbox",
      id: dontShowAgainClassName,
      name: dontShowAgainClassName,
      onchange: (e: any) => {
        onDontShowAgainChange((e.target as HTMLInputElement).checked);
      },
    }),
    label({ for: dontShowAgainClassName }, dontShowAgainLabel),
  ]);
};

const Bullets = ({
  step,
  steps,
  onBulletClick,
}: {
  step: TourStep;
  steps: TourStep[];
  onBulletClick: (stepNumber: number) => void;
}): HTMLElement => {
  return div({ className: bulletsClassName }, [
    ul({ role: "tablist" }, [
      ...steps.map(({ step: stepNumber }) => {
        const innerLi = li(
          {
            role: "presentation",
          },
          [
            a({
              role: "tab",
              className: () =>
                `${step.step === stepNumber ? activeClassName : ""}`,
              onclick: (e: any) => {
                const stepNumberAttribute = (
                  e.target as HTMLElement
                ).getAttribute(dataStepNumberAttribute);
                if (!stepNumberAttribute) return;

                onBulletClick(parseInt(stepNumberAttribute, 10));
              },
              innerHTML: "&nbsp;",
              [dataStepNumberAttribute]: stepNumber,
            }),
          ]
        );

        return innerLi;
      }),
    ]),
  ]);
};

const ProgressBar = ({
  steps,
  currentStep,
  progressBarAdditionalClass,
}: {
  steps: TourStep[];
  currentStep: number;
  progressBarAdditionalClass: string;
}) => {
  const progress = ((currentStep + 1) / (steps.length)) * 100;

  return div({ className: progressClassName }, [
    div({
      className: `${progressBarClassName} ${
        progressBarAdditionalClass ? progressBarAdditionalClass : ""
      }`,
      role: "progress",
      "aria-valuemin": "0",
      "aria-valuemax": "100",
      "aria-valuenow": () => progress.toString(),
      style: `width:${progress}%;`,
    }),
  ]);
};

const StepNumber = ({
  step,
  steps,
  stepNumbersOfLabel,
}: {
  step: TourStep;
  steps: TourStep[];
  stepNumbersOfLabel: string;
}) => {
  return div({ className: helperNumberLayerClassName }, [
    `${step.step} ${stepNumbersOfLabel} ${steps.length}`,
  ]);
};

const Button = ({
  label,
  onClick,
  disabled,
  className,
}: {
  label: string;
  onClick: (e: any) => void;
  disabled?: PropValueOrDerived;
  className?: PropValueOrDerived;
}) => {
  return a(
    {
      role: "button",
      tabIndex: 0,
      ariaDisabled: disabled ?? false,
      onclick: onClick,
      className: className ?? "",
    },
    [label]
  );
};

const NextButton = ({
  steps,
  currentStep,

  nextLabel,
  doneLabel,

  hideNext,
  hidePrev,
  nextToDone,
  onClick,
  buttonClass,
}: {
  steps: TourStep[];
  currentStep: number;

  nextLabel: string;
  doneLabel: string;

  hideNext: boolean;
  hidePrev: boolean;
  nextToDone: boolean;
  onClick: (e: any) => void;
  buttonClass: string;
}) => {
  const isFullButton = currentStep === 0 && steps.length > 1 && hidePrev;
  const isLastStep = currentStep === steps.length - 1 || steps.length === 1;

  const isDisabled = dom.derive(() => {
    // when the current step is the last one or there is only one step to show
    return isLastStep && !hideNext && !nextToDone;
  });

  const isDoneButton = dom.derive(() => {
    return isLastStep && !hideNext && nextToDone;
  });

  const nextButton = Button({
    label: isDoneButton.val ? doneLabel : nextLabel,
    onClick,
    className: () => {
      const classNames = [buttonClass, nextButtonClassName];

      if (isDoneButton.val) {
        classNames.push(doneButtonClassName);
      }

      if (isDisabled.val) {
        classNames.push(disabledButtonClassName);
      }

      if (isFullButton) {
        classNames.push(fullButtonClassName);
      }

      return classNames.filter(Boolean).join(" ");
    },
  });

  // wait for the button to be rendered
  setTimeout(() => {
    nextButton.focus();
  }, 1);

  return nextButton;
};

const PrevButton = ({
  label,
  steps,
  currentStep,
  hidePrev,
  hideNext,
  onClick,
  buttonClass,
}: {
  label: string;
  steps: TourStep[];
  currentStep: number;
  hidePrev: boolean;
  hideNext: boolean;
  onClick: (e: any) => void;
  buttonClass: string;
}) => {
  const isFirstStep = currentStep === 0 && steps.length > 1;
  // when the current step is the first one and there are more steps to show
  const isDisabled = isFirstStep && !hidePrev;
  const isHidden = isFirstStep && hidePrev;
  // when the current step is the last one or there is only one step to show
  const isFullButton =
    (currentStep === steps.length - 1 || steps.length === 1) && hideNext;

  return Button({
    label,
    onClick,
    disabled: isDisabled,
    className: () => {
      const classNames = [buttonClass, previousButtonClassName];

      if (isFullButton) {
        classNames.push(fullButtonClassName);
      }

      if (isDisabled) {
        classNames.push(disabledButtonClassName);
      }

      if (isHidden) {
        classNames.push(hiddenButtonClassName);
      }

      return classNames.filter(Boolean).join(" ");
    },
  });
};

const Buttons = ({
  steps,
  currentStep,

  buttonClass,

  nextToDone,
  doneLabel,

  hideNext,
  nextLabel,
  onNextClick,

  hidePrev,
  prevLabel,
  onPrevClick,
}: {
  steps: TourStep[];
  currentStep: number;

  buttonClass: string;

  nextToDone: boolean;
  doneLabel: string;

  hideNext: boolean;
  nextLabel: string;
  onNextClick: (e: any) => void;

  hidePrev: boolean;
  prevLabel: string;
  onPrevClick: (e: any) => void;
}) => {
  return div(
    { className: tooltipButtonsClassName },
    steps.length > 1
      ? PrevButton({
          label: prevLabel,
          steps,
          currentStep,
          hidePrev,
          hideNext,
          onClick: onPrevClick,
          buttonClass,
        })
      : null,
    NextButton({
      currentStep,
      steps,
      doneLabel,
      nextLabel,
      onClick: onNextClick,
      hideNext,
      hidePrev,
      nextToDone,
      buttonClass,
    })
  );
};

const Header = ({
  title,

  skipLabel,
  onSkipClick,
}: {
  title: string;

  skipLabel: string;
  onSkipClick: (e: any) => void;
}) => {
  return div({ className: tooltipHeaderClassName }, [
    h1({ className: tooltipTitleClassName }, title),
    Button({
      className: skipButtonClassName,
      label: skipLabel,
      onClick: onSkipClick,
    }),
  ]);
};

const scroll = ({
  step,
  tooltip,
  scrollToElement,
  scrollPadding,
}: {
  step: TourStep;
  tooltip: HTMLElement;
  scrollToElement: boolean;
  scrollPadding: number;
}) => {
  // when target is within a scrollable element
  scrollParentToElement(scrollToElement, step.element as HTMLElement);

  // change the scroll of the window, if needed
  scrollTo(
    scrollToElement,
    step.scrollTo,
    scrollPadding,
    step.element as HTMLElement,
    tooltip
  );
};

export type TourTooltipProps = Omit<
  TooltipProps,
  "hintMode" | "position" | "element"
> & {
  step: TourStep;
  steps: TourStep[];
  currentStep: number;

  bullets: boolean;
  onBulletClick: (stepNumber: number) => void;

  buttons: boolean;
  nextLabel: string;
  onNextClick: (e: any) => void;
  prevLabel: string;
  onPrevClick: (e: any) => void;
  skipLabel: string;
  onSkipClick: (e: any) => void;
  buttonClass: string;
  nextToDone: boolean;
  doneLabel: string;
  hideNext: boolean;
  hidePrev: boolean;

  progress: boolean;
  progressBarAdditionalClass: string;

  stepNumbers: boolean;
  stepNumbersOfLabel: string;

  scrollToElement: boolean;
  scrollPadding: number;

  dontShowAgain: boolean;
  dontShowAgainLabel: string;
  onDontShowAgainChange: (checked: boolean) => void;
};

export const TourTooltip = ({
  step,
  currentStep,
  steps,

  onBulletClick,

  bullets,

  buttons,
  nextLabel,
  onNextClick,
  prevLabel,
  onPrevClick,
  skipLabel,
  onSkipClick,
  buttonClass,
  nextToDone,
  doneLabel,
  hideNext,
  hidePrev,

  progress,
  progressBarAdditionalClass,

  stepNumbers,
  stepNumbersOfLabel,

  scrollToElement,
  scrollPadding,

  dontShowAgain,
  onDontShowAgainChange,
  dontShowAgainLabel,
  ...props
}: TourTooltipProps) => {
  const children = [];
  const title = step.title;
  const text = step.intro;
  const position = step.position;

  children.push(Header({ title, skipLabel, onSkipClick }));

  children.push(div({ className: tooltipTextClassName }, text));

  if (dontShowAgain) {
    children.push(DontShowAgain({ dontShowAgainLabel, onDontShowAgainChange }));
  }

  if (bullets) {
    children.push(Bullets({ step, steps, onBulletClick }));
  }

  if (progress) {
    children.push(
      ProgressBar({ steps, currentStep, progressBarAdditionalClass })
    );
  }

  if (stepNumbers) {
    children.push(StepNumber({ step, steps, stepNumbersOfLabel }));
  }

  if (buttons) {
    children.push(
      Buttons({
        steps,
        currentStep,

        nextLabel: nextLabel,
        onNextClick: onNextClick,

        prevLabel: prevLabel,
        onPrevClick: onPrevClick,

        buttonClass,
        nextToDone,
        doneLabel,
        hideNext,
        hidePrev,
      })
    );
  }

  const tooltip = Tooltip(
    {
      ...props,
      element: step.element as HTMLElement,
      hintMode: false,
      position,
    },
    children
  );

  scroll({
    step,
    tooltip,
    scrollToElement: scrollToElement,
    scrollPadding: scrollPadding,
  });

  return tooltip;
};
