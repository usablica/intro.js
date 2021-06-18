import { JSDOM } from "jsdom";

const dom = new JSDOM();
global.document = dom.window.document;
global.window = dom.window;
global.Element = dom.window.Element;
global.SVGElement = dom.window.SVGElement;
