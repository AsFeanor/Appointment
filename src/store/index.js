import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from '@/router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    jwtToken: "",
    user_id: ""
  },
  mutations: {
    setToken(state, jwtToken) {
      state.jwtToken = jwtToken
    },
    clearToken(state) {
      state.jwtToken = ""
    },
    setID(state, user_id) {
      state.user_id = user_id
    },
    clearID(state) {
      state.user_id = ""
    },
  },
  actions: {
    initAuth({ commit }) {
      let jwtToken = localStorage.getItem('jwtToken');
      let user_id = localStorage.getItem('user_id');
      if (jwtToken && user_id) {
        commit('setToken', jwtToken);
        commit('setID', user_id);
        router.push('/').catch(()=>{});
      }else {
        router.push('/login').catch(()=>{});
        return false;
      }
    },
    register({ commit, dispatch, state }, authData) {
      return axios.post('http://laravelapi.test/api/user-create', {name: authData.name, email: authData.email, password: authData.password})
          .then((response) => {
            console.log(response.data);
          })
          .catch((e) => console.log(e));
    },
    login({ commit, dispatch, state }, authData) {
      return axios.post('http://laravelapi.test/api/login',
          { email: authData.email, password: authData.password })
          .then((response) => {
            console.log(response.data);
            commit('setToken', response.data.jwtToken);
            commit('setID', response.data.user.user_id)
            localStorage.setItem('jwtToken', response.data.jwtToken);
            localStorage.setItem('user_id', response.data.user.user_id)
          })
          .catch((e) => console.log(e));
    },
    logout({ commit }) {
      commit('clearToken');
      commit('clearID');
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('user_id');
      router.replace('/login')
    }
  },
  getters: {
    isAuthenticated(state) {
      if (state.jwtToken) {
        return state.jwtToken !== ""
      }else {
         return false
      }
    }
  },
})
