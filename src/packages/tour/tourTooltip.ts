import { Tooltip, type TooltipProps } from "../tooltip/tooltip";
import van, { PropValueOrDerived, State } from "../dom/van";
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
import getOffset from "../../util/getOffset";

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
  currentStep,
  onBulletClick,
}: {
  steps: TourStep[];
  currentStep: State<number>;
  onBulletClick: (stepNumber: number) => void;
}): HTMLElement => {

  const step = van.derive(() => steps[currentStep.val!]);

  return div({ className: bulletsClassName }, [
    ul({ role: "tablist" }, [
      ...steps.map(({ step: stepNumber }) => {
        const innerLi = li(
          {
            role: "presentation"
          },
          [
            a({
              role: "tab",
                className: () =>
                `${step.val!.step === stepNumber ? activeClassName : ""}`,
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
    currentStep: State<number>;
    progressBarAdditionalClass: string;
}) => {
    const progress = van.derive(() => ((currentStep.val!) / steps.length) * 100);

    return div({ className: progressClassName }, [
        div({
            className: `${progressBarClassName} ${progressBarAdditionalClass ? progressBarAdditionalClass : ""}`,
            "role": "progress",
            "aria-valuemin": "0",
            "aria-valuemax": "100",
            "aria-valuenow": () => progress.toString(),
            style: `width:${progress}%;`,
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
  disabled,
  className
}: {
  label: string;
  onClick: (e: any) => void;
  disabled?: PropValueOrDerived
  className?: PropValueOrDerived
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
  buttonClass
}: {
  steps: TourStep[];
  currentStep: State<number>;

  nextLabel: string;
  doneLabel: string;

  hideNext: boolean;
  hidePrev: boolean;
  nextToDone: boolean;
  onClick: (e: any) => void;
  buttonClass: string;
}) => {
    const isFullButton = van.derive(
      () => currentStep.val === 0 && steps.length > 1 && hidePrev
    );

    const isLastStep = van.derive(
      () => currentStep.val === steps.length - 1 || steps.length === 1
    );

    const isDisabled = van.derive(() => {
      // when the current step is the last one or there is only one step to show
      return (
        isLastStep.val &&
        !hideNext &&
        !nextToDone
      );
    });

    const isDoneButton = van.derive(() => {
      return (
        isLastStep.val &&
        !hideNext &&
        nextToDone
      );
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

        if (isFullButton.val) {
          classNames.push(fullButtonClassName);
        }

        return classNames.filter(Boolean).join(" ");
      },
    });

    nextButton.focus()

    return nextButton;
}

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
  currentStep: State<number>;
  hidePrev: boolean;
  hideNext: boolean;
  onClick: (e: any) => void;
  buttonClass: string;
}) => {
  const isDisabled = van.derive(() => {
    // when the current step is the first one and there are more steps to show
    return currentStep.val === 0 && steps.length > 1 && !hidePrev;
  });

  const isFullButton = van.derive(() => {
    // when the current step is the last one or there is only one step to show
    return (
      (currentStep.val === steps.length - 1 || steps.length === 1) && hideNext
    );
  });

  return Button({
    label,
    onClick,
    disabled: () => isDisabled.val,
    className: () => {
      const classNames = [buttonClass, previousButtonClassName];
      if (isFullButton) {
        classNames.push(fullButtonClassName);
      }

      if (isDisabled.val) {
        classNames.push(disabledButtonClassName);
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
  currentStep: State<number>;

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
  const isLastStep = van.derive(
    () => currentStep.val === steps.length - 1 || steps.length === 1
  );

  const isFirstStep = van.derive(
    () => currentStep.val === 0 && steps.length > 1
  );

  return div(
    { className: tooltipButtonsClassName },
    () =>
      isFirstStep.val && hidePrev
        ? null
        : PrevButton({
            label: prevLabel,
            steps,
            currentStep,
            hidePrev,
            hideNext,
            onClick: onPrevClick,
            buttonClass,
          }),
    () =>
      isLastStep.val && hideNext
        ? null
        : NextButton({
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
    Button({ className: skipButtonClassName, label: skipLabel, onClick: onSkipClick }),
  ]);
};

export type TourTooltipProps = Omit<TooltipProps, "hintMode" | "position" | "targetOffset"> & {
  steps: TourStep[];
  currentStep: State<number>;

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
  currentStep,

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

  dontShowAgain,
  onDontShowAgainChange,
  dontShowAgainLabel,
  ...props
}: TourTooltipProps) => {
  const children = [];

  const step = van.derive(() => steps[currentStep.val!]);
  const title = van.derive(() => step.val!.title);
  const text = van.derive(() => step.val!.intro);
  const position = van.derive(() => step.val!.position);
  const targetOffset = van.derive(() => getOffset(step.val!.element as HTMLElement));

  children.push(Header({ title: title.val!, skipLabel, onSkipClick }));

  children.push(
      div({ className: tooltipTextClassName }, p(text)),
);

  if (dontShowAgain) {
    children.push(DontShowAgain({ dontShowAgainLabel, onDontShowAgainChange }));
  }

  if (bullets) {
    children.push(Bullets({ steps, currentStep, onBulletClick }));
  }

  if (progress) {
    children.push(
      ProgressBar({ steps, currentStep, progressBarAdditionalClass })
    );
  }

  if (stepNumbers) {
    children.push(StepNumber({ step: step.val!, steps, stepNumbersOfLabel }));
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
      position,
      targetOffset
    },
    children
  );
};
