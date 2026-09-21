import { Hint } from "./hint";
import { HintItem } from "./hintItem";

const makeHintItem = (hintText: string): HintItem => ({
  position: "top",
  hint: hintText,
  hintPosition: "top-middle",
});

describe("onHintDialogClose", () => {
  it("should be called with the hint item when hideHintDialog() closes an open dialog", async () => {
    // Arrange
    const hint = new Hint();
    const item = makeHintItem("first hint");
    hint.addHint(item);

    const onHintDialogClose = jest.fn();
    hint.onHintDialogClose(onHintDialogClose);

    await hint.showHintDialog(0);

    // Act
    hint.hideHintDialog();

    // Assert
    expect(onHintDialogClose).toHaveBeenCalledTimes(1);
    expect(onHintDialogClose).toHaveBeenCalledWith(item);
    expect(hint.getActiveHintSignal().val).toBeUndefined();
  });

  it("should be called when clicking the same hint again toggles its dialog closed", async () => {
    // Arrange
    const hint = new Hint();
    const item = makeHintItem("first hint");
    hint.addHint(item);

    const onHintDialogClose = jest.fn();
    hint.onHintDialogClose(onHintDialogClose);

    await hint.showHintDialog(0);

    // Act - showHintDialog on the same, already-open step toggles it closed
    await hint.showHintDialog(0);

    // Assert
    expect(onHintDialogClose).toHaveBeenCalledTimes(1);
    expect(onHintDialogClose).toHaveBeenCalledWith(item);
  });

  it("should not be called when there is no open dialog", () => {
    // Arrange
    const hint = new Hint();
    const onHintDialogClose = jest.fn();
    hint.onHintDialogClose(onHintDialogClose);

    // Act
    hint.hideHintDialog();

    // Assert
    expect(onHintDialogClose).not.toHaveBeenCalled();
  });

  it("should be called for the previous hint when a different hint's dialog opens afterwards", async () => {
    // Arrange
    const hint = new Hint();
    const itemA = makeHintItem("hint a");
    const itemB = makeHintItem("hint b");
    hint.addHint(itemA);
    hint.addHint(itemB);

    const onHintDialogClose = jest.fn();
    hint.onHintDialogClose(onHintDialogClose);

    await hint.showHintDialog(0);

    // Act - opening a different hint's dialog closes the previous one first
    await hint.showHintDialog(1);

    // Assert
    expect(onHintDialogClose).toHaveBeenCalledTimes(1);
    expect(onHintDialogClose).toHaveBeenCalledWith(itemA);
    expect(hint.getActiveHintSignal().val).toBe(1);
  });

  it("does not clobber a hint opened reentrantly from inside the close callback", async () => {
    // Arrange
    const hint = new Hint();
    const itemA = makeHintItem("hint a");
    const itemB = makeHintItem("hint b");
    const itemC = makeHintItem("hint c");
    hint.addHint(itemA);
    hint.addHint(itemB);
    hint.addHint(itemC);

    // closing A's dialog reentrantly opens C instead of letting B open
    hint.onHintDialogClose(() => {
      if (hint.getActiveHintSignal().val === undefined) {
        hint.showHintDialog(2);
      }
    });

    await hint.showHintDialog(0);

    // Act - this normally would open B (stepId 1), but the reentrant call
    // above already claimed the "opening" slot for C (stepId 2)
    await hint.showHintDialog(1);

    // Assert - C stays active, B's hintClick never overwrote it
    expect(hint.getActiveHintSignal().val).toBe(2);
  });

  it("should throw if the provided callback is not a function", () => {
    // Arrange
    const hint = new Hint();

    // Act & Assert
    expect(() => hint.onHintDialogClose("not a function" as any)).toThrow();
  });
});
