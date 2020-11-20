<template>
  <div class="appointment-list">
    <div class="container">
      <div class="row row-striped" style="border: 1px solid #6c757d" v-for="appointment in appointments" :key="appointment.appointment_id">
        <div class="col-2 text-right">
          <h1 class="display-4"><span class="badge badge-secondary">{{ onlyDayFormat(appointment.appointment_time_start) }}</span></h1>
          <h2 class="text-uppercase">{{ onlyMonthFormat(appointment.appointment_time_start) }}</h2>
        </div>
        <div class="col-10">
          <h3 class="text-uppercase"><strong>{{ appointment.title }}</strong></h3>
          <ul class="list-inline">
            <li class="list-inline-item"><i class="fa fa-calendar-o" aria-hidden="true"></i> {{ dayNameFormat(appointment.appointment_time_start) }}</li>
            <li class="list-inline-item"><i class="fa fa-clock-o" aria-hidden="true"></i> {{ hoursAndMinutesFormat(appointment.appointment_time_start) }} - {{ hoursAndMinutesFormat(appointment.appointment_time_end) }}</li>
            <li class="list-inline-item"><i class="fa fa-location-arrow" aria-hidden="true"></i> Cafe</li>
            <div class="btn-group dropright">
              <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Customer Info
              </button>
              <div class="dropdown-menu">
                <!-- Dropdown menu links -->
                <a class="dropdown-item" href="#">{{ appointment.customer_name }}</a>
                <a class="dropdown-item" href="#">{{ appointment.customer_surname }}</a>
                <a class="dropdown-item" href="#">{{ appointment.customer_email }}</a>
                <a class="dropdown-item" href="#">{{ appointment.customer_phone }}</a>
              </div>
            </div>
          </ul>
          <p>{{ appointment.description }}</p>
        </div>
      </div>
    </div>
    <router-link to="/new-customer"> <a class="btn btn-secondary" href="#" role="button">Create a Appointment</a></router-link>
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
      const formatDate = dayjs(date).format('D')
      return formatDate
    },
    onlyMonthFormat(date) {
      const formatDate = dayjs(date).format('MMM')
      return formatDate
    },
    dayNameFormat(date) {
      const formatDate = dayjs(date).format('dddd')
      return formatDate
    },
    hoursAndMinutesFormat(date) {
      const formatDate = dayjs(date).format('hh:mm A')
      return formatDate
    },
  },
  computed: {
    userId() {
      return this.$store.state.user_id
    }
  }
}
</script>

