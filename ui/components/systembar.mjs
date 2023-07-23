import Tabs from "../../tabs/tabs.mjs";

const { reactive } = Vue;

export default {
  setup() {
    const tabs = reactive(Tabs.get());
    const newFile = () => {
      tabs.add("untitled", {});
    };

    return {
      newFile,
    };
  },
  template: /*html*/ ` 
  <v-system-bar class="text-white">
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn variant="text" density="compact" v-bind="props"> File </v-btn>
    </template>
    <v-card min-width="200">
      <v-list>
        <v-list-item
          color="primary"
          link
          @click = "newFile"
        >
          <span>New</span>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
  <v-spacer />
</v-system-bar>
  `,
};
