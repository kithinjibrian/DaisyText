import Pubsub from "../pubsub/pubsub.mjs";

export default class Event {
  constructor() {
    this.listen();
  }

  listen() {
    document.body.addEventListener("keydown", (event) => {
      if (event.ctrlKey && event.key == "z") {
        event.preventDefault();
        Pubsub.publish("ctrl+z", null);
      }
    });
  }
}
