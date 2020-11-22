import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import CustomerCreate from "@/components/CustomerCreate";
import Register from "@/components/auth/Register";
import Login from "@/components/auth/Login";
import store from '../store'
import AppointmentDetail from "@/components/AppointmentDetail";

Vue.use(VueRouter)

const routes = [
  {
    path: `/`,
    name: 'Home',
    component: Home,
    beforeEnter(to, from, next){
      if (store.getters.isAuthenticated) {
        next()
      }else {
        next('/login')
      }
    }
  },
  {
    path: `/appointment/:appointment_id`,
    name: 'AppointmentDetail',
    component: AppointmentDetail,
    beforeEnter(to, from, next){
      if (store.getters.isAuthenticated) {
        next()
      }else {
        next('/login')
      }
    }
  },
  {
    path: '/new-customer',
    name: 'CustomerCreate',
    component: CustomerCreate,
    beforeEnter(to, from, next){
      if (store.getters.isAuthenticated) {
        next()
      }else {
        next('/login')
      }
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
