import { setOption, setOptions } from "./option";

describe("option", () => {
  describe("setOption", () => {
    it("should set option", () => {
      // Arrange
      const mockOption = {
        key1: "value1",
      };

      // Act
      setOption(mockOption, "key1", "newValue1");

      // Assert
      expect(mockOption.key1).toBe("newValue1");
    });
  });

  describe("setOptions", () => {
    it("should set options", () => {
      // Arrange
      const mockOption = {
        key1: "value1",
        key2: "value2",
      };

      // Act
      setOptions(mockOption, { key2: "newValue2", key1: "newValue1" });

      // Assert
      expect(mockOption.key1).toBe("newValue1");
      expect(mockOption.key2).toBe("newValue2");
    });
  });
});
