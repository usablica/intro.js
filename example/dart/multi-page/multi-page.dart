import "dart:html";
import "../../../introjs.dart";

void main() {
  querySelector("#startButton").onClick.listen((_) {
    new IntroJs()
      ..setOption("doneLabel", "Next page")
      ..start()
      ..onComplete.then((_) {
        window.location.href = "second.html?multipage=true";
      });
  });
}
