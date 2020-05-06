import Vue from 'vue/dist/vue.esm'
import Vuex from 'vuex'

import lists from './lists'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    lists
  }
})
