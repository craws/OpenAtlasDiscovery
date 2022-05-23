<template>
  <v-dialog v-model="dialog"  width="600" scrollable >
    <template v-slot:activator="{ on, attrs }">
        <v-btn outlined v-bind="attrs" v-on="on" class="mr-2">
          {{ label }}
        </v-btn>
    </template>
    <v-card>
      <v-card-title class="text-h5 grey lighten-2 word-wrap d-flex flex-column align-start">
        <span>{{ title }}</span>
      </v-card-title>
        <v-list>
          <v-virtual-scroll
            :items="items"
            :bench="4"
            height="450px"
            item-height="50px"
          >
            <template v-slot:default="{ item }">
              <v-list-item :to="`/single/${item.relationTo.split('/').pop()}`">
                {{ item.label }}
              </v-list-item>
            </template>
          </v-virtual-scroll>
        </v-list>

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" text @click="dialog = false">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ReferredToDialog',
  props:['items','label','title'],
  data() {
    return {
      dialog:false
    }
  }
};
</script>

<style scoped>

</style>
