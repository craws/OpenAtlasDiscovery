import menuitems from '../assets/menuqueries.json';
import classes from '../assets/classes.json';
import tableheaders from '../assets/tableheaders.json';
import templateprops from '../assets/templateprops.json';

/* eslint-disable no-param-reassign,no-shadow */
export const state = () => ({
  siteContent: '',
  queryDrawer: false,
  menuitems,
  classes,
  tableheaders,
  templateprops,
  eventDates: [],
  geoItems: [],
  tempItems: [],
});

export const getters = {
  getIconBySystemClass: (s) => (c) => s.classes.find((item) => item.systemClass === c).icon,
  getLabelBySystemClass: (s) => ({c, l}) => s.classes.find((item) => item.systemClass === c)[l],
  getCRMClassBySystemClass: (s) => (c) => s.classes.find((item) => item.systemClass === c).crmClass,
  getSortColumnByPath: (s) => (p) => {
    let h = s.tableheaders.wide.find((h) => h.value === p);
    if (h && h.column) return h.column;
    h = s.tableheaders.narrow.find((h) => h.value === p);
    if (h && h.column) return h.column;
    return null;
  },
  hasTime: (s) => (c) => s.templateprops.hasTime.includes(c),
  hasSex: (s) => (c) => s.templateprops.hasSex.includes(c),
  getGeoItems: (s) => s.geoItems,
  getTempItems: (s) => s.tempItems,
  getGeoItemsAsFeatureCollection: (s) => s.geoItems.features.map((f) => ({
    features: [f],
    type: 'FeatureCollection',
  })),
  getTempItemsAsTimeStamps: (s) => s.tempItems.map((r) => {
    if (r.features[0].when.timespans[0].start.earliest !== 'None') return `${r.features[0].when.timespans[0].start.earliest}T00:00:00.000Z`;
    if (r.features[0].when.timespans[0].end.earliest !== 'None') return `${r.features[0].when.timespans[0].end.earliest}T00:00:00.000Z`;
    return null;
  }).filter((r) => r),
  getGeoItemById: (s) => (id) => s.geoItems.filter((f) => f.properties.id === id)[0],
  getGeometryById: (s) => (id) => s.geoItems.filter((f) => f.properties.id === id)
    .map((f) => f.geometry)[0],
};

export const mutations = {
  openQueryDrawer(state) {
    state.queryDrawer = true;
  },
  closeQueryDrawer(state) {
    state.queryDrawer = false;
  },
  toggleQueryDrawer(state) {
    state.queryDrawer = !state.queryDrawer;
  },
  setSiteContent(state, content) {
    state.SiteContent = content;
  },
  setGeoItems(state, items) {
    state.geoItems = items;
  },
  setTempItems(state, items) {
    state.tempItems = items;
  },
};

export const actions = {};
