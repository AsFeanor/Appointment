<template>
  <div class="login">
    <form class="form" @submit.prevent="onSubmit">
      <h2 class="title">Welcome</h2>
      <p class="subtitle">Let's Login to your account!</p>
      <div class="input-container ic1">
        <input v-model="users.email" id="email" class="input" type="email" placeholder="email@example.com" />
        <div class="cut cut-short"></div>
        <label for="email" class="placeholder">Email</label>
      </div>
      <div class="input-container ic2">
        <input v-model="users.password" id="password" class="input" type="password" placeholder=" " />
        <div class="cut"></div>
        <label for="password" class="placeholder">Password</label>
      </div>
      <button type="submit" class="submit">Login</button>
      <router-link to="/register"><a href="#" class="text-secondary">I am not a member</a></router-link>
    </form>
  </div>
</template>

<script>
export default {
name: "Login",
  data() {
    return {
      users: {
        name: null,
        email: null,
        password: null
      }
    }
  },
  methods: {
    onSubmit() {
      this.$store.dispatch('login', {...this.users})
      .then(response => {
        if (this.$store.getters.isAuthenticated) {
          this.$toast.info({
            title: 'Authorization Completed',
            message: 'You have logged in'
          })
        }else {
          this.$toast.error({
            title: 'Authorization Denied',
            message: 'Please check your user information'
          })
        }
        this.$router.push('/')
      })
    }
  }
}

</script>

<style scoped>
.login {
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
  height: 500px;
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
  transition: box-shadow .2s ease-in-out;
  box-shadow: inset 0px 0px 0px 0px transparent;
}

.input:focus {
  box-shadow: inset 0px 0px 0px 2px #dc2f55;
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
  transition: background-color .2s ease-in-out, box-shadow .2s ease-in-out;
  box-shadow: inset 0px 0px 0px 0px transparent;
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


input:focus::-webkit-input-placeholder {
  opacity: 1;
}

input:focus:-ms-input-placeholder {
  opacity: 1;
}

input:focus::placeholder {
  opacity: 1;
}
</style>
