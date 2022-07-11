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

};

