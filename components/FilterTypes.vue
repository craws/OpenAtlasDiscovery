<template>
    <v-autocomplete
      class="mb-n5"
      :value="value"
      label="Event Types"
      :items="visibleTypes"
      item-text="name"
      item-value="value"
      multiple
      outlined
      clearable
      deletable-chips
      small-chips
      @input="update($event)"
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
