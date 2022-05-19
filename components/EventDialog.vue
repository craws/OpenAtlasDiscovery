<template>
  <v-dialog v-model="dialog" width="600" style="z-index: 9999999999">
    <template v-slot:activator="{ on, attrs }">
      <v-list-item>
        <v-list-item-title v-bind="attrs" v-on="on">
          {{ event.label }}
        </v-list-item-title>
      </v-list-item>
    </template>
    <v-card>
      <v-card-title class="text-h5 grey lighten-2 word-wrap d-flex flex-column align-start">
        <span>{{ event.label }}</span>
        <span v-if="!!eventDetail" class="text-caption">{{ eventDetail.types.find(x => x.hierarchy.startsWith("Case study")).label}}</span>
      </v-card-title>


      <v-card-text v-if="loaded" style="overflow:hidden" class="pt-4">

        <v-row no-gutters>
          <v-col cols="12" sm="4" class="d-flex flex-column">
            <span class="text-caption mb-n2">Begin</span>
            <span class="text-body-1">
              <span v-if="!!event.when.timespans[0].start">{{ event.when.timespans[0].start.earliest
              }}
              </span>
              <span v-else> unknown</span>
            </span>
          </v-col>
          <v-col cols="12" sm="4" offset-sm="4" class="d-flex flex-column">
            <span class="text-caption mb-n2">End</span>
            <span class="text-body-1">
              <span v-if="!!event.when.timespans[0].end">{{ event.when.timespans[0].end.earliest
              }}
              </span>
              <span v-else> unknown</span>
            </span>
          </v-col>


        </v-row>
        <v-row no-gutters>
          <v-col cols="12" sm="4" class="d-flex flex-column">
            <span class="text-caption mb-n2">Origin</span>
            <span class="text-body-1">
              <nuxt-link v-if="!!movedFrom" :to="`/single/${movedFrom.relationTo.split('/').pop()}`">{{ movedFrom.label
              }}
              </nuxt-link>
              <span v-else> unknown</span>
            </span>
          </v-col>
          <v-col cols="12" sm="4" offset-sm="4" class="d-flex flex-column">
            <span class="text-caption mb-n2">Destination</span>
            <span class="text-body-1">
              <nuxt-link v-if="!!movedTo" :to="`/single/${movedTo.relationTo.split('/').pop()}`">{{ movedTo.label }}
              </nuxt-link>
              <span v-else> unknown</span>
            </span>
          </v-col>
          <v-divider class="my-4" />

          <v-col cols="12" sm="4" class="d-flex flex-column">
            <span class="text-caption mb-n2">Sender</span>
            <span class="text-body-1">
              <nuxt-link v-if="!!sender" :to="`/single/${sender.relationTo.split('/').pop()}`">{{ sender.label }}
              </nuxt-link>
              <span v-else> unknown</span>
            </span>
          </v-col>

          <v-col cols="12" sm="4" class="d-flex flex-column">
            <span class="text-caption mb-n2">Bearer</span>
            <span class="text-body-1">
              <nuxt-link v-if="!!bearer" :to="`/single/${bearer.relationTo.split('/').pop()}`">{{ bearer.label }}
              </nuxt-link>
              <span v-else> unknown</span>
            </span>
          </v-col>

          <v-col cols="12" sm="4" class="d-flex flex-column">
            <span class="text-caption mb-n2">Recipient</span>
            <span class="text-body-1">
              <nuxt-link v-if="!!recipient" :to="`/single/${recipient.relationTo.split('/').pop()}`">{{ recipient.label
              }}
              </nuxt-link>
              <span v-else> unknown</span>
            </span>
          </v-col>

          <v-col cols="12" sm="4" class="d-flex flex-column">
            <span class="text-caption mb-n2">Traveller</span>
            <span class="text-body-1">
              <nuxt-link v-if="!!traveller" :to="`/single/${traveller.relationTo.split('/').pop()}`">{{ traveller.label
              }}
              </nuxt-link>
              <span v-else> unknown</span>
            </span>
          </v-col>

          <v-col cols="12" v-for="involvement in otherInvolvements" :key="involvement.relationTo" class="d-flex flex-column">
            <span class="text-caption mb-n2">{{involvement.type}}</span>
            <span class="text-body-1">
              <nuxt-link :to="`/single/${involvement.relationTo.split('/').pop()}`">{{ involvement.label
              }}
              </nuxt-link>
            </span>
          </v-col>
          {{otherInvolvements}}
        </v-row>
        <v-row v-if="!!source && source.descriptions.length !== 0 && source.descriptions[0].value !== ''">
          <v-col cols="12">
            <p class="text-subtitle-1">Source</p>
            <p class="text-body-1 source-text">{{ source.descriptions[0].value }}</p>

          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text v-else>
        <v-progress-linear color="primary" class="mt-4" indeterminate rounded height="6"></v-progress-linear>
      </v-card-text>
      <v-divider />

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
  name: 'EventDialog',
  props: ['event'],
  data() {
    return {
      dialog: false,
      loaded: false,
      eventDetail: undefined,
      locationFrom: undefined,
      locationTo: undefined,
      artifact: undefined,
      source: undefined
    };
  },
  computed: {
    movedFrom() {

      return this.locationFrom?.relations.find((x) => x.relationType === "crm:P53i is former or current location of");
    },
    movedTo() {
      return this.locationTo?.relations.find((x) => x.relationType === "crm:P53i is former or current location of");
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
    traveller() {
      return this.eventDetail?.relations.find((x) => x.type === 'Traveller');
    },
    otherInvolvements() {
      return this.eventDetail?.relations.filter((x) => x.relationType === 'crm:P11 had participant' &&
        x.type !== 'Bearer' &&
        x.type !== 'Recipient' &&
        x.type !== 'Traveller'
      );
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
      }
    },
    async eventDetail() {
      const lFrom = this.eventDetail?.relations.find((x) => x.relationType === 'crm:P27 moved from');
      if (!!lFrom) {
        const f = await this.$api.Entities.get_api_0_3_entity__id__({
          id_: lFrom?.relationTo.split('/')
            .pop(),
        });
        [this.locationFrom] = f.body.features;
      }
      const lTo = this.eventDetail?.relations.find((x) => x.relationType === 'crm:P26 moved to');
      if (!!lTo) {
        const t = await this.$api.Entities.get_api_0_3_entity__id__({
          id_: lTo?.relationTo.split('/')
            .pop(),
        });
        [this.locationTo] = t.body.features;
      }

      const artifact = this.eventDetail?.relations.find((x) => x.relationType === "crm:P25 moved");
      if (!!artifact) {
        const a = await this.$api.Entities.get_api_0_3_entity__id__({
          id_: artifact?.relationTo.split('/')
            .pop(),
        });
        [this.artifact] = a.body.features;
      }

      const source = this.artifact?.relations.find((x) => x.relationType === "crm:P128 carries");
      if (!!source) {
        const s = await this.$api.Entities.get_api_0_3_entity__id__({
          id_: source?.relationTo.split('/')
            .pop(),
        });
        [this.source] = s.body.features;
      }
      this.loaded = true;
    }
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

.source-text {
  max-height: 300px;
  overflow: auto;
}
</style>
