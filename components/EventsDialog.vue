<template>
  <v-dialog v-model="dialog" width="600" scrollable id="eventDialog">
    <template v-slot:activator="{ on, attrs }">

        <v-btn outlined v-bind="attrs" v-on="on" class="mr-2">
          {{ label }}
        </v-btn>
    </template>
    <v-card
      height="600px"
    >
      <v-card-title class="text-h5 grey lighten-2 word-wrap d-flex flex-column align-start">
        <span v-if="!event">{{ title }}</span>
        <div v-else class="d-flex align-start">
          <v-icon large @click="event=undefined">mdi-chevron-left</v-icon>
          <nuxt-link :to="`/single/${event.relationTo.split('/').pop()}`">{{ event.label }}</nuxt-link>
        </div>
      </v-card-title>
      <v-card-text class="white">
        <v-list v-if="!event">
          <v-virtual-scroll
            :items="items"
            :bench="4"
            height="450px"
            item-height="50px"
          >
            <template v-slot:default="{ item }">
              <v-list-item @click="event=item">
                {{ item.label }}
              </v-list-item>
            </template>
          </v-virtual-scroll>

        </v-list>
        <div
          v-else
        >
          <div v-if="loaded" class="pt-4">

            <v-row no-gutters class="mb-4">
              <v-col cols="12" sm="4" class="d-flex flex-column">
                <span class="text-caption mb-n1">Begin</span>
                <span class="text-body-1">
              <span v-if="!!event.when.timespans[0].start">{{
                  event.when.timespans[0].start.earliest
                }}
              </span>
              <span v-else> unknown</span>
            </span>
              </v-col>
              <v-col cols="12" sm="4" offset-sm="4" class="d-flex flex-column">
                <span class="text-caption mb-n1">End</span>
                <span class="text-body-1">
              <span v-if="!!event.when.timespans[0].end">{{
                  event.when.timespans[0].end.earliest
                }}
              </span>
              <span v-else> unknown</span>
            </span>
              </v-col>


            </v-row>
            <v-row no-gutters class="mb-4">
              <v-col cols="12" sm="4" class="d-flex flex-column">
                <span class="text-caption mb-n1">Origin</span>
                <span class="text-body-1">
              <nuxt-link v-if="!!movedFrom" :to="`/single/${movedFrom.relationTo.split('/').pop()}`">{{
                  movedFrom.label
                }}
              </nuxt-link>
              <span v-else> unknown</span>
            </span>
              </v-col>
              <v-col cols="12" sm="4" offset-sm="4" class="d-flex flex-column">
                <span class="text-caption mb-n1">Destination</span>
                <span class="text-body-1">
              <nuxt-link v-if="!!movedTo" :to="`/single/${movedTo.relationTo.split('/').pop()}`">{{ movedTo.label }}
              </nuxt-link>
              <span v-else> unknown</span>
            </span>
              </v-col>

            </v-row>

            <div v-if="!!eventType" class="d-flex flex-column">
              <span class="text-caption mb-n1">Type</span>
              <span class="text-body-1">
              <span>{{ eventType }}
              </span>
            </span>
            </div>
            <v-subheader v-if="!!sender || !!bearer || !!traveller || (!!otherInvolvements && otherInvolvements.length !== 0)" class="pa-0 pt-2 font-weight-bold" style="height:35px">Involved Actors</v-subheader>
            <v-row no-gutters>
              <v-col v-if="!!sender" cols="12" sm="6" class="d-flex flex-column">
                <span class="text-caption mb-n1">Sender</span>
                <span class="text-body-1">
              <nuxt-link :to="`/single/${sender.relationTo.split('/').pop()}`">{{ sender.label }}
              </nuxt-link>
            </span>
              </v-col>

              <v-col v-if="!!bearer" cols="12" sm="6" class="d-flex flex-column">
                <span class="text-caption mb-n1">Bearer</span>
                <span class="text-body-1">
              <nuxt-link :to="`/single/${bearer.relationTo.split('/').pop()}`">{{ bearer.label }}
              </nuxt-link>
            </span>
              </v-col>

              <v-col v-if="!!recipient" cols="12" sm="6" class="d-flex flex-column">
                <span class="text-caption mb-n1">Recipient</span>
                <span class="text-body-1">
              <nuxt-link :to="`/single/${recipient.relationTo.split('/').pop()}`">{{
                  recipient.label
                }}
              </nuxt-link>
            </span>
              </v-col>

              <v-col v-if="!!traveller" cols="12" sm="6" class="d-flex flex-column">
                <span class="text-caption mb-n1">Traveller</span>
                <span class="text-body-1">
              <nuxt-link :to="`/single/${traveller.relationTo.split('/').pop()}`">{{
                  traveller.label
                }}
              </nuxt-link>
            </span>
              </v-col>

              <v-col cols="12" sm="6" v-for="involvement in otherInvolvements" :key="involvement.relationTo"
                     class="d-flex flex-column"
              >
                <span class="text-caption mb-n1">{{ involvement.type }}</span>
                <span class="text-body-1">
              <nuxt-link :to="`/single/${involvement.relationTo.split('/').pop()}`">{{
                  involvement.label
                }}
              </nuxt-link>
            </span>
              </v-col>
            </v-row>

            <v-row v-if="!!source && source.descriptions.length !== 0 && !!source.descriptions[0].value">
              <v-col cols="12">
                <v-subheader class="pa-0 pt-2 font-weight-bold" style="height:35px">Source</v-subheader>

                <p class="text-body-1"
                   :class="{ lineclamp: isClamped }"
                   @click="isClamped = !isClamped"
                >{{ source.descriptions[0].value }}</p>

              </v-col>
            </v-row>
          </div>
          <div v-else>
            <v-progress-linear color="primary" class="mt-4" indeterminate rounded height="6"></v-progress-linear>
          </div>
        </div>
      </v-card-text>
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
  name: 'EventsDialog',
  props: ['items', 'label', 'title'],
  data() {
    return {
      dialog: false,
      event: undefined,
      loaded: false,
      eventDetail: undefined,
      locationFrom: undefined,
      locationTo: undefined,
      artifact: undefined,
      source: undefined,
      isClamped: true,
    };
  },
  computed: {
    eventType() {
      return this.eventDetail?.types.find((x) => x.hierarchy.startsWith('Event'))?.label;
    },
    movedFrom() {
      return this.locationFrom?.relations.find((x) => x.relationType === 'crm:P53i is former or current location of');
    },
    movedTo() {
      return this.locationTo?.relations.find((x) => x.relationType === 'crm:P53i is former or current location of');
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
        x.type !== 'Sender' &&
        x.type !== 'Recipient' &&
        x.type !== 'Traveller'
      );
    },
  },
  watch: {
    async event() {
      if (this.event && !this.loaded) {
        document.getElementById('eventDialog').scrollTop = 0;
        this.isClamped = true;
        const p = await this.$api.Entities.get_api_0_3_entity__id__({
          id_: this.event?.relationTo.split('/')
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

      const artifact = this.eventDetail?.relations.find((x) => x.relationType === 'crm:P25 moved');
      if (!!artifact) {
        const a = await this.$api.Entities.get_api_0_3_entity__id__({
          id_: artifact?.relationTo.split('/')
            .pop(),
        });
        [this.artifact] = a.body.features;
      }

      const source = this.artifact?.relations.find((x) => x.relationType === 'crm:P128 carries');
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
.lineclamp {
display: -webkit-box;
-webkit-line-clamp: 3;
-webkit-box-orient: vertical;
overflow: hidden;
}
</style>
