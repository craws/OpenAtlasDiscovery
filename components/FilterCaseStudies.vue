<template>
  <v-row no-gutters>
    <v-col v-for="item in caseStudyCheckboxes" :key="item.id" cols="12">
      <div class="d-flex justify-space-between align-center">
        <v-checkbox @click="changedSuperCaseStudy(item)" v-model="item.selected" :label="item.name" :color="item.color"/>
        <v-btn
          icon
          class="expand-button"
          :class="{ clicked: item.expanded }"
          @click="item.expanded = !item.expanded"
        >
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>

      <v-expand-transition>
        <v-row v-if="item.expanded" no-gutters class="ml-5">
          <v-col v-for="subitem in item.subtypes" :key="subitem.id" cols="12">
            <v-checkbox
              v-model="subitem.selected"
              class="mt-0"
              :color="item.color"
              :label="subitem.name"
            />
          </v-col>
        </v-row>
      </v-expand-transition>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'FilterCaseStudies',
  data() {
    return {
      caseStudyCheckboxes: [],
    };
  },
  computed: {
    ...mapGetters('data', ['getCaseStudies'])
  },
  mounted() {
    this.initCaseStudies();
  },
  methods: {
    ...mapActions('data', ['loadTypeTree']),
    initCaseStudies() {
      this.caseStudyCheckboxes = this.getCaseStudies.map((x) => ({
        ...x,
        subtypes: x.subtypes.map((y) => ({
          ...y,
          selected: true,
        })),
        selected: true,
        expanded: false,
      }));
    },
    changedSuperCaseStudy(cs){
      cs.subtypes.forEach(sub => sub.selected = cs.selected);
    }
  },
  watch: {
    getCaseStudies() {
      this.initCaseStudies();

    },
    caseStudyCheckboxes: {
      handler() {
        const value = this.caseStudyCheckboxes
          .flatMap((x) => [x.selected && x.id, ...x.subtypes.filter((y) => y.selected)
            .map((y) => y.id)]);
        this.$emit('input', value);
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style scoped>
.expand-button {
  transition: all ease-in-out 100ms;
}

.expand-button.clicked {
  transform: rotate(90deg);
}
</style>
