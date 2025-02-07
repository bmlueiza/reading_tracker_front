<template>
    <div class="signup_container">
        <div class="signup_form">
            <h2 class="text_center">Crear cuenta</h2>
            <form @submit.prevent="handleSignup">
                <div class="name_surname">
                    <div class="input_group" :class="{'error': errors.name}">
                        <input 
                            v-model="name"
                            id="name"
                            type="text"
                            placeholder=" "
                            aria-invalid="false"
                            aria-describedby="name_error"
                            @blur="validateName"
                            @input="handleInput('name', $event)"
                        />
                        <label for="name">Nombre <span class="required">*</span></label>
                        <p v-if="errors.name" id="name_error" class="error_message" role="alert">{{ errors.name }}</p>
                    </div>
                    <div class="input_group" :class="{'error': errors.surname}">
                        <input 
                            v-model="surname"
                            id="surname"
                            type="text"
                            placeholder=" "
                            aria-invalid="false"
                            aria-describedby="surname_error"
                            @blur="validateSurname"
                            @input="handleInput('surname', $event)"
                        />
                        <label for="surname">Apellido <span class="required">*</span></label>
                        <p v-if="errors.surname" id="surname_error" class="error_message" role="alert">{{ errors.surname }}</p>
                    </div>
                </div>
                <div class="input_group" :class="{'error': errors.email}">
                    <input 
                        v-model="email"
                        id="email"
                        type="email"
                        placeholder=" "
                        aria-invalid="false"
                        aria-describedby="email_error"
                        @blur="validateEmail"
                    />
                    <label for="email">Correo electrónico <span class="required">*</span></label>
                    <p v-if="errors.email" id="email_error" class="error_message" role="alert">{{ errors.email }}</p>
                </div>
                <div class="input_group" :class="{'error': errors.password}">
                    <input 
                        v-model="password"
                        id="password"
                        type="password"
                        placeholder=" "
                        aria-invalid="false"
                        aria-describedby="password_error"
                        @blur="validatePassword"
                    />
                    <label for="password">Contraseña <span class="required">*</span></label>
                    <p v-if="errors.password" id="password_error" class="error_message" role="alert">{{ errors.password }}</p>
                </div>
                <div class="input_group" :class="{'error': errors.confirmPassword}">
                    <input 
                        v-model="confirmPassword"
                        id="confirmPassword"
                        type="password"
                        placeholder=" "
                        aria-invalid="false"
                        aria-describedby="confirmPassword_error"
                        @blur="validateConfirmPassword"
                    />
                    <label for="confirmPassword">Confirmar contraseña <span class="required">*</span></label>
                    <p v-if="errors.confirmPassword" id="confirmPassword_error" class="error_message" role="alert">{{ errors.confirmPassword }}</p>
                </div>
                <p v-if="errorMessage" class="error-message text_center">{{ errorMessage }}</p>
                <button type="submit">Registrarse</button>
            </form>
            <hr className="divider" />
            <p class="text_center router_link">
                ¿Tienes una cuenta? <router-link to="/" class="no_underline">Inicia sesión</router-link>
            </p>
        </div>
    </div>
</template>

<script>
import apiClient from "../api/axios";

export default{
    data(){
        return{
            name: "",
            surname: "",
            email: "",
            password: "",
            confirmPassword: "",
            errors: {},
            errorMessage: ""
        };
    },
    methods: {
        // Método genérico para manejar la entrada de texto en name y surname
        handleInput(field, event) {
            let input = event.target.value;
            // Elimina cualquier número
            input = input.replace(/\d/g, "");
            // Convierte la primera letra en mayúscula
            this[field] = input.charAt(0).toUpperCase() + input.slice(1);
        },
        //Validar nombre
        validateName() {
            if (!this.name) {
                this.errors.name = "El nombre es obligatorio";
            } else {
                delete this.errors.name;
            }
        },
        // Validar apellido
        validateSurname() {
            if (!this.surname) {
                this.errors.surname = "El apellido es obligatorio";
            } else {
                delete this.errors.surname;
            }
        },
        //Validar correo
        validateEmail(){
            if (!this.email){
                this.errors.email = "El correo electrónico es obligatorio";
            } else if (!this.isValidEmail(this.email)){
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
                delete this.errors.password;
            }
        },
        //Validar confirmación de contraseña
        validateConfirmPassword(){
            if (!this.confirmPassword){
                this.errors.confirmPassword = "La confirmación de contraseña es obligatoria";
            } else if (this.password !== this.confirmPassword){
                this.errors.confirmPassword = "Las contraseñas no coinciden";
            } else {
                delete this.errors.confirmPassword;
            }
        },
        //Validar correo electrónico
        isValidEmail(email){
            const re = /\S+@\S+\.\S+/;
            return re.test(email);
        },
        //Manejar registro
        async handleSignup(){
            this.validateName();
            this.validateSurname();
            this.validateEmail();
            this.validatePassword();
            this.validateConfirmPassword();

            if (Object.keys(this.errors).length === 0){
                try{
                    await apiClient.post("/users", {
                        name: this.name,
                        surname: this.surname,
                        email: this.email,
                        password: this.password
                    });
                    this.$router.push("/");
                } catch (error){
                    this.errorMessage = "Ocurrió un error al registrarse";
                }
            }
        }
    }
}
</script>
<style scoped src="../styles/signup-view.css">
</style>