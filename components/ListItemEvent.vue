<template>
  <v-list-item class="text-wrap">
    <v-list-item-content>
      <v-list-item-title class="text-wrap">
        {{ event.properties.title }}
      </v-list-item-title>
      <v-list-item-subtitle>
        <p>
          from
          <nuxt-link
            v-if="!!movedFrom"
            :to="`single/${movedFrom.relationTo.split('/').pop()}`"
          >
            {{ movedFrom.label }}
          </nuxt-link>
          <span v-else>unknown</span>
          to
          <nuxt-link
            v-if="!!movedTo"
            :to="`single/${movedTo.relationTo.split('/').pop()}`"
          >
            {{ movedTo.label }}
          </nuxt-link>
          <span v-else>unknown</span>
        </p>
        <p>
          Sender:
          <nuxt-link v-if="!!sender" :to="`/single/${sender.relationTo.split('/').pop()}`">
            {{ sender.label }}
          </nuxt-link>
          <span v-else> unknown</span>
        </p>
        <p>
          Bearer:
          <nuxt-link v-if="!!bearer" :to="`/single/${bearer.relationTo.split('/').pop()}`">
            {{ bearer.label }}
          </nuxt-link>
          <span v-else> unknown</span>
        </p>
        <p>
          Recipient:
          <nuxt-link v-if="!!recipient" :to="`/single/${recipient.relationTo.split('/').pop()}`">
            {{ recipient.label }}
          </nuxt-link>
          <span v-else> unknown</span>
        </p>
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  name: 'ListItemEvent',
  props: ['event'],
  computed: {
    movedFrom() {
      return this.event.relations.find((x) => x.relationType === 'crm:P27 moved from');
    },
    movedTo() {
      return this.event.relations.find((x) => x.relationType === 'crm:P26 moved to');
    },
    sender() {
      return this.event.relations.find((x) => x.type === 'Sender');
    },
    bearer() {
      return this.event.relations.find((x) => x.type === 'Bearer');
    },
    recipient() {
      return this.event.relations.find((x) => x.type === 'Recipient');
    },
  },
};
</script>

<style scoped>

</style>
