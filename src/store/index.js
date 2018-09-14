import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app';
import user from './modules/user';
import drugerDetail from './modules/drugerDetail';

Vue.use(Vuex);

const store = new Vuex.Store({
    mutations: {
        //
    },
    actions: {

    },
    getters: {

    },
    modules: {
        app,
        user,
        drugerDetail
    }
});

export default store;