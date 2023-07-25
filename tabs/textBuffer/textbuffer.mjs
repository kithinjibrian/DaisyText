import Pubsub from "../../pubsub/pubsub.mjs";
import PieceTable from "./dsa/piecetable.mjs";
import { getCaret,setCaret, run } from "./utils/utils.mjs";

export default class TextBuffer {
  constructor(opts) {
    const def = {
      language: "js",
      name: "untitled",
    };

    Object.assign(def, opts);

    this.piecetable = new PieceTable(`hello\nworld`);
    this.name = def.name;
    this.subscribe();
  }

  render() {
    return /*html*/ `
    <div style="max-height: 85vh; outline: 0" class="overflow-y-auto">
      <div spellcheck="false" contentEditable="true"  style="outline: 0" id="editor"></div>
    </div>
    `;
  }

  publish(event,type) {
    const self = this;
    let editor = document.getElementById('editor');
    if(type === "input" && event.data !== null) {
      Pubsub.publish("typing", event.data, 0);
    } else if(type == 'keydown') {
      if(event.key == 'Enter') {
        event.preventDefault()
        Pubsub.publish("typing", "\n", 1)
      }
      if(event.key == 'Backspace') {
        event.preventDefault()
        Pubsub.publish("deleting", null)
      }
      if(event.key == "Tab") {
        event.preventDefault()
        Pubsub.publish("typing", "  ", 1)
      }
    } else if(type=='click') {
      console.log(getCaret(editor), self.piecetable.getSequence().split('')[getCaret(editor) - 1])
    }
  }

  subscribe() {
    const self = this;
    Pubsub.subscribe("typing", (data, n) => {
      let editor = document.getElementById('editor');
      const save = (data,index) => {
        self.piecetable.insert(data, index);
        return self.piecetable.getSequence();
      }
      const index = getCaret(editor) + n
      editor.innerHTML = run(save(data, index - 1))
      setCaret(index, editor)
    })

    Pubsub.subscribe("deleting", ()=>{
      const editor = document.getElementById('editor');
      const index = getCaret(editor);

      const del = (index) => {
        if(index > 0) {
          self.piecetable.delete(index - 1, 1); 
        }
        return self.piecetable.getSequence()
      };

      editor.innerHTML = run(del(index));
      if(index > 0) setCaret(index - 1, editor);
    })

    Pubsub.subscribe("newline", ()=>{
      const editor = document.getElementById('editor');
    })
  }
}








/**
 * Pubsub.subscribe("typing", () => {
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
              sel.addRange(range)
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
 */
