<template>
    <v-autocomplete
      class="mb-n5"
      v-model="eventTypes"
      label="Event Types"
      :items="visibleTypes"
      item-text="name"
      item-value="value"
      multiple
      outlined
      clearable
      deletable-chips
      small-chips
    />
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
      eventTypes: [],

    };
  },
  computed: {
    ...mapGetters('data', ['getEventTypes']),
    visibleTypes() {
      return this.getEventTypes.filter(x => x.root?.length === 1)
        .map(x => ({
          ...x,
          value: [x.id, ...x.subs]
        }));

    }
  },
  watch: {
    props: {
      handler() {
        this.eventTypes = JSON.parse(JSON.stringify(this.value));
      }
      ,
      deep: true,
      immediate: true,
    },
    eventTypes(){
      this.$emit('input', JSON.parse(JSON.stringify(this.eventTypes.flat())));
    }
  }
}
;
</script>

<style scoped>

</style>
