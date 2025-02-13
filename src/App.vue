<template>
    <div class="app_container">
      <Navbar v-if="!isAuthPage" />
      <main class="main_content">
        <router-view />
      </main>
    </div>
</template>
  
<script>
  import Navbar from "./components/Navbar.vue";
  export default {
    name: "App",
    components: {
      Navbar
    },
    computed: {
      isAuthPage() {
        return this.$route.path === "/" || this.$route.path === "/signup";
      }
    }
  };
</script>
  