import menuitems from '../assets/menuqueries.json';
import classes from '../assets/classes.json';
import tableheaders from '../assets/tableheaders.json';

/* eslint-disable no-param-reassign,no-shadow */
export const state = () => ({
  queryDrawer: false,
  menuitems,
  classes,
  tableheaders,
});

export const getters = {
  getIconBySystemClass: (s) => (c) => s.classes.find((item) => item.systemClass === c).icon,
  getLabelBySystemClass: (s) => ({ c, l }) => s.classes.find((item) => item.systemClass === c)[l],
  getCRMClassBySystemClass: (s) => (c) => s.classes.find((item) => item.systemClass === c).crmClass,
  getSortColumnByPath: (s) => (p) => {
    let h = s.tableheaders.wide.find((h) => h.value === p);
    if (h && h.column) return h.column;
    h = s.tableheaders.narrow.find((h) => h.value === p);
    if (h && h.column) return h.column;
    return null;
  },
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
};

export const actions = {

};
