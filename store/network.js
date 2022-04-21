import { loadAllFromCidocClass } from '~/plugins/api';
export const state = () => ({
  persons: {},
  personsLoaded: false,
});

export const getters = {
  getPersons: (s) => s.persons,
  getPersonsLoaded: (s) => s.personsLoaded,

};
export const mutations = {

  SET_PERSONS(state, persons) {
    state.persons = persons;
  },

  SET_PERSONS_LOADED(state, personsLoaded) {
    state.personsLoaded = personsLoaded;
  },
};
export const actions = {
  async loadPersons({ commit }) {
    commit('SET_PERSONS_LOADED', false);
    const localItems = await loadAllFromCidocClass('actor', ['relations', 'types'], 100,['']);
    const persons = localItems.map(x => ({
      ...x.features[0],
      id: x.features[0]['@id'].split('/')
        .pop()
    }));
    commit('SET_PERSONS', persons);
    commit('SET_PERSONS_LOADED', true);

  },
  async loadGroups({ commit }) {
    //const localItems = await loadAllFromCidocClass('E74',['when']);
    //const list = localItems.map(x => x.features[0]);
    //commit('SET_GROUPS', list);
  },
};

