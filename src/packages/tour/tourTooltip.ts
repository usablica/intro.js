import { Tooltip, type TooltipProps } from "../tooltip/tooltip";
import van from "../dom/van";
import {
  activeClassName,
  bulletsClassName,
  disabledButtonClassName,
  doneButtonClassName,
  dontShowAgainClassName,
  fullButtonClassName,
  helperNumberLayerClassName,
  nextButtonClassName,
  previousButtonClassName,
  progressBarClassName,
  progressClassName,
  skipButtonClassName,
  tooltipButtonsClassName,
  tooltipHeaderClassName,
  tooltipTextClassName,
  tooltipTitleClassName,
} from "./classNames";
import { TourStep } from "./steps";
import { dataStepNumberAttribute } from "./dataAttributes";

const { h1, div, input, label, ul, li, a, p } = van.tags;

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
  steps,
  step,
  onBulletClick,
}: {
  steps: TourStep[];
  step: TourStep;
  onBulletClick: (stepNumber: number) => void;
}): HTMLElement => {
  return div({ className: bulletsClassName }, [
    ul({ role: "tablist" }, [
      ...steps.map(({ step: stepNumber }) => {
        const innerLi = li(
          {
            role: "presentation",
            className: `${
              step.step === stepNumber
            } ? ${activeClassName} : ""`,
          },
          [
            a({
              role: "tab",
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
    progressBarAdditionalClass
}: {
    steps: TourStep[];
    currentStep: number;
    progressBarAdditionalClass: string;
}) => {
    const progress = ((currentStep) / steps.length) * 100;

    return div({ className: progressClassName }, [
        div({
            className: `${progressBarClassName} ${progressBarAdditionalClass ? progressBarAdditionalClass : ""}`,
            "role": "progress",
            "aria-valuemin": "0",
            "aria-valuemax": "100",
            "aria-valuenow": () => progress.toString(),
            style: () => `width:${progress}%;`,
        }),
    ]);
}

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
  className
}: {
  label: string;
  onClick: (e: any) => void;
  className?: string
}) => {
  return a(
    {
      role: "button",
      tabIndex: 0,
      onclick: onClick,
      className: className ?? "",
    },
    [label]
  );
};

const NextButton = ({
  label,
  onClick,
  isDisabled,
  isFullButton,
  isDoneButton,
  buttonClass
}: {
  label: string;
  onClick: (e: any) => void;
  isFullButton: boolean;
  isDisabled: boolean;
  // next button can be a done button as well
  isDoneButton: boolean;
  buttonClass: string;
}) => {
    const classNames = [buttonClass];

    if (isDoneButton) {
        classNames.push(doneButtonClassName);
    } else {
      classNames.push(nextButtonClassName);
    }

    if (isDisabled) {
        classNames.push(disabledButtonClassName);
    }

    if (isFullButton) {
        classNames.push(fullButtonClassName);
    }

    return Button({ label, onClick, className: classNames.filter(Boolean).join(" ") });
}

const PrevButton = ({
  label,
  onClick,
  isFullButton,
  isDisabled,
  buttonClass
}: {
  label: string;
  onClick: (e: any) => void;
  isFullButton: boolean;
  isDisabled: boolean;
  buttonClass: string;
}) => {
    const classNames = [buttonClass, previousButtonClassName];

    if (isFullButton) {
        classNames.push(fullButtonClassName);
    }

    if (isDisabled) {
        classNames.push(disabledButtonClassName);
    }

    return Button({ label, onClick, className: classNames.filter(Boolean).join(" ") });
}

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
  const children: ChildNode[] = [];

  let shouldShowPrev = steps.length > 1;
  let isPrevButtonDisabled = false;
  let isPrevButtonFull = false;

  let shouldShowNext = true;
  let shouldRenderNextAsDone = false;
  let isNextButtonFull = false;
  let isNextButtonDisabled = false;

  // when the current step is the first one and there are more steps to show
  if (currentStep === 0 && steps.length > 1) {
    if (hidePrev) {
      shouldShowPrev = false;
      isNextButtonFull = true;
    } else {
      isPrevButtonDisabled = true
    }
  } else if (currentStep === steps.length - 1 || steps.length === 1) {
    // when the current step is the last one or there is only one step to show
    if (hideNext) {
      shouldShowNext = false;
      isPrevButtonFull = true;
    } else {
      if (nextToDone) {
        shouldRenderNextAsDone = true;
      } else {
        isNextButtonDisabled = true;
      }
    }
  }

  // in order to prevent always displaying the previous button
  if (shouldShowPrev) {
    children.push(
      PrevButton({
        label: prevLabel,
        onClick: onPrevClick,
        isDisabled: isPrevButtonDisabled,
        isFullButton: isPrevButtonFull,
        buttonClass,
      })
    );
  }

  if (shouldShowNext) {
    children.push(
      NextButton({
        label: shouldRenderNextAsDone ? doneLabel : nextLabel,
        isDoneButton: shouldRenderNextAsDone,
        onClick: onNextClick,
        isDisabled: isNextButtonDisabled,
        isFullButton: isNextButtonFull,
        buttonClass,
      })
    );
  }

  return div({ className: tooltipButtonsClassName }, children);
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
    Button({ className: skipButtonClassName, label: skipLabel, onClick: onSkipClick }),
  ]);
};

export type TourTooltipProps = Omit<TooltipProps, "hintMode"> & {
  title: string;
  text: string;

  steps: TourStep[];
  step: TourStep;
  currentStep: number;

  bullets: boolean;
  onBulletClick: (stepNumber: number) => void;

  buttons: boolean;
  nextLabel: string;
  onNextClick: (e: any) => void;
  prevLabel: string;
  onPrevClick: (e: any) => void;
  skipLabel: string,
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
  
  dontShowAgain: boolean;
  dontShowAgainLabel: string;
  onDontShowAgainChange: (checked: boolean) => void;
};

export const TourTooltip = ({
  steps,
  step,
  currentStep,

  onBulletClick,

  title,
  text,

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

  dontShowAgain,
  onDontShowAgainChange,
  dontShowAgainLabel,
  ...props
}: TourTooltipProps) => {
  const children = [];

  children.push(Header({ title, skipLabel, onSkipClick }));

  children.push(
      div({ className: tooltipTextClassName }, p(text)),
);

  if (dontShowAgain) {
    children.push(DontShowAgain({ dontShowAgainLabel, onDontShowAgainChange }));
  }

  if (bullets) {
    children.push(Bullets({ steps, step, onBulletClick }));
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

  return Tooltip(
    {
      ...props,
      hintMode: false,
    },
    children
  );
};
