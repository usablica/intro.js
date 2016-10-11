import "dart:html";
import "../../../introjs.dart";

void main() {
  ButtonElement startButton = querySelector("#start");
  startButton.onClick.listen((_) => new IntroJs().start());
}
