<template>
  <v-app light>
    <v-navigation-drawer
      v-model="drawer"
      :disable-resize-watcher="true"
      clipped
      app
      color="grey lighten-4"
    >
      <v-list
        dense
        class="grey lighten-4"
      >
        <template v-for="(item, i) in items">
          <v-row
            v-if="item.heading"
            :key="i"
            align="center"
          >
            <v-col cols="6">
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-col>
            <v-col
              cols="6"
              class="text-right"
            >
              <v-btn small text>
                edit
              </v-btn>
            </v-col>
          </v-row>
          <v-divider
            v-else-if="item.divider"
            :key="i"
            dark
            class="my-4"
          />
          <v-list-item
            v-else
            :key="i"
            link
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="grey--text">
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <span class="title ml-3 mr-5">OpenAtlas&nbsp;
        <span class="font-weight-light">Discovery</span>
      </span>
      <v-text-field
        solo-inverted
        flat
        hide-details
        prepend-inner-icon="mdi-magnify"
      />

      <v-spacer />
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      items: [
        {
          icon: 'mdi-lightbulb-outline',
          text: 'Notes',
        },
        {
          icon: 'mdi-history',
          text: 'Reminders',
        },
        { divider: true },
        { heading: 'Labels' },
        {
          icon: 'mdi-plus-circle-outline',
          text: 'Create new label',
        },
        { divider: true },
        {
          icon: 'mdi-archive',
          text: 'Archive',
        },
        {
          icon: 'mdi-delete',
          text: 'Trash',
        },
      ],
    };
  },
};
</script>
