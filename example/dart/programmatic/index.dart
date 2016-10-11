import "dart:html";
import "../../../introjs.dart";

void startIntro() {
  IntroJs intro = new IntroJs();
  intro.setOptions(new Options(steps: [
    new Step(intro: "Hello world!"),
    new Step(element: querySelector("#step1"), intro: "This is a tooltip"),
    new Step(
        element: querySelectorAll("#step2")[0],
        intro: "Ok, wasn't that fun?",
        position: "right"),
    new Step(
        element: "#step3", intro: "More features, more fun.", position: "left"),
    new Step(element: "#step4", intro: "Another step.", position: "bottom"),
    new Step(element: "#step5", intro: "Get it, use it.")
  ]));

  intro.start();
}

void main() {
  querySelector("#start").onClick.listen((_) => startIntro());
}
