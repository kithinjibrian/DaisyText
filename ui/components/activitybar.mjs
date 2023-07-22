export default {
  template: /*html*/ `
    <v-navigation-drawer rail permanent>
      <v-list mandatory nav>
        <v-list-item
          color="primary"
          prepend-icon="mdi-file"
          title="file"
          value="file"
        ></v-list-item>
        <v-list-item
          color="primary"
          prepend-icon="mdi-magnify"
          title="search"
          value="search"
        ></v-list-item>
        <v-list-item
          color="primary"
          prepend-icon="mdi-bug"
          title="bug"
          value="bug"
        ></v-list-item>
        <v-list-item
          color="primary"
          prepend-icon="mdi-puzzle"
          title="extension"
          value="extension"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>
  `,
};
