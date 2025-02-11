<template>
    <div id="app">
      <Navbar v-if="!isAuthPage" />
      <router-view />
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
  