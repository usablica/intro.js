import "dart:html";
import "../../../introjs.dart";

void main() {
  ButtonElement startButton = querySelector("#start");

  IntroJs intro = new IntroJs();
  intro.setOption("showBullets", false);

  startButton.onClick.listen((_) => intro.start());
}
