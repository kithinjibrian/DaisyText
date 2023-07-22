import systembar from "./ui/components/systembar.mjs";
import activitybar from "./ui/components/activitybar.mjs";
import sidebar from "./ui/components/sidebar.mjs";
import workspace from "./ui/components/workspace.mjs";

const { createApp } = Vue;
const { createVuetify } = Vuetify;

const vuetify = createVuetify();

const app = createApp({
  setup() {},
});

app
  .component("systembar", systembar)
  .component("activitybar", activitybar)
  .component("sidebar", sidebar)
  .component("workspace", workspace);

app.use(vuetify).mount("#app");
