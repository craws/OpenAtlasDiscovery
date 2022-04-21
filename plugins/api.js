/* eslint-disable no-shadow,no-param-reassign */
import Vue from 'vue';
import Swagger from 'swagger-client';
import APISpec from '../assets/swagger.json';

const APIClient = {
  install(Vue) {
    Swagger({ spec: APISpec }).then((client) => {
      Vue.prototype.$client = client;
      Vue.prototype.$api = client.apis;
      console.log(Vue.prototype.$api);
    }, (error) => {
      console.error('failed to load api spec: %o', error);
    });
  },
};
Vue.use(APIClient);

export const loadAllFromCidocClass = async(viewClass, show,limit,relationType = []) => {
  console.time(`load ${viewClass}`);

  const p = await Vue.prototype.$api.Entities.get_api_0_3_query_({
    limit,
    view_classes: viewClass,
    show: show,
    relation_type:relationType

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
        page: i,
        relation_type:relationType
      }
    };
    promises.push(promise);
  }

  const results = await Promise.all(promises.map((prom) => prom.func(prom.arg)))
  localItems.push(...results.flatMap(x => x.body.results))

  console.timeEnd(`load ${viewClass}`);
  return localItems;
}
