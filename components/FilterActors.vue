<template>
  <div v-if="getPersonsLoaded">
    <v-row no-gutters v-for="(actorType, name) in value" :key="name">
      <v-col cols="6" class="px-2">
        <v-autocomplete :value="getPersons[value[name].id]" :label="name" dense :items="Object.values(getPersons)"
          item-text="label" :disabled="!!actorType.sex" outlined clearable class="text-capitalize"
          @input="updateActor(name, $event)" return-object />
      </v-col>
      <v-col cols="6">
        <v-autocomplete :value="actorType.sex" dense label="Sex" outlined clearable :items="['Male', 'Female']"
          @input="updateSex(name, $event)" />
      </v-col>
    </v-row>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'FilterActors',
  props: {
    reset: Boolean,
    value: {
      type: Object,
      default: () => ({
        sender: {
          id: undefined,
          sex: undefined
        },
        bearer: {
          id: undefined,
          sex: undefined
        },
        recipient: {
          id: undefined,
          sex: undefined
        },
        traveller: {
          id: undefined,
          sex: undefined
        },
        others: {
          id: undefined,
          sex: undefined
        }
      }),
    },
  },
  data() {
    return {
      actorTypes: {
        sender: {},
        bearer: {},
        recipient: {},
        traveller: {},
        others: {}
      },
    };
  },
  computed: {
    ...mapGetters('data', ['getPersons', 'getPersonsLoaded']),
  }
  ,
  methods: {
    updateActor(id, e) {
      const temp = JSON.parse(JSON.stringify(this.value));
      temp[id].id = e?.id;
      this.$emit('input', temp);
    },
    updateSex(id, e) {
      const temp = JSON.parse(JSON.stringify(this.value));
      temp[id].sex = e;
      this.$emit('input', temp);
    }
  },
  watch: {
    reset() {
      const defaultValue = {
        sender: {
          id: undefined,
          sex: undefined
        },
        bearer: {
          id: undefined,
          sex: undefined
        },
        recipient: {
          id: undefined,
          sex: undefined
        },
        traveller: {
          id: undefined,
          sex: undefined
        },
        others: {
          id: undefined,
          sex: undefined
        }
      }
      this.$emit('input', defaultValue);
    }
  }
};
</script>

<style>

</style>
