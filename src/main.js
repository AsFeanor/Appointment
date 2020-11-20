import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import CxltToastr from 'cxlt-vue2-toastr'
// import * as VueGoogleMaps from "vue2-google-maps";

const toastrConfigs = {
  position: 'top center',
  showDuration: 750,
  timeOut: 1500,
  progressBar: true,
  showMethod: 'rubberBand',
  hideMethod: 'bounceOut',
}

Vue.config.productionTip = false

Vue.use(CxltToastr, toastrConfigs);
// Vue.use(VueGoogleMaps, {
//   load: {
//     key: "AIzaSyDUFjzh42D6Z7CuLOgB2crIXa1Q17DhFRc",
//     libraries: "places",
//     installComponents: true
//   }
// });

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
