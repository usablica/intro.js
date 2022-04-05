import introJs from "../../src";

describe("hideSkip", () => {

    test("shold show the skip button by default", () => {
        const targetElement = document.createElement("div");
        document.body.appendChild(targetElement);
    
        const intro = introJs(targetElement).setOptions({
            steps: [
                {
                    intro: "hello world"
                }
            ]
        })

        intro.start();

        const skipbutton = document.querySelectorAll(".introjs-skipbutton");

        expect(intro._options.hideSkip).toBe(false);
        expect(skipbutton.length).toBe(1);
        expect(skipbutton[0].className).toBe('introjs-skipbutton')
    })

    test("should hide the skip button", () => {
        const targetElement = document.createElement("div");
        document.body.appendChild(targetElement);
    
        const intro = introJs(targetElement).setOptions({
            hideSkip: true,
            steps: [
                {
                    intro: "hello world"
                }
            ]
        })

        intro.start();

        const skipbutton = document.querySelectorAll(".introjs-skipbutton");

        expect(intro._options.hideSkip).toBe(true);
        expect(skipbutton.length).toBe(1);
        expect(skipbutton[0].className).toBe('introjs-skipbutton introjs-hidden')
    });
})