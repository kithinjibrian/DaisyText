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
      <div spellcheck="false" contentEditable="true"  style="outline: 0" id="editor">
      <div>function fn() {</div>
      <div>let a = 40;</div>
      <div>}</div>
      </div>
    </div>
    `;
  }

  publish() {
    Pubsub.publish("typing", null);
  }

  subscribe() {
    const self = this;
    Pubsub.subscribe("typing", () => {
      const editor = document.getElementById('editor');

      const highlight = (editor) => {
        for(const node of editor.children) {
          const s = node.textContent;
          s.replace(
          /\b(new|if|else|do|while|switch|for|in|of|continue|break|return|typeof|function|var|const|let|\.length|\.\w+)(?=[^\w])/g,
          '<span style="class:red">$1</span>');
          node.innerHTML = s
        }
      }
      highlight(editor)
    });
  }
}
