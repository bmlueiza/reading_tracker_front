<template>
  <div class="login_container">
    <div class="login-form">
      <h2 class="text_center">Reading Tracker</h2>
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <input
            v-model="email"
            id="email"
            type="email"
            placeholder=" "
          />
          <label for="email">Correo electrónico</label>
        </div>
        <div class="input-group">
          <input
            v-model="password"
            id="password"
            type="password"
            placeholder=" "
          />
          <label for="password">Contraseña</label>
        </div>
        <button type="submit">Iniciar sesión</button>
        <hr className="divider" />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    handleLogin() {
      console.log("Correo:", this.email);
      console.log("Contraseña:", this.password);
      // Aquí iría la lógica para enviar los datos a un servidor o similar
    }
  }
};
</script>


<style scoped src="../styles/login-view.css">
</style>