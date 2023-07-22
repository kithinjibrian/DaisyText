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

      (function () {
        self.text = {
          innertext: d.innerText,
          innerhtml: d.innerHTML,
          textcontent: d.textContent,
        };
      })();

      (function () {
        const h = Prism.highlight(self.text.textcontent, Prism.languages.javascript, "javascript")
        d.innerHTML = h;
      })();
    });
  }
}
