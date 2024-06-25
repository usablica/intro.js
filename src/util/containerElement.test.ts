import { getContainerElement } from "./containerElement";
import * as queryElement from "./queryElement";

describe("containerElement", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getContainerElement", () => {
    it("should return document.body when arg is undefined", () => {
      // Arrange, Act
      const container = getContainerElement(undefined);

      // Assert
      expect(container).toBe(document.body);
    });

    it("should return HTMLElement when arg is an element", () => {
      // Arrange
      const stubElement = document.createElement("div");

      // Act
      const container = getContainerElement(stubElement);

      // Assert
      expect(container).toBe(stubElement);
    });

    it("should query element when arg is a string", () => {
      // Arrange
      const stubElement = document.createElement("div");
      jest.spyOn(queryElement, "getElement").mockReturnValue(stubElement);

      // Act
      const container = getContainerElement("div");

      // Assert
      expect(container).toBe(stubElement);
    });

    it("should throw exception when selector is not found", () => {
      // Arrange
      jest.spyOn(queryElement, "queryElement").mockReturnValue(null);

      // Act, Assert
      expect(() => getContainerElement("div")).toThrow();
    });
  });
});
