<template>
  <div class="login_container">
    <div class="login-form">
      <h2 class="text_center">Reading Tracker</h2>
      <form @submit.prevent="handleLogin">
        <div class="input-group" :class="{'error': errors.email}">
          <input
            v-model="email"
            id="email"
            type="email"
            placeholder=" "
            aria-invalid="false"
            aris-describedby="email-error"
            @blur="validateEmail"
          />
          <label for="email">Correo electrónico</label>
          <p v-if="errors.email" id="email-error" class="error-message" role="alert">{{ errors.email }}</p>
        </div>
        <div class="input-group" :class="{'error': errors.password}">
          <input
            v-model="password"
            id="password"
            type="password"
            placeholder=" "
            aria-invalid="false"
            aris-describedby="password-error"
            @blur="validatePassword"
          />
          <label for="password">Contraseña</label>
          <p v-if="errors.password" id="password-error" class="error-message" role="alert">{{ errors.password }}</p>
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
      password: "",
      errors: {}
    };
  },
  methods: {
    //Validar correo
    validateEmail(){
      if (!this.email){
        this.errors.email = "El correo electrónico es obligatorio";
      } else if (!this.isValidEmail(this.email)) {
        this.errors.email = "Ingrese un correo electrónico válido";
      } else {
        delete this.errors.email;
      }
    },
    //Validar contraseña
    validatePassword(){
      if (!this.password){
        this.errors.password = "La contraseña es obligatoria";
      } else {
        delete this.errors.password
      }
    },
    isValidEmail(email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/;
      return emailRegex.test(email);
    },
    handleLogin() {
      this.validateEmail();
      this.validatePassword();
      // Si no hay errores, procesamos el login
      if (Object.keys(this.errors).length === 0) {
        console.log("Correo:", this.email);
        console.log("Contraseña:", this.password);
        // Lógica para enviar los datos al servidor
      }
    }
  }
};
</script>


<style scoped src="../styles/login-view.css">
</style>