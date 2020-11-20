<template>
  <nav class="navbar navbar-expand-lg navbar-dark shadow mb-5">
    <a class="navbar-brand" href="#">Appointment</a>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <router-link tag="li" to="/" class="nav-item"><a class="nav-link" href="#">Appointments</a></router-link>
        <router-link tag="li" to="/new-customer" class="nav-item"><a class="nav-link" href="#">Add Appointment</a></router-link>
      </ul>
      <ul class="navbar-nav my-2 my-lg-0" :class="logoutClass">
        <li class="nav-item">
          <a @click.prevent="logout" class="nav-link" href="#">Logout</a>
        </li>
      </ul>
    </div>
  </nav>
</template>
<script>
export default {
  name: 'Header',
  methods: {
    logout() {
      this.$store.dispatch('logout');
    }
  },
  computed: {
    logoutClass() {
      return {
        'd-none': !this.$store.getters.isAuthenticated
      }
    }
  }
}
</script>

<style scoped>
  nav{
    background-color: #26263e;
    margin: 0 !important;
  }
</style>
