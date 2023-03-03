import Vue from 'vue'
import Vuex from 'vuex'

import { getToken } from '@/utils/token'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    photo: '',
    token: getToken()
  },
  mutations: {
    SET_PHOTO(state, photo) {
      state.photo = photo
    }
  },
  actions: {
  },
  // modules: {
  // }
})
