import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from '@/router'
import dayjs from "dayjs";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    jwtToken: "",
    user_id: "",
    apiUrl: 'http://laravelapi.test/api/appointments',
    appointments: [],
    appointment: {},
    appointmentStart: null,
    appointmentEnd: null,
    property: {
      lat: null,
      lng: null
    },
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
    setAppointments(state, appointments) {
      state.appointments = appointments
    },
    setAppointment(state, appointment) {
      state.appointment = appointment
    },
    setAppointmentStart(state, appointmentStart) {
      state.appointmentStart = appointmentStart
    },
    setAppointmentEnd(state, appointmentEnd) {
      state.appointmentEnd = appointmentEnd
    },
    setPropertyLat(state, lat) {
      state.property.lat = lat
    },
    setPropertyLng(state, lng) {
      state.property.lng = lng
    },
  },
  actions: {
    fetchAppointments({ commit,state }) {
      axios.get('http://laravelapi.test/api/user/' + state.user_id + '/appointments')
          .then((response) =>{
            commit('setAppointments', response.data)
          })
    },
    fetchAppointment({ commit,state }, payload) {
      axios.get(state.apiUrl + '/' + payload.selectedRoute)
          .then((response) => {
            commit('setPropertyLat' ,parseFloat(response.data.lat));
            commit('setPropertyLng' ,parseFloat(response.data.lng));
            commit('setAppointment', response.data)
          })
    },
    fetchFormattedAppointment({ commit,state }, payload) {
      axios.get(state.apiUrl + '/' + payload.selectedRoute)
          .then((response) => {
            commit('setAppointmentStart', dayjs(response.data.appointment_time_start).format('YYYY-MM-DDThh:mm'))
            commit('setAppointmentEnd', dayjs(response.data.appointment_time_end).format('YYYY-MM-DDThh:mm'))
            commit('setAppointment', response.data)
          })
    },
    updateAppointment({ dispatch,state },payload) {
      console.log(payload);
      return axios.put(state.apiUrl + '/' + payload.selectedRoute,{
        customer_name: payload.customer_name,
        customer_surname: payload.customer_surname,
        customer_email: payload.customer_email,
        customer_phone: payload.customer_phone,
        appointment_time_start: payload.appointment_time_start,
        appointment_time_end: payload.appointment_time_end,
        title: payload.title,
        description: payload.description,
        user_id: payload.userID,
        lat: payload.lat,
        lng: payload.lng,
        location: payload.appointmentLocation
      })
          .then((response) => {
            console.log(response);
          })
          .catch((e) => {
            console.log(e)
          })
    },
    deleteAppointment({ state }, payload) {
      axios.delete(state.apiUrl + '/' + payload.selectedRoute)
          .then((response) =>{
            console.log(response);
          })
    },
    addAppointment({ dispatch,state }, payload) {
      return axios.post(state.apiUrl,{
        customer_name: payload.customer_name,
        customer_surname: payload.customer_surname,
        customer_email: payload.customer_email,
        customer_phone: payload.customer_phone,
        appointment_time_start: payload.appointment_time_start,
        appointment_time_end: payload.appointment_time_end,
        title: payload.title,
        description: payload.description,
        user_id: payload.user_id,
        lat: payload.lat,
        lng: payload.lng,
        location: payload.location
      })
          .then((response) => {
            console.log(response);
          })
          .catch((e) => {
            console.log(e)
          })
    },
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
      return axios.post('http://laravelapi.test/api/user-create', {
        name: authData.name,
        email: authData.email,
        password: authData.password})
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
    },
  },
  getters: {
    isAuthenticated(state) {
      if (state.jwtToken) {
        return state.jwtToken !== ""
      }else {
         return false
      }
    },
  },
})
