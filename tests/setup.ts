import "regenerator-runtime/runtime";
import { DOMWindow, JSDOM } from "jsdom";
// @ts-ignore
import * as matchers from "jest-extended";
import expect from "expect";

export interface Global {
  document: Document;
  window: DOMWindow;
  Element: typeof Element;
  SVGElement: typeof SVGElement;
}

declare var global: Global;

expect.extend(matchers);

const dom = new JSDOM();
global.document = dom.window.document;
global.window = dom.window;
global.Element = dom.window.Element;
global.SVGElement = dom.window.SVGElement;
