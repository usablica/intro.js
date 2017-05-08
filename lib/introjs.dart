@JS()
library introjs;

import "dart:html";
import "dart:async";

import "package:js/js.dart";

/**
 * Barebones introJs wrapper class
 *
 * Ideally would be named _introJs but that's currently impossible due to https://github.com/dart-lang/sdk/issues/27537
 */
@JS("introJs")
class InternalIntroJs {
  external InternalIntroJs([String element]);

  external InternalIntroJs clone();
  external InternalIntroJs setOption(String option, var value);
  external InternalIntroJs setOptions(Options options);
  external InternalIntroJs start();
  external InternalIntroJs goToStep(int step);
  external InternalIntroJs nextStep();
  external InternalIntroJs previousStep();
  external InternalIntroJs exit();
  external InternalIntroJs refresh();
  external InternalIntroJs onbeforechange(
      void providedCallback(Element element));
  external InternalIntroJs onchange(void providedCallback(Element element));
  external InternalIntroJs onafterchange(
      void providedCallback(Element element));
  external InternalIntroJs oncomplete(void providedCallback());
  external InternalIntroJs onhintsadded(void providedCallback());
  external InternalIntroJs onhintclick(
      void providedCallback(Element hintElement, var item, int stepId));
  external InternalIntroJs onhintclose(void providedCallback(int stepId));
  external InternalIntroJs onexit(void providedCallback());
  external InternalIntroJs addHints();
  external InternalIntroJs hideHint(int stepId);
  external InternalIntroJs hideHints();
}

class HintAddedEvent {
  Element hintElement;
  Hint item;
  int stepId;

  HintAddedEvent(this.hintElement, this.item, this.stepId);
}

/**
 * Wraps [InternalIntroJs] and offers a Dart friendly interface
 */
class IntroJs {
  InternalIntroJs _jsObj;

  IntroJs([String element]) {
    if (element != null) {
      _jsObj = new InternalIntroJs(element);
    } else {
      _jsObj = new InternalIntroJs();
    }
  }

  void setOption(String option, var value) {
    _jsObj.setOption(option, value);
  }

  void setOptions(Options options) {
    _jsObj.setOptions(options);
  }

  void start() {
    _jsObj.start();
  }

  void goToStep(int step) {
    _jsObj.goToStep(step);
  }

  void nextStep() {
    _jsObj.nextStep();
  }

  void previousStep() {
    _jsObj.previousStep();
  }

  void exit() {
    _jsObj.exit();
  }

  void refresh() {
    _jsObj.refresh();
  }

  Stream<Element> get onBeforeChange {
    StreamController<Element> controller = new StreamController<Element>();
    _jsObj.onbeforechange(
        allowInterop((Element element) => controller.add(element)));
    return controller.stream;
  }

  Stream<Element> get onChange {
    StreamController<Element> controller = new StreamController<Element>();
    _jsObj.onchange(allowInterop((Element element) => controller.add(element)));
    return controller.stream;
  }

  Stream<Element> get onAfterChange {
    StreamController<Element> controller = new StreamController<Element>();
    _jsObj.onafterchange(
        allowInterop((Element element) => controller.add(element)));
    return controller.stream;
  }

  Future get onComplete {
    Completer completer = new Completer();
    _jsObj.oncomplete(allowInterop(() => completer.complete(null)));
    return completer.future;
  }

  Future get onHintsAdded {
    Completer completer = new Completer();
    _jsObj.onhintsadded(allowInterop(() => completer.complete(null)));
    return completer.future;
  }

  Stream<HintAddedEvent> get onHintClick {
    StreamController<HintAddedEvent> controller =
        new StreamController<HintAddedEvent>();
    _jsObj.onhintclick(allowInterop(
        (Element hintElement, var item, int stepId) => controller.add(
            new HintAddedEvent(
                hintElement,
                new Hint(
                    element: item.element,
                    hint: item.hint,
                    hintAnimation: item.hintAnimation,
                    targetElement: item.targetElement),
                stepId))));
    return controller.stream;
  }

  Stream<int> get onHintClose {
    StreamController<int> controller = new StreamController<int>();
    _jsObj.onhintclose(allowInterop((int stepId) => controller.add(stepId)));
    return controller.stream;
  }

  Future get onExit {
    Completer completer = new Completer();
    _jsObj.onexit(allowInterop(() => completer.complete(null)));
    return completer.future;
  }

  void addHints() {
    _jsObj.addHints();
  }

  void hideHint(int stepId) {
    _jsObj.hideHint(stepId);
  }

  void hideHints() {
    _jsObj.hideHints();
  }
}

@JS()
@anonymous
class Options {
  external String get nextLabel;
  external String get prevLabel;
  external String get skipLabel;
  external String get doneLabel;
  external bool get hidePrev;
  external bool get hideNext;
  external String get tooltipPosition;
  external String get tooltipClass;
  external String get highlightClass;
  external bool get exitOnEsc;
  external bool get exitOnOverlayClick;
  external bool get showStepNumbers;
  external bool get keyboardNavigation;
  external bool get showButtons;
  external bool get showBullets;
  external bool get showProgress;
  external bool get scrollToElement;
  external num get overlayOpacity;
  external num get scrollPadding;
  external List<String> get positionPrecedence;
  external bool get disableInteraction;
  external String get hintPosition;
  external String get hintButtonLabel;
  external bool get hintAnimation;
  external List<Hint> get hints;

  external factory Options(
      {String nextLabel,
      String prevLabel,
      String skipLabel,
      String doneLabel,
      bool hidePrev,
      bool hideNext,
      String tooltipPosition,
      String tooltipClass,
      String highlightClass,
      bool exitOnEsc,
      bool exitOnOverlayClick,
      bool showStepNumbers,
      bool keyboardNavigation,
      bool showButtons,
      bool showBullets,
      bool showProgress,
      bool scrollToElement,
      num overlayOpacity,
      num scrollPadding,
      List<String> positionPrecedence,
      bool disableInteraction,
      String hintPosition,
      String hintButtonLabel,
      bool hintAnimation,
      List<Hint> hints,
      List<Step> steps});
}

@JS()
@anonymous
class Hint {
  external dynamic get element;
  external String get hint;
  external String get hintPosition;
  external bool get hintAnimation;
  external String get tooltipClass;
  external String get position;
  external String get targetElement;

  external factory Hint(
      {var element,
      String hint,
      String hintPosition,
      bool hintAnimation,
      String tooltipClass,
      String position,
      String targetElement});
}

@JS()
@anonymous
class Step {
  external dynamic get element;
  external String get intro;
  external String get position;

  external factory Step({var element, String intro, String position});
}
