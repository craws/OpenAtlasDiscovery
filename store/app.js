import menuitems from '../assets/menuqueries.json';
import classes from '../assets/classes.json';

/* eslint-disable no-param-reassign,no-shadow */
export const state = () => ({
  queryDrawer: false,
  menuitems,
  classes,
});

export const getters = () => ({
  getIconBySystemClass: (s) => (c) => s.classes.find(item => item.systemClass === c)['icon'],
  getIconByCidocClass: (s) => (c) => s.classes.find(item => item.crmClass === c)['icon'],
  getLabelBySystemClass: (s) => ({ c, l }) => s.classes.find(item => item.systemClass === c)[l],
});

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
