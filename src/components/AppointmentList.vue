<template>
  <div class="appointment-list">
    <div class="container">
      <div class="row row-striped" v-for="appointment in sortedAppointments" :key="appointment.appointment_id">
        <div class="col-2 text-right">
          <h1 class="display-4"><span class="badge badge-secondary">{{ onlyDayFormat(appointment.appointment_time_start) }}</span></h1>
          <h2 class="text-uppercase text-color">{{ onlyMonthFormat(appointment.appointment_time_start) }}</h2>
        </div>
        <div class="col-10">
          <h3 class="text-uppercase text-color"><strong><router-link :to="`appointment/${appointment.appointment_id}`"><a href="" >{{ appointment.title }}</a></router-link></strong></h3>
          <ul class="list-inline text-color">
            <li class="list-inline-item"><i class="fa fa-calendar-o icons" aria-hidden="true"></i> {{ dayNameFormat(appointment.appointment_time_start) }}</li>
            <li class="list-inline-item"><i class="fa fa-clock-o icons" aria-hidden="true"></i> {{ hoursAndMinutesFormat(appointment.appointment_time_start) }} - {{ hoursAndMinutesFormat(appointment.appointment_time_end) }}</li>
            <li class="list-inline-item"><i class="fa fa-user icons icons" aria-hidden="true"></i> {{ appointment.customer_name }}</li>
            <li class="list-inline-item"><i class="fa fa-location-arrow icons" aria-hidden="true"></i> {{ appointment.location }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import dayjs from 'dayjs';

export default {
  name: 'AppointmentList',
  data() {
    return{
      appointments: [],
      date: new Date(),
    }
  },
  mounted() {
    const userID = this.userId
    axios.get(`http://laravelapi.test/api/user/`+ userID + `/appointments`)
    .then((response) => {
      this.appointments = response.data;
    })
    .catch((e) => {
      this.appointments = console.log(e)
    });
  },
  methods:{
    onlyDayFormat(date) {
      return dayjs(date).format('D')
    },
    onlyMonthFormat(date) {
      return dayjs(date).format('MMM')
    },
    dayNameFormat(date) {
      return dayjs(date).format('dddd')
    },
    hoursAndMinutesFormat(date) {
      return dayjs(date).format('hh:mm A')
    },
  },
  computed: {
    userId() {
      return this.$store.state.user_id
    },
    sortedAppointments(){
      function compare(a, b){
        if (a.appointment_time_start < b.appointment_time_start)
          return -1;
        if (a.appointment_time_start > b.appointment_time_start)
          return 1;
        return 0;
      }
      return this.appointments.sort(compare);
    }
  }
}
</script>

<style scoped>
.appointment-list {
  align-items: center;
  background-color: #000;
  display: compact;
  justify-content: center;
  height: 100%;
  min-height: 100vh;
}

.row-striped {
  background-color: #15172b;
  border: 1px solid #3a3a47;
  transition-duration: 1.5s;
}

.badge-secondary {
  background-color: #65657b !important;
}

.text-color {
  color: whitesmoke;
}

.icons {
  color: #6a6a81;
}

a {
  text-decoration: none;
  color: whitesmoke;
  transition-duration: 0.5s;
}

a:hover {
  color: #65657b;
}

.row-striped:hover {
  background-color: #383851;
}
</style>
