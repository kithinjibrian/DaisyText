import Tabs from "../../tabs/tabs.mjs";
import Pubsub from "../../pubsub/pubsub.mjs";

const { ref, reactive } = Vue;

export default {
  setup() {
    const tabs = reactive(Tabs.get());
    const tab = ref(null);

    return {
      tab,
      tabs,
    };
  },
  template: /*html*/ `
	<v-card color="background" height='100vh'>
    <v-tabs
      v-model="tab"
    >
      <v-tab
      v-for="(_tab,n) in Array.from(tabs)"
      :key="n"
      :value="_tab.name">{{_tab[0]}}</v-tab>
    </v-tabs>

    <v-card-text class="pr-0">
      <v-window v-model="tab">
        <v-window-item
        v-for="(_tab,n) in Array.from(tabs)"
        :key="n"
        :value="_tab.name"
        v-html="_tab[1].render()"
        @click="_tab[1].publish($event,'click')"
        @keydown="_tab[1].publish($event,'keydown')"
        @input="_tab[1].publish($event,'input')">
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
	`,
};
