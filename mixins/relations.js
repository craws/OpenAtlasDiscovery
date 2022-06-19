export default {
  methods: {
    async getGhostLetters(rootSource) {
      const artifacts = rootSource?.features?.[0]?.relations.filter(x => x.relationType === 'crm:P67 refers to' && x.relationSystemClass === 'artifact') || [];

      const artifactDetails = [];
      const ghostLetters = [];
      for (const a of artifacts) {
        const artifact = await this.fetchById(a.relationTo.split('/')
          .pop());
        artifactDetails.push(artifact);
        for (const s of artifact.features[0].relations.filter(r => r.relationType === 'crm:P128 carries')) {
          const ghostLetter = await this.fetchById(s.relationTo.split('/')
            .pop());

          if (ghostLetter.features[0].types.some(x => x.identifier.split('/')
            .pop() === '1833')) {
            ghostLetters.push(ghostLetter);
          }

        }
      }
      console.log('ghost lettis',ghostLetters)
      return ghostLetters;
    },
    async fetchById(id) {
      // eslint-disable-next-line no-underscore-dangle
      const p = await this.$api.Entities.get_api_0_3_entity__id__({
        id_: id,
      });
      // eslint-disable-next-line prefer-destructuring
      return p.body;
    },
  },
};
