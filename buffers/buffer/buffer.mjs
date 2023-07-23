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
      const text = editor.textContent;

      const getCaret = (editor) => {
        const range = window.getSelection().getRangeAt(0);
        const prefix = range.cloneRange();
        prefix.selectNodeContents(editor);
        prefix.setEnd(range.endContainer, range.endOffset);
        return prefix.toString().length;
      }

      const setCaret = (pos, editor) => {
        for (const node of editor.childNodes) {
          if(node.nodeType == Node.TEXT_NODE) {
            if(node.length >= pos) {
              const range = document.createRange();
              const sel = window.getSelection();
              range.setStart(node, pos);
              range.collapse(true);
              sel.removeAllRanges();
              sel.addRange()
              return -1 
            } else {
              pos = pos - node.length
            }
          } else {
            pos = setCaret(pos, node);
            if (pos < 0) {
              return pos;
            }
          }
        }
        return pos;
      }

      const highlight = (editor) => {
        for(const node of editor.children) {
          const s = node.textContent.replace(
          /\b(new|if|else|do|while|switch|for|in|of|continue|break|return|typeof|function|var|const|let|\.length|\.\w+)(?=[^\w])/g,
          '<span style="color:red">$1</span>');
          node.innerHTML = s.split('\n').join('<br/>')
        }
      }
      const pos = getCaret(editor)
      highlight(editor)
      setCaret(pos, editor)
    });
  }
}
