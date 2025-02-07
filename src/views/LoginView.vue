<template>
  <div class="login_container">
    <div class="login_form">
      <h2 class="text_center">Reading Tracker</h2>
      <form @submit.prevent="handleLogin">
        <div class="input_group" :class="{'error': errors.email}">
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
          <p v-if="errors.email" id="email-error" class="error_message" role="alert">{{ errors.email }}</p>
        </div>
        <div class="input_group" :class="{'error': errors.password}">
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
          <p v-if="errors.password" id="password-error" class="error_message" role="alert">{{ errors.password }}</p>
        </div>
        <p v-if="errorMessage" class="error_message text_center">{{ errorMessage }}</p>
        <button type="submit">Iniciar sesión</button>
      </form>
      <hr className="divider" />
      <p class="text_center router_link">
        ¿No tienes una cuenta?<router-link to="/signup" class="no_underline"> Registrarse</router-link>
      </p>
    </div>
  </div>
</template>


<script>
import apiClient from "../api/axios";

export default {
  data() {
    return {
      email: "",
      password: "",
      errors: {},
      errorMessage: ""
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

      if (Object.keys(this.errors).length === 0) {
        apiClient.post("auth/login", {
          email: this.email,
          password: this.password
        })
        .then(response => {
          console.log("Respuesta del servidor:", response.data);
          
          // Guardar el token en localStorage
          localStorage.setItem("token", response.data.token);

          // Redirigir a otra vista después de iniciar sesión
          this.$router.push("/dashboard"); 
        })
        .catch(error => {
          console.error("Error en el login:", error.response?.data || error.message);
          
           // Establecer mensaje de error visible en la UI
           this.errorMessage = "Credenciales incorrectas o error en el servidor";

          // También podrías limpiar solo la contraseña si quieres
          this.password = "";
        });
      }
    },
    goToSignup() {
      this.$router.push("/signup");
    }
  }
};
</script>


<style scoped src="../styles/login-view.css">
</style>