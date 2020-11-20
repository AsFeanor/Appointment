import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import CustomerCreate from "@/components/CustomerCreate";
import Register from "@/components/auth/Register";
import Login from "@/components/auth/Login";
import store from '../store'
import Address from "@/components/Address";

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
    path: `/addresses`,
    name: 'Address',
    component: Address,
    // beforeEnter(to, from, next){
    //   if (store.getters.isAuthenticated) {
    //     next()
    //   }else {
    //     next('/login')
    //   }
    // }
  },
  {
    path: '/new-customer',
    name: 'CustomerCreate',
    component: CustomerCreate,
    // beforeEnter(to, from, next){
    //   if (store.getters.isAuthenticated) {
    //     next()
    //   }else {
    //     next('/login')
    //   }
    // }
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
