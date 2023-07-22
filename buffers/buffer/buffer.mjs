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
      <div spellcheck="false" contentEditable="true"  style="outline: 0" id="paper">function</div>
    </div>
    `;
  }

  publish() {
    Pubsub.publish("typing", null);
  }

  subscribe() {
    const self = this;
    Pubsub.subscribe("typing", () => {
      const editor = document.getElementById("paper");

      (function () {
        self.text = {
          innertext: editor.innerText,
          innerhtml: editor.innerHTML,
          textcontent: editor.textContent,
        };
      })();

      (function (editor) {
        const getTextSegments = (element) => {
          const textSegments = [];
          Array.from(element.childNodes).forEach((node) => {
              switch(node.nodeType) {
                  case Node.TEXT_NODE:
                      textSegments.push({text: node.nodeValue, node});
                      break;
                      
                  case Node.ELEMENT_NODE:
                      textSegments.splice(textSegments.length, 0, ...(getTextSegments(node)));
                      break;
                      
                  default:
                      throw new Error(`Unexpected node type: ${node.nodeType}`);
              }
          });
          return textSegments;
        }
        const saveCursor = () => {
          const sel = window.getSelection();
          const textSegments = getTextSegments(editor);
          const textContent = textSegments.map(({text}) => text).join('');
          let anchorIndex = null;
          let focusIndex = null;
          let currentIndex = 0;
          textSegments.forEach(({text, node}) => {
              if (node === sel.anchorNode) {
                  anchorIndex = currentIndex + sel.anchorOffset;
              }
              if (node === sel.focusNode) {
                  focusIndex = currentIndex + sel.focusOffset;
              }
              currentIndex += text.length;
          });
          return {
            anchorIndex, focusIndex
          }
        }

        const restoreCursor = (absoluteAnchorIndex, absoluteFocusIndex) => {
          const sel = window.getSelection();
          const textSegments = getTextSegments(editor);
          let anchorNode = editor;
          let anchorIndex = 0;
          let focusNode = editor;
          let focusIndex = 0;
          let currentIndex = 0;
          textSegments.forEach(({text, node}) => {
              const startIndexOfNode = currentIndex;
              const endIndexOfNode = startIndexOfNode + text.length;
              if (startIndexOfNode <= absoluteAnchorIndex && absoluteAnchorIndex <= endIndexOfNode) {
                  anchorNode = node;
                  anchorIndex = absoluteAnchorIndex - startIndexOfNode;
              }
              if (startIndexOfNode <= absoluteFocusIndex && absoluteFocusIndex <= endIndexOfNode) {
                  focusNode = node;
                  focusIndex = absoluteFocusIndex - startIndexOfNode;
              }
              currentIndex += text.length;
          });
          
          sel.setBaseAndExtent(anchorNode,anchorIndex,focusNode,focusIndex);
        }

        let {anchorIndex, focusIndex} = saveCursor();
        const h = Prism.highlight(self.text.textcontent, Prism.languages.javascript, "javascript")
        editor.innerHTML = h;
        restoreCursor(anchorIndex,focusIndex)
      })(editor);
    });
  }
}
