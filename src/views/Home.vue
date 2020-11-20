<template>
  <div class="home">
    <AppointmentList/>
  </div>
</template>

<script>
// @ is an alias to /src
import AppointmentList from '@/components/AppointmentList.vue'

export default {
  name: 'Home',
  components: {
    AppointmentList
  }
}
</script>
