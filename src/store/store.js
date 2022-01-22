import Vue from "vue";
import Vuex from "vuex";

import * as actions from "./actions";
import * as getters from "./getters";
import * as mutations from "./mutations";

Vue.use(Vuex);

export const state = {
    
    // Data for popup modal
    modalVisible: false,
    modalWorkingVisible: false,
	modalComponent: null,
    modalData: null,
    
    // App version
    version: {},

};

export const store = new Vuex.Store({
    state,
	getters,
    mutations,
    actions,
    modules: {
    }
});