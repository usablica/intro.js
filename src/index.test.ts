import { Tour } from "./packages/tour";
import introJs from "./index";

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
});
