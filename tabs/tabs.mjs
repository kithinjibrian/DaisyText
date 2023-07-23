import TextBuffer from "./textBuffer/textbuffer.mjs";
import Pubsub from "../pubsub/pubsub.mjs";
import Memento from "../memento/memento.mjs";
//
const strategy = {
  textbuffer(opts) {
    return new TextBuffer(opts);
  },
};

class Tabs {
  //declare private property tabs for holding buffer objects
  constructor(opts) {
    if (!Tabs.instance) {
      Tabs.instance = this;
    }
    //default values
    const def = {};

    //Assign options to default one if they are provided
    Object.assign(def, opts);
    //assign tabs to empty map
    this.tabs = new Map();
    //method for listening events associated with this class'
    this.subscribe();
    return Tabs.instance;
  }

  get() {
    return this;
  }

  /**
   * add - add buffer to buffer map
   * @param {*} name: name of buffer
   * @param {*} buffer: buffer options
   */
  add(name, buffer) {
    let n = `${name}-${Math.floor(Math.random() * 10)}`;
    this.tabs.set(n, strategy["textbuffer"](buffer));
    //publish event tabs have changed
    this.publish(this.tabs);
  }

  /**
   *
   * @param {*} name: name of buffer
   * @returns: buffer object
   */
  getBuffer(name) {
    //check if buffer object exist, if not throw an error.
    if (!this.tabs.has(name)) throw new Error("Tab doesn't exist!");
    return this.tabs.get(name);
  }

  /**
   * publish - publish event to notify tabs have changed
   */
  publish(tabs) {
    Pubsub.publish("tabsUpdated", tabs);
  }

  /**
   * subscribe - listen for events
   */
  subscribe() {
    Pubsub.subscribe("tabsUpdated", (tabs) => {
      //tabs.get("index.mjs").render();
    });
  }

  *[Symbol.iterator]() {
    yield* this.tabs;
  }
}

export default new Tabs();
