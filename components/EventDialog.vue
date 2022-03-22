<template>
  <v-dialog
    v-model="dialog"
    width="600"
    style="z-index: 9999999999"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-list-item>
        <v-list-item-title
          v-bind="attrs"
          v-on="on"
        >
          {{ event.label }}
        </v-list-item-title>
      </v-list-item>
    </template>
    <v-card>
      <v-card-title class="text-h5 grey lighten-2 word-wrap">
        {{ event.label }}
      </v-card-title>

      <v-card-text v-if="loaded" class="pt-4">
        <v-row no-gutters>
          <v-col cols="12" sm="4" class="d-flex flex-column">
            <span class="text-caption mb-n2">Origin</span>
            <span class="text-body-1">
              <nuxt-link
                v-if="!!movedFrom"
                :to="`/single/${movedFrom.relationTo.split('/').pop()}`"
              >{{ movedFrom.label }}
              </nuxt-link>
              <span v-else> unknown</span>
            </span>
          </v-col>
          <v-col cols="12" sm="4" offset-sm="4" class="d-flex flex-column">
            <span class="text-caption mb-n2">Destination</span>
            <span class="text-body-1">
              <nuxt-link
                v-if="!!movedTo"
                :to="`/single/${movedTo.relationTo.split('/').pop()}`"
              >{{ movedTo.label }}
              </nuxt-link>
              <span v-else> unknown</span>
            </span>
          </v-col>
          <v-divider class="my-4" />

          <v-col cols="12" sm="4" class="d-flex flex-column">
            <span class="text-caption mb-n2">Sender</span>
            <span class="text-body-1">
              <nuxt-link
                v-if="!!sender"
                :to="`/single/${sender.relationTo.split('/').pop()}`"
              >{{ sender.label }}
              </nuxt-link>
              <span v-else> unknown</span>
            </span>
          </v-col>

          <v-col cols="12" sm="4" class="d-flex flex-column">
            <span class="text-caption mb-n2">Bearer</span>
            <span class="text-body-1">
              <nuxt-link
                v-if="!!bearer"
                :to="`/single/${bearer.relationTo.split('/').pop()}`"
              >{{ bearer.label }}
              </nuxt-link>
              <span v-else> unknown</span>
            </span>
          </v-col>

          <v-col cols="12" sm="4" class="d-flex flex-column">
            <span class="text-caption mb-n2">Recipient</span>
            <span class="text-body-1">
              <nuxt-link
                v-if="!!recipient"
                :to="`/single/${recipient.relationTo.split('/').pop()}`"
              >{{ recipient.label }}
              </nuxt-link>
              <span v-else> unknown</span>
            </span>
          </v-col>
        </v-row>
      </v-card-text>
      <v-progress-circular
        v-else

        style="width:100%;"
        class="my-15 d-flex"
        :size="50"
        color="primary"
        indeterminate
      />

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          text
          @click="dialog = false"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'EventDialog',
  props: ['event'],
  data() {
    return {
      dialog: false,
      loaded: false,
      eventDetail: undefined,
    };
  },
  computed: {
    movedFrom() {
      return this.eventDetail?.relations.find((x) => x.relationType === 'crm:P27 moved from');
    },
    movedTo() {
      return this.eventDetail?.relations.find((x) => x.relationType === 'crm:P26 moved to');
    },
    sender() {
      return this.eventDetail?.relations.find((x) => x.type === 'Sender');
    },
    bearer() {
      return this.eventDetail?.relations.find((x) => x.type === 'Bearer');
    },
    recipient() {
      return this.eventDetail?.relations.find((x) => x.type === 'Recipient');
    },
  },
  watch: {
    async dialog() {
      if (this.dialog && !this.loaded) {
        const p = await this.$api.Entities.get_api_0_3_entity__id__({
          id_: this.event.relationTo.split('/')
            .pop(),
        });
        [this.eventDetail] = p.body.features;
        this.loaded = true;
      }
    },
  },
};
</script>

<style scoped>
.word-wrap {
  overflow-wrap: anywhere;
  word-wrap: break-word;
  word-break: normal;
  hyphens: auto;
}
</style>
