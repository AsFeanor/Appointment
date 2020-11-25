<template>
  <div class="AppointmentDetail">
    <form class="form">
      <h2 class="title">{{ appointments.title }}</h2>
      <p class="subtitle">{{ appointments.description }}</p>
      <div class="input-container ic2">
        <div class="appointment-info">Customer Firstname: <p class="appointment-info-inline">{{ appointments.customer_name }}</p></div>
        <div class="appointment-info">Customer Lastname: <p class="appointment-info-inline">{{ appointments.customer_surname }}</p></div>
        <div class="appointment-info">Customer Email: <p class="appointment-info-inline">{{ appointments.customer_email }}</p></div>
        <div class="appointment-info">Customer Phone: <p class="appointment-info-inline">{{ appointments.customer_phone }}</p></div>
        <div class="appointment-info">Start Time: <p class="appointment-info-inline">{{ appointments.appointment_time_start }}</p></div>
        <div class="appointment-info">End Time: <p class="appointment-info-inline">{{ appointments.appointment_time_end }}</p></div>
        <router-link :to="`/appointment-update/${appointments.appointment_id}`"><button class="update">Update</button></router-link>
        <button @click.prevent="deleteDelay" class="delete">Delete</button>
      </div>
    </form>
    <div>
      <form class="form">
      <div style="display: flex">
        <button @click.prevent="initMap('DRIVING')" class="travels">Driving</button>
        <button @click.prevent="initMap('WALKING')" class="travels">Walking</button>
        <button @click.prevent="initMap('BICYCLING')" class="travels">Bicycling</button>
        <button @click.prevent="initMap('TRANSIT')" class="travels">Transit</button>
      </div>
      <div class="google-map" id="map"></div>
        <div style="display: flex; color: white">Estimated time of arrival:  <p style="font-weight: bold; color: whitesmoke; text-decoration: underline">{{ zaman }}</p></div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
name: "AppointmentDetail",
  data() {
    return {
      map: null,
      mapCenter: {lat: 51.69285, lng: 0.0433281},
      zaman: "",
      markersArray: [],
      selectecRoute: this.$route.params.appointment_id
    }
  },
  mounted() {
    this.fetchProperty();
  },
  watch: {
    appointments() {
      this.initMap('DRIVING')
    },
  },
  methods: {
    fetchProperty() {
      this.$store.dispatch('fetchAppointment', {selectedRoute: this.selectecRoute})
    },
    deleteProperty() {
      this.$store.dispatch('deleteAppointment', {selectedRoute: this.selectecRoute})
    },
    deleteDelay() {
      this.$toast.warn({
        title: 'Appointment Deleted',
        message: 'Your appointment has been successfully deleted'
      });
      setTimeout(() => {
        this.deleteProperty()
        this.$router.push('/')
      }, 2000)
    },
    initMap(travels) {
      let dS = new google.maps.DirectionsService();
      let dD = new google.maps.DirectionsRenderer();
      var vm = this
      this.ourMap= new google.maps.Map(document.getElementById('map'),{
        center: this.mapCenter,
        zoom: 8,
        maxZoom: 20,
        minZoom: 3,
        streetViewControl: true,
        mapTypeControl: true,
        fullscreenControl: true,
        zoomControl: true,
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
      });
      let request = {
        origin: this.mapCenter,
        destination: this.property,
        travelMode: travels
      };
      dD.setMap(this.ourMap);
      dS.route(request, function (result,status){
        console.log(result.routes[0].legs[0].duration);
        vm.zaman = result.routes[0].legs[0].duration.text;
        if (status == "OK"){
          console.log(result);
          dD.setDirections(result);
        }else {
          console.log(status);
        }
      })
    },
  },
  computed: {
    appointments() {
      return this.$store.state.appointment
    },
    property() {
      return this.$store.state.property
    }
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

.AppointmentDetail {
  align-items: center;
  background-color: #000;
  display: flex;
  justify-content: center;
  height: 100vh;
}

.appointment-info {
  color: #bebebe;
  font-weight: bold;
}

.appointment-info-inline {
  color: whitesmoke;
  font-weight: normal !important;
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
  color: whitesmoke;
  font-family: sans-serif;
  font-size: 32px;
  font-weight: 600;
  margin: 0;
}

.subtitle {
  color: #b1b1b1;
  font-family: sans-serif;
  font-size: 16px;
  font-weight: 600;
  margin-top: 5px;
  margin-bottom: 5px;
}

.input-container {
  height: 50px;
  position: relative;
  width: 100%;
}

.ic2 {
  margin-top: 2px;
}

.update {
  background-color: #08d;
  border-radius: 12px;
  border: 0;
  box-sizing: border-box;
  color: #eee;
  cursor: pointer;
  font-size: 18px;
  height: 50px;
  margin-top: 5px;
  outline: 0;
  text-align: center;
  width: 50%;
  transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  box-shadow: inset 0 0 0 0 transparent;
}

.update:active {
  background-color: #06b;
}

.update:hover {
  background-color: #06b;
  box-shadow: inset 0 0 0 2px #ffffff;
}

.update:focus {
  background-color: #06b;
  box-shadow: inset 0 0 0 2px #ffffff;
}

.delete {
  background-color: #b80303;
  border-radius: 12px;
  border: 0;
  box-sizing: border-box;
  color: #eee;
  cursor: pointer;
  font-size: 18px;
  height: 50px;
  margin-top: 5px;
  outline: 0;
  text-align: center;
  width: 50%;
  transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  box-shadow: inset 0 0 0 0 transparent;
}

.delete:active {
  background-color: #a00202;
}

.delete:hover {
  background-color: #a00202;
  box-shadow: inset 0 0 0 2px #ffffff;
}

.delete:focus {
  background-color: #a00202;
  box-shadow: inset 0 0 0 2px #ffffff;
}

::-webkit-input-placeholder {
  color: #65657b;
  opacity: 0;
  transition: opacity .2s ease-in-out;
}

:-ms-input-placeholder {
  color: #65657b;
  opacity: 0;
  transition: opacity .2s ease-in-out;
}

::placeholder {
  color: #65657b;
  opacity: 0;
  transition: opacity .2s ease-in-out;
}
</style>
