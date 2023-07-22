import Buffer from "./buffer/buffer.mjs";
import Pubsub from "../pubsub/pubsub.mjs";
import Memento from "../memento/memento.mjs";
//
const strategy = {
  textbuffer(opts) {
    return new Buffer(opts);
  },
};

class Buffers {
  //declare private property buffers for holding buffer objects
  constructor(opts) {
    if (!Buffers.instance) {
      Buffers.instance = this;
    }
    //default values
    const def = {};

    //Assign options to default one if they are provided
    Object.assign(def, opts);
    //assign buffers to empty map
    this.buffers = new Map();
    //method for listening events associated with this class'
    this.subscribe();
    return Buffers.instance;
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
    this.buffers.set(n, strategy["textbuffer"](buffer));
    //publish event buffers have changed
    this.publish(this.buffers);
  }

  /**
   *
   * @param {*} name: name of buffer
   * @returns: buffer object
   */
  getBuffer(name) {
    //check if buffer object exist, if not throw an error.
    if (!this.buffers.has(name)) throw new Error("Buffer doesn't exist!");
    return this.buffers.get(name);
  }

  /**
   * publish - publish event to notify buffers have changed
   */
  publish(buffers) {
    Pubsub.publish("buffersUpdated", buffers);
  }

  /**
   * subscribe - listen for events
   */
  subscribe() {
    Pubsub.subscribe("buffersUpdated", (buffers) => {
      //buffers.get("index.mjs").render();
    });
  }

  *[Symbol.iterator]() {
    yield* this.buffers;
  }
}

export default new Buffers();
