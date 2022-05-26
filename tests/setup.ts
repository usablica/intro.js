import { DOMWindow, JSDOM } from "jsdom";

export interface Global {
  document: Document;
  window: DOMWindow;
  Element: typeof Element;
  SVGElement: typeof SVGElement;
}

declare var global: Global;

const dom = new JSDOM();
global.document = dom.window.document;
global.window = dom.window;
global.Element = dom.window.Element;
global.SVGElement = dom.window.SVGElement;
