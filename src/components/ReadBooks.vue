<template>
    <div class="home_reading">
      <h3>Leídos</h3>
      <div class="divider"></div>
      <div v-if="books.length === 0">¡Aún no has leído ningún libro!</div>
      <div class="books_list">
        <div v-for="book in books.slice(0, 5)" :key="book.id" class="book_item">
          <img :src="book.coverUrl || defaultImage" :alt="book.title" class="book_cover" />
          <p class="book_title">{{ book.title }}</p>
        </div>
      </div>
      <button v-if="books.length > 5" @click="viewAll('read')">Ver todos</button>
    </div>
  </template>  

<script setup>
  import { ref, onMounted } from "vue";
  import apiClient from "../api/axios";
  
  const books = ref([]);
  const token = localStorage.getItem("token");
  const defaultImage = "/default-cover.jpg";
  
  onMounted(async () => {
    try {
      const response = await apiClient.get("/readings/user", {
        headers: { Authorization: `Bearer ${token}` },
        params: { status: "READ" },
      });
      books.value = response.data;
    } catch (error) {
      console.error("Error al obtener libros leídos", error);
    }
  });
  
  const viewAll = (status) => {
    console.log(`Redirigir a la vista de todos los libros con estado: ${status}`);
  };
</script>

<style scoped src="../styles/components/readtoread-books.css" />