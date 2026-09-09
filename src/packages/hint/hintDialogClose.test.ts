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

  it("should not be called again when a different hint's dialog opens afterwards", async () => {
    // Arrange
    const hint = new Hint();
    const itemA = makeHintItem("hint a");
    const itemB = makeHintItem("hint b");
    hint.addHint(itemA);
    hint.addHint(itemB);

    const onHintDialogClose = jest.fn();
    hint.onHintDialogClose(onHintDialogClose);

    await hint.showHintDialog(0);

    // Act - opening a different hint's dialog implicitly switches the
    // active step, it doesn't go through hideHintDialog()
    await hint.showHintDialog(1);

    // Assert
    expect(onHintDialogClose).not.toHaveBeenCalled();
    expect(hint.getActiveHintSignal().val).toBe(1);
  });

  it("should throw if the provided callback is not a function", () => {
    // Arrange
    const hint = new Hint();

    // Act & Assert
    expect(() => hint.onHintDialogClose("not a function" as any)).toThrow();
  });
});
