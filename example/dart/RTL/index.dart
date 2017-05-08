import "dart:html";
import "../../../introjs.dart";

void main() {
  querySelector("#start").onClick.listen((_) {
    new IntroJs()
      ..setOptions(new Options(
          nextLabel: "הבא",
          prevLabel: "קודם",
          skipLabel: "דלג",
          doneLabel: "סיום"))
      ..start();
  });
}
