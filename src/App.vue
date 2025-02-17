<template>
    <div class="layout">
      <Navbar v-if="!isAuthPage" />
      <Main :style="mainStyle">
        <router-view />
      </Main>
    </div>
</template>
  
<script>
  import Navbar from "./components/Navbar.vue";
  import Main from "./components/Main.vue";

  export default {
    name: "App",
    components: {
      Navbar,
      Main
    },
    computed: {
      isAuthPage() {
        return this.$route.path === "/" || this.$route.path === "/signup";
      },
      mainStyle() {
        return this.isAuthPage ? {} : { paddingTop: '60px', paddingBottom: '10px' };
      }
    }
  };
</script>

<style>
.layout {
    display: grid;
    grid-template-columns: 1fr; /* Una sola columna */
    grid-template-rows: auto 1fr; /* Navbar y Main */
    grid-template-areas: 
      "navbar"
      "main";
}

.layout > Navbar {
    grid-area: navbar;
}

.layout > Main {
    grid-area: main;
}  
</style>
  