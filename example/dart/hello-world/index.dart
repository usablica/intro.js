import "dart:html";
import "../../../introjs.dart";

void main() {
  Element startButton = querySelector("#start");
  startButton.onClick.listen((_) => new IntroJs().start());
}
