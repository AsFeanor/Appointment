<template>
  <div class="customer-create">
    <form class="form" @submit.prevent="submitDelay">
      <h2 class="title">Add Customer</h2>
      <p class="subtitle">Let's add a customer infos</p>
      <div class="input-container ic1">
        <input v-model="customerName" id="firstname" class="input" type="text" placeholder=" " />
        <div class="cut"></div>
        <label for="firstname" class="placeholder">First name</label>
      </div>
      <div class="input-container ic2">
        <input v-model="customerSurname" id="lastname" class="input" type="text" placeholder=" " />
        <div class="cut"></div>
        <label for="lastname" class="placeholder">Last name</label>
      </div>
      <div class="input-container ic2">
        <input
            v-model="customerEmail"
            id="email"
            class="input"
            type="text"
            placeholder="email@example.com"
        />
        <div class="cut cut-short"></div>
        <label for="email" class="placeholder">Email</label>
      </div>
      <div class="input-container ic2">
        <input v-model="customerPhone" id="phone" class="input" type="tel" placeholder=" " />
        <div class="cut"></div>
        <label for="phone" class="placeholder">Phone</label>
      </div>
    </form>
    <form class="form" @submit.prevent="submitDelay">
      <h2 class="title">Appointment</h2>
      <p class="subtitle">Let's add a appointment detail</p>
      <div class="input-container ic1">
        <input v-model="appointmentTitle" id="title" class="input" type="text" placeholder=" " />
        <div class="cut"></div>
        <label for="title" class="placeholder">Title</label>
      </div>
      <div class="input-container ic2">
        <input v-model="appointmentTimeStart" id="time-start" class="input" type="datetime-local" placeholder=" " />
        <div class="cut"></div>
        <label for="time-start" class="placeholder">Start Time</label>
      </div>
      <div class="input-container ic2">
        <input v-model="appointmentTimeEnd" id="time-end" class="input" type="datetime-local" placeholder=" " />
        <div class="cut"></div>
        <label for="time-end" class="placeholder">End Time</label>
      </div>
      <div class="input-container ic2">
        <textarea v-model="appointmentDescription" id="description" class="input" type="text" placeholder=" " />
        <div class="cut"></div>
        <label for="description" class="placeholder">Description</label>
      </div>
      <button @click.prevent="submitDelay" class="submit">Submit</button>
    </form>
    <form class="form">
      <h2 class="title">Add Location</h2>
      <div class="input-container ic1">
        <Address></Address>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import Address from "@/components/Address";



export default {
name: "CustomerCreate",
  components: {
  Address
  },
  data() {
  return {
    customerName: "",
    customerSurname: "",
    customerEmail: "",
    customerPhone: "",
    appointmentTitle: "",
    appointmentTimeStart: "",
    appointmentTimeEnd: "",
    appointmentDescription: "",
    selectedRoute: this.$route.params.user_id,
  }
  },
  methods: {
    submitForm() {
      axios.post('http://laravelapi.test/api/appointments', {
        customer_name: this.customerName,
        customer_surname: this.customerSurname,
        customer_email: this.customerEmail,
        customer_phone: this.customerPhone,
        appointment_time_start: this.appointmentTimeStart,
        appointment_time_end: this.appointmentTimeEnd,
        title: this.appointmentTitle,
        description: this.appointmentDescription,
        user_id: this.userID
      })
      .then((response) => {
        console.log(response);
      })
      .catch((e) => console.log(e))
    },
    submitDelay() {
      this.$toast.info({
        title: 'Appointment Added',
        message: 'Your appointment has been successfully added'
      });
      setTimeout(() => {
        this.submitForm()
        this.$router.push('/')
      }, 2000)
    },
  },
  computed: {
    userID() {
      return this.$store.state.user_id
    }
  }
}
</script>

<style scoped>
.customer-create {
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
