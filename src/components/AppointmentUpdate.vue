<template>
  <div class="appointment-update">
    <form class="form" @submit.prevent="submitDelay">
      <h2 class="title">Add Customer</h2>
      <p class="subtitle">Let's add a customer infos</p>
      <div class="input-container ic1">
        <input v-model="appointments.customer_name" id="firstname" class="input" type="text" placeholder=" " />
        <div class="cut"></div>
        <label for="firstname" class="placeholder">First name</label>
      </div>
      <div class="input-container ic2">
        <input v-model="appointments.customer_surname" id="lastname" class="input" type="text" placeholder=" " />
        <div class="cut"></div>
        <label for="lastname" class="placeholder">Last name</label>
      </div>
      <div class="input-container ic2">
        <input v-model="appointments.customer_email" id="email" class="input" type="text" placeholder="email@example.com"/>
        <div class="cut cut-short"></div>
        <label for="email" class="placeholder">Email</label>
      </div>
      <div class="input-container ic2">
        <input v-model="appointments.customer_phone" id="phone" class="input" type="tel" placeholder=" " />
        <div class="cut cut-short"></div>
        <label for="phone" class="placeholder">Phone</label>
      </div>
    </form>
    <form class="form" @submit.prevent="submitDelay">
      <h2 class="title">Appointment</h2>
      <p class="subtitle">Let's add a appointment detail</p>
      <div class="input-container ic1">
        <input v-model="appointments.title" id="title" class="input" type="text" placeholder=" " />
        <div class="cut cut-short"></div>
        <label for="title" class="placeholder">Title</label>
      </div>
      <div class="input-container ic2">
        <input v-model="appointmentStart" id="time-start" class="input" type="datetime-local" placeholder=" " />
        <div class="cut"></div>
        <label for="time-start" class="placeholder">Start Time</label>
      </div>
      <div class="input-container ic2">
        <input v-model="appointmentEnd" id="time-end" class="input" type="datetime-local" placeholder=" " />
        <div class="cut"></div>
        <label for="time-end" class="placeholder">End Time</label>
      </div>
      <div class="input-container ic2">
        <textarea v-model="appointments.description" id="description" class="input" type="text" placeholder=" " />
        <div class="cut"></div>
        <label for="description" class="placeholder">Description</label>
      </div>
      <button @click.prevent="submitDelay" class="submit">Update</button>
    </form>
    <form class="form">
      <h2 class="title">Add Location</h2>
      <div class="input-container ic1">
        <div style="display: flex">
          <button @click.prevent="calcRoute('DRIVING')" class="travels">Driving</button>
          <button @click.prevent="calcRoute('WALKING')" class="travels">Walking</button>
          <button @click.prevent="calcRoute('BICYCLING')" class="travels">Bicycling</button>
          <button @click.prevent="calcRoute('TRANSIT')" class="travels">Transit</button>
        </div>
        <div class="google-map" :id="mapName"></div>
        <div style="display: flex; color: white">Estimated time of arrival:  <p style="font-weight: bold; color: whitesmoke; text-decoration: underline">{{ zaman }}</p></div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import dayjs from 'dayjs';

