<template>
    <div class="home_container">
        <ReadingBooks />
      <div class="home_grid">
        <div class="home_to_read">
          <ToReadBooks />
        </div>
        <div class="home_read">
          <ReadBooks />
        </div>
      </div>
    </div>
  </template>

<script setup>
import ReadingBooks from "../components/ReadingBooks.vue";
import ReadBooks from "../components/ReadBooks.vue";
import ToReadBooks from "../components/ToReadBooks.vue";
</script>

<style scoped src="../styles/home-view.css"/>