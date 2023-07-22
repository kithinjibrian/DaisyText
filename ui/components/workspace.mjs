import Buffers from "../../buffers/buffers.mjs";
import Pubsub from "../../pubsub/pubsub.mjs";

const { ref, reactive } = Vue;

export default {
  setup() {
    const buffers = reactive(Buffers.get());
    const tab = ref(null);

    return {
      tab,
      buffers,
    };
  },
  template: /*html*/ `
	<v-card color="background" height='100vh'>
    <v-tabs
      v-model="tab"
    >
      <v-tab
      v-for="(buffer,n) in Array.from(buffers)"
      :key="n"
      :value="buffer.name">{{buffer[0]}}</v-tab>
    </v-tabs>

    <v-card-text class="pr-0">
      <v-window v-model="tab">
        <v-window-item
        v-for="(buffer,n) in Array.from(buffers)"
        :key="n"
        :value="buffer.name"
        v-html="buffer[1].render()"
        @input="() => buffer[1].publish()">
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
	`,
};
