import { removeClass, addClass, setClass } from "./className";

describe("className", () => {
  describe("setClass", () => {
    it("should set class name to an element", () => {
      const el = document.createElement("div");
      el.className = "firstClass";

      setClass(el, "secondClass");

      expect(el.className).toBe("secondClass");
    });

    it("should set class name to an SVG element", () => {
      const el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      el.setAttribute("class", "firstClass");

      setClass(el, "secondClass");

      expect(el.getAttribute("class")).toBe("secondClass");
    });
  });

  describe("addClass", () => {
    test("should append when className is empty", () => {
      const el = document.createElement("div");
      addClass(el, "myClass");
      expect(el.className).toBe("myClass");
    });

    test("should append when className is NOT empty", () => {
      const el = document.createElement("div");
      el.className = "firstClass";

      addClass(el, "secondClass");

      expect(el.className).toBe("firstClass secondClass");
    });

    test("should not append duplicate classNames to elements", () => {
      const el = document.createElement("div");
      el.className = "firstClass";

      addClass(el, "firstClass");

      expect(el.className).toBe("firstClass");
    });

    test("should not append duplicate list of classNames to elements", () => {
      const el = document.createElement("div");
      el.className = "firstClass firstClass";

      addClass(el, "firstClass", "firstClass", "firstClass");

      expect(el.className).toBe("firstClass");
    });

    test("should not append duplicate list of classNames to an empty className", () => {
      const el = document.createElement("div");

      addClass(el, "firstClass", "firstClass", "firstClass");

      expect(el.className).toBe("firstClass");
    });

    test("should append lassNames to an SVG", () => {
      const el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      el.setAttribute("class", "firstClass");

      addClass(el, "secondClass", "thirdClass");

      expect(el.getAttribute('class')).toBe("firstClass secondClass thirdClass");
    });

    test("should not append duplicate list of classNames to an empty className of SVG", () => {
      const el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      el.setAttribute("class", "firstClass");

      addClass(el, "firstClass", "firstClass", "firstClass");

      expect(el.getAttribute('class')).toBe("firstClass");
    });
  });

  describe('removeClass', () => {
    it('should do nothing when the class name is not found', () => {
      // Arrange
      const el = document.createElement('div');
      el.className = 'firstClass';

      // Act
      removeClass(el, 'secondClass');

      // Assert
      expect(el.className).toBe('firstClass');
    });

    it('should remove middle class name from an element', () => {
      // Arrange
      const el = document.createElement('div');
      el.className = 'firstClass secondClass thirdClass';

      // Act
      removeClass(el, 'secondClass');

      // Assert
      expect(el.className).toBe('firstClass thirdClass');
    });

    it('should remove the first class name from an element', () => {
      // Arrange
      const el = document.createElement('div');
      el.className = 'firstClass secondClass thirdClass';

      // Act
      removeClass(el, 'firstClass');

      // Assert
      expect(el.className).toBe('secondClass thirdClass');
    });

    it('should remove the last class name from an element', () => {
      // Arrange
      const el = document.createElement('div');
      el.className = 'firstClass secondClass thirdClass';

      // Act
      removeClass(el, 'thirdClass');

      // Assert
      expect(el.className).toBe('firstClass secondClass');
    });

    it('should remove the only class name from an element', () => {
      // Arrange
      const el = document.createElement('div');
      el.className = 'secondClass';

      // Act
      removeClass(el, 'secondClass');

      // Assert
      expect(el.className).toBe('');
    });

    it('should remove the first class name from an SVG element', () => {
      // Arrange
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      el.setAttribute('class', 'firstClass secondClass thirdClass');

      // Act
      removeClass(el, 'firstClass');

      // Assert
      expect(el.getAttribute('class')).toBe('secondClass thirdClass');
    });

    it('should remove middle class name from an SVG element', () => {
      // Arrange
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      el.setAttribute('class', 'firstClass secondClass thirdClass');

      // Act
      removeClass(el, 'secondClass');

      // Assert
      expect(el.getAttribute('class')).toBe('firstClass thirdClass');
    });

    it('should remove the last class name from an SVG element', () => {
      // Arrange
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      el.setAttribute('class', 'firstClass secondClass');

      // Act
      removeClass(el, 'secondClass');

      // Assert
      expect(el.getAttribute('class')).toBe('firstClass');
    });

    it('should remove the only class name from an SVG element', () => {
      // Arrange
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      el.setAttribute('class', 'secondClass');

      // Act
      removeClass(el, 'secondClass');

      // Assert
      expect(el.getAttribute('class')).toBe('');
    });
  });
});
