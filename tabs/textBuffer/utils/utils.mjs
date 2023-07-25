const getCaret = (editor) => {
    const range = window.getSelection().getRangeAt(0);
    const prefix = range.cloneRange();
    prefix.selectNodeContents(editor);
    prefix.setEnd(range.endContainer, range.endOffset);
    const text = prefix.toString()
    const a = text.split("\n");
    return a.length > 1 ? text.length : text.length;
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

const run = (data) => {
    const lines = data.split("\n")
    return lines.map((line, n)=>{
        let h = Prism.highlight(line, Prism.languages["javascript"],"javascript");
        return `<div>${h}\n</div>`
    }).join("")
}

export {getCaret, setCaret, run}