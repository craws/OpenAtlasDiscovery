<template>
  <v-row no-gutters>
    <v-col v-for="item in caseStudyCheckboxes" :key="item.id" cols="12">
      <div class="d-flex justify-space-between align-center">
        <v-checkbox @click="changedSuperCaseStudy(item)" v-model="item.selected" :color="item.color">
          <template v-slot:label>
            <div class="d-flex flex-column">
              {{ item.name }}
              <nuxt-link class="text-caption text-no-wrap" :to="`/casestudy/${item.id}`">learn more</nuxt-link>
            </div>
          </template>
        </v-checkbox>
        <v-btn
          icon
          class="expand-button"
          :class="{ clicked: item.expanded }"
          @click="item.expanded = !item.expanded"
          v-if="!!item.subtypes && item.subtypes.length !== 0"
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
  props: ['value'],
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
      if (this.getCaseStudies?.length === 0) return;

      this.caseStudyCheckboxes = this.getCaseStudies.map((x) => ({
        ...x,
        subtypes: x.subtypes.map((y) => ({
          ...y,
          selected: !this.value || this.value.length === 0 || this.value == x.id,
        })),
        selected: !this.value || this.value.length === 0 || this.value == x.id,
        expanded: false,
      }));
      const value = this.caseStudyCheckboxes
        .flatMap((x) => [x.selected && x.id, ...x.subtypes.filter((y) => y.selected)
          .map((y) => y.id)]);
      this.$emit('input', value);
    },
    changedSuperCaseStudy(cs) {
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
    },
    value() {
      console.log(this.caseStudyCheckboxes, this.value);
      this.caseStudyCheckboxes.forEach(x => {
        x.selected = this.value?.includes(x.id);
        x.subtypes.forEach(y => {
          y.selected = this.value?.includes(y.id);
        });
      });
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
