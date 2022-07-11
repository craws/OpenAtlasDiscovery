<template>
  <div>
    <v-autocomplete
      v-if="getPersonsLoaded"
      class="mb-n5 white"
      :value="value"
      label="Relation Types"
      :items="relations"
      item-text="name"
      item-value="value"
      multiple
      outlined
      clearable
      deletable-chips
      small-chips
      @input="update($event)"

    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'FilterTypes',
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters('network', ['getPersonsLoaded', 'getPersons']),

    ...mapGetters('data', ['getEventTypes']),
    ...mapGetters('data', ['getEventTypes']),
    relations() {
      return Object.values(this.getPersons).flatMap(x => x.relations?.filter(r => r.relationSystemClass === "person" || r.relationSystemClass === "group").map(r => r.type))

    }
  },
  methods:{
    update(e){
      console.log(e)
      this.$emit('input', JSON.parse(JSON.stringify(e)));
    }
  },
  watch: {
  }
}
;
</script>

<style scoped>

</style>
