import Vue from 'vue';

export const state = () => ({
  geoItems: {},
  events: {},
  eventTypes: [],
  caseStudies: [],
  persons: {},
  groups: [],
  eventToPerson: {},
  eventsLoaded: false,
  personsLoaded: false,
});

export const getters = {
  getEvents: (s) => s.events,
  getEventTypes: (s) => s.eventTypes,
  getGeoItems: (s) => s.geoItems,
  getCaseStudies: (s) => s.caseStudies,
  getCaseStudyColor: (s) => (id) => s.caseStudies.find(x => x.id === id || x.subtypes.some(y => y === id))?.color + '30',
  getEventToPerson: (s) => s.eventToPerson,
  getPersons: (s) => s.persons,
  getEventsLoaded: (s) => s.eventsLoaded,
  getPersonsLoaded: (s) => s.personsLoaded,

};
export const mutations = {
  SET_GEO_ITEMS(state, geoItems) {
    state.geoItems = geoItems;
  },
  SET_EVENTS(state, events) {
    state.events = events;
  },
  SET_EVENT_TYPES(state, eventTypes) {
    state.eventTypes = eventTypes;
  },
  SET_CASE_STUDIES(state, caseStudies) {
    state.caseStudies = caseStudies;
  },
  SET_PERSONS(state, persons) {
    state.persons = persons;
  },
  SET_GROUPS(state, groups) {
    state.groups = groups;
  },
  SET_EVENT_TO_PERSON(state, eventToPerson) {
    state.eventToPerson = eventToPerson;
  },
  SET_EVENTS_LOADED(state, eventsLoaded) {
    state.eventsLoaded = eventsLoaded;
  },
  SET_PERSONS_LOADED(state, personsLoaded) {
    state.personsLoaded = personsLoaded;
  },
  UPDATE_PERSON(state, personId, properties) {
    state.persons[personId] = {...(state.persons[personId]||[]), ...properties };
  }

};
export const actions = {
  async loadTypeTree({ commit }) {

    const g = await Vue.prototype.$api.Nodes.get_api_0_3_type_tree_();
    const eventTypes = Object.values(g.body.typeTree)
      .filter(x => x.root.includes(27));

    const colors = ['#f44336',
      '#2196f3',
      '#4caf50',
      '#ff9800',
      '#ffeb3b',
      '#009688',
      '#607d8b'];
    const getcolor = (nonce) => {
      return colors.length !== 0 ? colors.shift() :
        `#${+Math.floor(parseFloat(`0.${nonce}`) * 16777215)
          .toString(16)}`;
    };
    const caseStudies = g.body.typeTree[137].subs.filter(x => x !== 13465)
      .map(cs => ({
        ...g.body.typeTree[cs],
        subtypes: g.body.typeTree[cs].subs.map(sub => g.body.typeTree[sub]),
        color: getcolor(cs)
      }));

    commit('SET_EVENT_TYPES', eventTypes);
    commit('SET_CASE_STUDIES', caseStudies);

  },
  async loadGeoItems({ commit }) {
    const places = await loadAllFromCidocClass('place', ['relations']);

    console.log('plätzle', places);
    console.time('geo');
    const g = await Vue.prototype.$api.Content.get_api_0_3_geometric_entities_();
    const dict = g.body.features.reduce((map, item) => {
      const locationId = parseInt(places.find(p => p.features[0]['@id'] === `http://connec.openatlas.eu/entity/${item.properties.objectId}`)
        ?.features[0]?.relations?.find(x => x.relationSystemClass === "object_location")?.relationTo.split('/').pop(), 10);
      return {
        ...map,
        [locationId]: item
      };
    }, {});
    console.timeEnd('geo');
    console.log('geo', dict);
    console.log('geoData', dict);
    commit('SET_GEO_ITEMS', dict);
  },
  async loadEvents({ commit }) {
    commit('SET_EVENTS_LOADED', false);

    const events = await loadAllFromCidocClass('event', ['when', 'relations', 'types']);
    console.time('fix');
    const eventDict = events.reduce((dict, event) => {
      const eventId = event.features[0]['@id'].split('/').pop()
      const fromPlace = event.features[0]?.relations?.find(y => y.relationType === 'crm:P27 moved from')
        ?.relationTo
        .split('/')
        .pop();
      const toPlace = event.features[0]?.relations?.find(y => y.relationType === 'crm:P26 moved to')
        ?.relationTo
        .split('/')
        .pop();
      let sender = event.features[0]?.relations?.find(y => y.relationType === "crm:P11 had participant" && y.type === "Sender");
      if(sender) sender.id = sender?.relationTo.split('/').pop();
      let recipient = event.features[0]?.relations?.find(y => y.relationType === "crm:P11 had participant" && y.type === "Recipient");
      if(recipient) recipient.id = recipient?.relationTo.split('/').pop();
      let bearer = event.features[0]?.relations?.find(y => y.relationType === "crm:P11 had participant" && y.type === "Bearer");
      if(bearer) bearer.id = bearer?.relationTo.split('/').pop();
      return {
        ...dict,
        [eventId]: {
          ...event.features[0],
          fromPlace: parseInt(fromPlace),
          toPlace: parseInt(toPlace),
          id: eventId,
          sender,
          bearer,
          recipient
        }
      };
    }, {});

    const personDict = [...Object.values(eventDict).map(x => x.sender),
      Object.values(eventDict).map(x => x.recipient),
      Object.values(eventDict).map(x => x.bearer)].filter(Boolean).reduce((dict, person)=>({
        ...dict,
        [person.id] : person
      }),{})

    commit('SET_EVENTS', eventDict);
    commit('SET_PERSONS', personDict);
    commit('SET_EVENTS_LOADED', true);
    console.timeEnd('fix');


  },
  async loadPersons({ commit }) {
    commit('SET_PERSONS_LOADED', false);
    const localItems = await loadAllFromCidocClass('actor', ['types']);
    console.time('afterPerson')
  
    const persons = localItems.reduce((dict,person) => {
        const id = person.features[0]['@id'].split('/').pop();
        const sex = person.features[0].types?.find(y => y.hierarchy === 'Sex')?.label;
        const label = person.features[0].properties.title
      return{
        ...dict,
        [id]:{id,sex,label}
      }
    },{});
    commit('SET_PERSONS', persons);
    commit('SET_PERSONS_LOADED', true);
    console.timeEnd('afterPerson')

  },
  async loadGroups({ commit }) {
    //const localItems = await loadAllFromCidocClass('E74',['when']);
    //const list = localItems.map(x => x.features[0]);
    //commit('SET_GROUPS', list);
  },
};

async function loadAllFromCidocClass(viewClass, show) {
  console.time(`load ${viewClass}`);
  const limit = 100;

  const p = await Vue.prototype.$api.Entities.get_api_0_3_query_({
    limit,
    view_classes: viewClass,
    show: show,
  });

  let promises = [];
  let localItems = [...p.body.results];

  for (let i = 2; i <= p.body.pagination.totalPages; i++) {
    const promise = {
      func: Vue.prototype.$api.Entities.get_api_0_3_query_,
      arg: {
        limit,
        view_classes: viewClass,
        show,
        page: i
      }
    };
    promises.push(promise);
  }

  const results = await Promise.all(promises.map((prom) => prom.func(prom.arg)))
  localItems.push(...results.flatMap(x => x.body.results))

  console.timeEnd(`load ${viewClass}`);
  return localItems;
}
