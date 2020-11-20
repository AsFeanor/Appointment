<template>
  <div>
    <div style="display: flex">
      <button @click="initMap('DRIVING')">Driving</button>
      <button @click="initMap('WALKING')">Walking</button>
      <button @click="initMap('BICYCLING')">Bicycling</button>
      <button @click="initMap('TRANSIT')">Transit</button>
    </div>
    <div class="google-map" id="map">


    </div>
    <div style="display: flex">{{ zaman }}</div>
  </div>
</template>

<script>
import axios from 'axios';
import dayjs from 'dayjs';

export default {
  name: "Address",
  data() {
    return {
      map: null,
      lat: "",
      lng: "",
      mapCenter: {lat: 51.69285, lng: 0.0433281},
      property: this.lat && this.lng ? new google.maps.LatLng(this.lat,this.lng) : null,
      zaman: "",
      bounds: null,
      markersArray: []
    }
  },
  mounted() {
    this.initMap(`DRIVING`);
    this.bounds = new google.maps.LatLngBounds();
    const coord = this.mapCenter
    const position = new google.maps.LatLng(coord.latitude, coord.longitude);
    google.maps.event.addListener(this.map, 'click', e => {
      this.addMarker(e.latLng, 1);
      this.property = e.latLng;
      this.calcRoute();
    });
    google.maps.event.addListenerOnce(this.ourMap, 'idle', e=>{
      this.addMarker(position, 0)
      this.mapCenter = position;
      if(this.property){
        this.addMarker(this.property, 1);
        this.calcRoute();
      }
    });
  },
  methods: {
    calcRoute(travels) {
      const request = {
        origin: this.mapCenter,
        destination: this.property,
        travelMode: travels
      };
    },
    initMap() {
      let dS = new google.maps.DirectionsService();
      let dD = new google.maps.DirectionsRenderer();
      var vm = this
      this.ourMap = new google.maps.Map(document.getElementById('map'),{
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
      // let request = {
      //   origin: this.mapCenter,
      //   destination: this.property,
      //   travelMode: travels
      // };
      // dD.setMap(this.ourMap);
      dS.route(request, function (result,status){
        console.log(result.routes[0].legs[0].duration);
        let sc = result.routes[0].legs[0].duration.value;
        vm.zaman = parseInt(sc/60);
        if (status == "OK"){
          console.log(result);
          vm.markersArray[0].setMap(null)
          vm.markersArray[1].setMap(null)
          dD.setDirections(result);
          vm.lat = result.request.destination.location.lat();
          vm.lng = result.request.destination.location.lng();
          // let steps = result.routes[0].legs[0].steps;
          // steps.forEach((res,key)=>{
          //   const markers = new google.maps.Marker({
          //     position: {lat:res.start_location.lat(),lng:res.start_location.lng()},
          //     map: this.ourMap,
          //     label:{
          //       text: "",
          //       color:"#FFF"
          //     }
          //   })
          // })

        }else {
          console.log(status);
        }
      })
    },
    addMarker(location, index) {
      let marker = new google.maps.Marker({
        position: location,
        map: this.ourMap
      });
      this.markersArray[index] = marker
      if (index){
        this.ourMap.fitBounds(this.bounds.extend(location))
      }
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
</style>

