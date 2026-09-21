import { TourRoot } from "./TourRoot";
import { ReferenceLayer } from "./ReferenceLayer";

jest.mock("./OverlayLayer", () => ({
  OverlayLayer: jest.fn(() => "OverlayLayer"),
}));
jest.mock("./DisableInteraction", () => ({
  DisableInteraction: jest.fn(() => "DisableInteraction"),
}));
jest.mock("./ReferenceLayer", () => ({
  ReferenceLayer: jest.fn(() => "ReferenceLayer"),
}));
jest.mock("../steps", () => ({ nextStep: jest.fn(), previousStep: jest.fn() }));

jest.useFakeTimers();

describe("TourRoot", () => {
  let tour: any;

  beforeEach(() => {
    tour = {
      getCurrentStepSignal: jest.fn(() => ({ val: 0 })),
      getRefreshesSignal: jest.fn(() => ({ val: 0 })),
      getSteps: jest.fn(() => [{ disableInteraction: false }]),
      getTargetElement: jest.fn(() => "targetElement"),
      getOption: jest.fn((option: keyof typeof Option) => {
        const options = {
          highlightClass: "highlight",
          overlayOpacity: 0.5,
          helperElementPadding: 10,
          exitOnOverlayClick: true,
          positionPrecedence: ["top", "bottom"],
          autoPosition: true,
          showStepNumbers: true,
          showBullets: true,
          showButtons: true,
          tooltipClass: "tooltip",
          nextToDone: false,
          showProgress: true,
          scrollToElement: true,
          scrollPadding: 20,
          dontShowAgain: false,
        };
        return options[option];
      }),
      exit: jest.fn(),
      goToStep: jest.fn(),
      isLastStep: jest.fn(() => false),
      getCurrentStep: jest.fn(() => 0),
      callback: jest.fn(() => jest.fn()),
      setDontShowAgain: jest.fn(),
    };
  });

  it("renders correctly and initializes state", () => {
    // Arrange
    // Act
    const component = TourRoot({ tour });

    // Assert
    expect(component).toBeDefined();
  });

  describe("onSkipClick", () => {
    const getOnSkipClick = () => {
      TourRoot({ tour });
      const props = (ReferenceLayer as jest.Mock).mock.calls[0][0];
      return props.onSkipClick as () => Promise<void>;
    };

    it("should exit the tour when the skip callback does not return false", async () => {
      // Arrange
      tour.callback = jest.fn(() => jest.fn(() => undefined));
      const onSkipClick = getOnSkipClick();

      // Act
      await onSkipClick();

      // Assert
      expect(tour.exit).toHaveBeenCalledTimes(1);
    });

    it("should not exit the tour when the skip callback returns false", async () => {
      // Arrange
      tour.callback = jest.fn(() => jest.fn(() => false));
      const onSkipClick = getOnSkipClick();

      // Act
      await onSkipClick();

      // Assert
      expect(tour.exit).not.toHaveBeenCalled();
    });

    it("should call the complete callback with 'skip' when exiting on the last step", async () => {
      // Arrange
      tour.isLastStep = jest.fn(() => true);
      const completeCallback = jest.fn();
      tour.callback = jest.fn((name: string) =>
        name === "skip" ? jest.fn(() => undefined) : completeCallback
      );
      const onSkipClick = getOnSkipClick();

      // Act
      await onSkipClick();

      // Assert
      expect(completeCallback).toHaveBeenCalledWith(0, "skip");
      expect(tour.exit).toHaveBeenCalledTimes(1);
    });

    it("should not call the complete callback when the skip is cancelled on the last step", async () => {
      // Arrange
      tour.isLastStep = jest.fn(() => true);
      const completeCallback = jest.fn();
      tour.callback = jest.fn((name: string) =>
        name === "skip" ? jest.fn(() => false) : completeCallback
      );
      const onSkipClick = getOnSkipClick();

      // Act
      await onSkipClick();

      // Assert
      expect(completeCallback).not.toHaveBeenCalled();
      expect(tour.exit).not.toHaveBeenCalled();
    });
  });
});
