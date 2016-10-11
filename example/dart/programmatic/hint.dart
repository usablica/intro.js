import "dart:html";
import "../../../introjs.dart";

void addHints() {
  IntroJs intro = new IntroJs();
  intro.setOptions(new Options(hints: [
    new Hint(
        element: document.querySelector('#step1'),
        hint: "This is a tooltip.",
        hintPosition: "top-middle"),
    new Hint(
        element: "#step2", hint: "More features, more fun.", position: "left"),
    new Hint(
        element: "#step4",
        hint: "<b>Another</b> step.",
        hintPosition: "top-middle")
  ]));

  intro.onHintsAdded.then((_) => print("all hints added"));

  intro.onHintClick.listen((HintAddedEvent event) =>
      print("hint clicked ${event.hintElement} ${event.item} ${event.stepId}"));

  intro.onHintClose.listen((stepId) => print("hint closed $stepId"));

  intro.addHints();
}

void main() {
  querySelector("#step2").onClick.listen((_) => addHints());
}
