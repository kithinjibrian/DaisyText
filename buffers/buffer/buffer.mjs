import Pubsub from "../../pubsub/pubsub.mjs";

export default class Buffer {
  constructor(opts) {
    const def = {
      language: "js",
      text: null,
      name: "untitled",
    };

    Object.assign(def, opts);

    this.text = def.text;
    this.name = def.name;
    this.selection = window.getSelection();
    this.subscribe();
  }

  render() {
    return /*html*/ `
    <div style="max-height: 85vh; outline: 0" class="overflow-y-auto">
      <!--<div id="line-numbers"></div>-->
      <div contentEditable="true"  style="outline: 0" id="paper"></div>
    </div>
    `;
  }

  publish() {
    Pubsub.publish("typing", null);
  }

  subscribe() {
    const self = this;
    Pubsub.subscribe("typing", () => {
      const d = document.getElementById("paper");

      const saveCursor = (element) => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const preCaretRange = range.cloneRange();
          preCaretRange.selectNodeContents(element);
          preCaretRange.setEnd(range.endContainer, range.endOffset);
          return preCaretRange.toString().length;
        }
        return 0;
      };

      const restoreCursor = (element, position) => {
        const textNode = element.firstChild;
        const range = document.createRange();
        range.setStart(textNode, position);
        range.setEnd(textNode, position);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      };

      (function () {
        self.text = {
          innertext: d.innerText,
          innerhtml: d.innerHTML,
          textcontent: d.textContent,
        };
      })();

      (function () {
        self.selection = saveCursor(d);
        const pattern = new RegExp("\\b(" + ["let"].join("|") + ")\\b", "g");
        const h = self.text.textcontent.replace(
          pattern,
          `<span style="color:red">$1</span>`
        );
        d.innerHTML = h;
        restoreCursor(d, self.selection);
      })();
    });
  }
}
