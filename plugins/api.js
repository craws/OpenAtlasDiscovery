import Vue from 'vue';
import Swagger from 'swagger-client';
import APISpec from '../assets/swagger.json';

const APIClient = {
  install(Vue) {
    Swagger({ spec: APISpec }).then((client) => {
      Vue.prototype.$client = client;
      Vue.prototype.$api = client.apis;
    }, (error) => {
      console.error('failed to load api spec: %o', error);
    });
  },
};

Vue.use(APIClient);
