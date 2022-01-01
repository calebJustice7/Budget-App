"use strict";

// USAGE
// to dispatch an action, use this within component: 
    // this.$store.dispatch(<actionName<String>>, <payload<Any>>);   

// Within an action, use commit(<mutationName<String>>, <payload<Any>>);

// For getters: this.$store.getters['getUser']

// Within a mutation, just set state property and it will update

// To use logout, pass in $router as payload: 
    // this.$store.dispatch('logOut', {router: this.$router});

import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import * as getters from './getters';
import mutations from './mutations'

Vue.use(Vuex);

const state = {
  user: {}
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
});
