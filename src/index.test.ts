import { Tour } from "./packages/tour";
import introJs from "./index";
import { Hint } from "./packages/hint";

describe("index", () => {
  it("should create a new instance of Tour", () => {
    // Arrange
    const stubElement = document.createElement("div");
    jest.spyOn(document, "createElement").mockReturnValue(stubElement);

    // Act
    const tourInstance = introJs.tour(stubElement);

    // Assert
    expect(tourInstance).toBeInstanceOf(Tour);
  });

  it("should create a new instance of Hint", () => {
    // Arrange
    const stubElement = document.createElement("div");
    jest.spyOn(document, "createElement").mockReturnValue(stubElement);

    // Act
    const hintInstance = introJs.hint(stubElement);

    // Assert
    expect(hintInstance).toBeInstanceOf(Hint);
  });
});