export default {
  name: "AppointmentUpdate",
  data() {
    return {
      selectedRoute: this.$route.params.appointment_id,
      mapName: 'map',
      markerCoordinates: {
        latitude: 51.69285,
        longitude: 0.0433281
      },
      lat: null,
      lng: null,
      map: null,
      bounds: null,
      markers: [],
      directionsService: new google.maps.DirectionsService(),
      directionsDisplay: new google.maps.DirectionsRenderer(),
      startPoint: undefined,
      endPoint: null,
      appointmentLocation: "",
      zaman: ""
    }
  },
  methods: {
    submitForm() {
      this.$store.dispatch('updateAppointment', {
        customer_name: this.appointments.customer_name,
        customer_surname: this.appointments.customer_surname,
        customer_email: this.appointments.customer_email,
        customer_phone: this.appointments.customer_phone,
        appointment_time_start: this.appointments.appointment_time_start,
        appointment_time_end: this.appointments.appointment_time_end,
        title: this.appointments.title,
        description: this.appointments.description,
        user_id: this.userID,
        lat: this.lat,
        lng: this.lng,
        location: this.appointmentLocation,
        selectedRoute: this.selectedRoute
      })
    },
    submitDelay() {
      const titleIsValid = !!this.appointments.title
      const customerNameIsValid = !!this.appointments.customer_name
      const customerPhoneIsValid = !!this.appointments.customer_phone
      const customerSurnameIsValid = !!this.appointments.customer_surname
      const customerEmailIsValid = !!this.appointments.customer_email
      const appointmentIsValid = titleIsValid && customerNameIsValid && customerEmailIsValid && customerSurnameIsValid && customerPhoneIsValid
      if (appointmentIsValid) {
        this.$toast.info({
          title: 'Appointment Updated',
          message: 'Your appointment has been successfully updated'
        });
        setTimeout(() => {
          this.submitForm()
          this.$router.push('/')
        }, 2000)
      }else{
        this.$toast.error({
          title: 'Failed to Update Appointment',
          message: 'Customer Data and Title is required.'
        })
      }
    },
    changeCoords(latLng){
      this.lat = latLng.lat();
      this.lng = latLng.lng();
    },
    calcRoute(travels) {
      const request = {
        origin: this.startPoint,
        destination: this.endPoint,
        travelMode: travels
      };
      this.directionsService.route(request, (result, status) => {
        if (status == 'OK') {
          this.markers[0].setMap(null)
          this.markers[1].setMap(null)
          this.directionsDisplay.setDirections(result);
          this.lat = result.request.destination.location.lat();
          this.lng = result.request.destination.location.lng();
          this.zaman = result.routes[0].legs[0].duration.text;
          this.appointmentLocation = result.routes[0].legs[0].end_address;
          console.log(result);
        }
      })
    },
    addMarker(location, index) {
      let marker = new google.maps.Marker({
        position: location,
        map: this.map
      });
      this.markers[index] = marker
      if (index){
        this.map.fitBounds(this.bounds.extend(location))
      }
    }
  },
  created() {
    this.$store.dispatch('fetchFormattedAppointment', {selectedRoute: this.selectedRoute})
  },
  mounted() {
    this.bounds = new google.maps.LatLngBounds();
    const coord = this.markerCoordinates
    const position = new google.maps.LatLng(coord.latitude, coord.longitude);
    const options = {
      center: position,
      zoom: 15,
      styles: [
        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        {
          featureType: "administrative.locality",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "poi",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [{ color: "#263c3f" }],
        },
        {
          featureType: "poi.park",
          elementType: "labels.text.fill",
          stylers: [{ color: "#6b9a76" }],
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#38414e" }],
        },
        {
          featureType: "road",
          elementType: "geometry.stroke",
          stylers: [{ color: "#212a37" }],
        },
        {
          featureType: "road",
          elementType: "labels.text.fill",
          stylers: [{ color: "#9ca5b3" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [{ color: "#746855" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [{ color: "#1f2835" }],
        },
        {
          featureType: "road.highway",
          elementType: "labels.text.fill",
          stylers: [{ color: "#f3d19c" }],
        },
        {
          featureType: "transit",
          elementType: "geometry",
          stylers: [{ color: "#2f3948" }],
        },
        {
          featureType: "transit.station",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#17263c" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [{ color: "#515c6d" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.stroke",
          stylers: [{ color: "#17263c" }],
        },
      ],
    }
    this.map = new google.maps.Map(document.getElementById(this.mapName), options);
    google.maps.event.addListener(this.map, 'click', e => {
      this.changeCoords(e.latLng);
      this.addMarker(e.latLng, 1);
      this.endPoint = e.latLng;
      this.calcRoute('DRIVING');
    });
    google.maps.event.addListenerOnce(this.map, 'idle', e=>{
      this.addMarker(position, 0)
      this.startPoint = position;
      if(this.endPoint){
        this.addMarker(this.endPoint, 1);
        this.calcRoute('DRIVING');
      }
    });
    this.directionsDisplay.setMap(this.map);
  },
  computed: {
    userID() {
      return this.$store.state.user_id
    },
    appointments() {
      return this.$store.state.appointment
    },
    appointmentStart() {
      return this.$store.state.appointmentStart
    },
    appointmentEnd() {
      return this.$store.state.appointmentEnd
    },
  }
}
</script>

<style scoped>
.google-map{
  width: 100%;
  height: 350px;
  margin: 0 auto;
  margin-top: 10px;
  margin-bottom: 15px;
  background: gray;
}

.travels{
  background-color: #303245;
  color: #65657b;
  font-family: sans-serif;
}

.appointment-update {
  align-items: center;
  background-color: #000;
  display: flex;
  justify-content: center;
  height: 100vh;
}

.form {
  background-color: #15172b;
  border-radius: 20px;
  box-sizing: border-box;
  height: 580px;
  padding: 40px;
  margin: 25px;
  width: 400px;
}

.title {
  color: #eee;
  font-family: sans-serif;
  font-size: 36px;
  font-weight: 600;
  margin: 0;
}

.subtitle {
  color: #eee;
  font-family: sans-serif;
  font-size: 16px;
  font-weight: 600;
  margin-top: 10px;
}

.input-container {
  height: 50px;
  position: relative;
  width: 100%;
}

.ic1 {
  margin-top: 40px;
}

.ic2 {
  margin-top: 30px;
}

.input {
  background-color: #303245;
  border-radius: 12px;
  border: 0;
  box-sizing: border-box;
  color: #eee;
  font-size: 18px;
  height: 100%;
  outline: 0;
  padding: 4px 20px 0;
  width: 100%;
  transition: box-shadow 0.2s ease-in-out;
  box-shadow: inset 0 0 0 0 transparent;
}

.input:focus {
  box-shadow: inset 0 0 0 2px #dc2f55;
}

.cut {
  background-color: #15172b;
  border-radius: 10px;
  height: 20px;
  left: 20px;
  position: absolute;
  top: -20px;
  transform: translateY(0);
  transition: transform 200ms;
  width: 76px;
}

.cut-short {
  width: 50px;
}

.input:focus ~ .cut,
.input:not(:placeholder-shown) ~ .cut {
  transform: translateY(8px);
}

.placeholder {
  color: #65657b;
  font-family: sans-serif;
  left: 20px;
  line-height: 14px;
  pointer-events: none;
  position: absolute;
  transform-origin: 0 50%;
  transition: transform 200ms, color 200ms;
  top: 20px;
}

.input:focus ~ .placeholder,
.input:not(:placeholder-shown) ~ .placeholder {
  transform: translateY(-30px) translateX(10px) scale(0.75);
}

.input:not(:placeholder-shown) ~ .placeholder {
  color: #808097;
}

.input:focus ~ .placeholder {
  color: #dc2f55;
}

.submit {
  background-color: #08d;
  border-radius: 12px;
  border: 0;
  box-sizing: border-box;
  color: #eee;
  cursor: pointer;
  font-size: 18px;
  height: 50px;
  margin-top: 38px;
  outline: 0;
  text-align: center;
  width: 100%;
  transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  box-shadow: inset 0 0 0 0 transparent;
}

.submit:active {
  background-color: #06b;
}

.submit:hover {
  background-color: #06b;
  box-shadow: inset 0 0 0 2px #ffffff;
}

.submit:focus {
  background-color: #06b;
  box-shadow: inset 0 0 0 2px #ffffff;
}

::-webkit-input-placeholder {
  /* Edge */
  color: #65657b;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: #65657b;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

::placeholder {
  color: #65657b;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

input:focus::-webkit-input-placeholder {
  /* Edge */
  opacity: 1;
}

input:focus:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  opacity: 1;
}

input:focus::placeholder {
  opacity: 1;
}
</style>
