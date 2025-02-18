<template>
  <nav class="navbar">
    <div class="nav-izq">
      <img src="../../../logo.png" alt="Reading Tracker" />
      <div class="nav-title">
        <router-link to="/home">Reading Tracker</router-link>
      </div>
      <router-link to="/home">Inicio</router-link>
      <router-link to="#">Mi biblioteca</router-link>
    </div>

    <div class="nav-der">
      <div class="search-container">
        <input 
          type="text" 
          v-model="query" 
          @input="searchBooks" 
          placeholder="Buscar por título o isbn" 
          class="search-input"
        />
        <div v-if="books.length > 0" class="dropdown">
          <ul>
            <li v-for="book in books" :key="book.id" @click="selectBook(book)">
              <img :src="book.cover" alt="Portada" class="book-cover" />
              <span>{{ book.title }}</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div>
        <button @click="logout" class="logout-btn">Cerrar Sesión</button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '../api/axios';

const router = useRouter();
const query = ref('');
const books = ref([]);
let debounceTimeout = null;

const isIsbn = (query) => {
  return /^\d{10}(\d{3})?$/.test(query);
};

// 🔹 Watch para limpiar resultados cuando query está vacío o tiene menos de 3 caracteres
watch(query, (newQuery) => {
  if (newQuery.trim().length < 3) {
    books.value = []; // Limpiar los resultados si hay menos de 3 caracteres
    clearTimeout(debounceTimeout); // Cancela la búsqueda si ya estaba en proceso
  }
});

const searchBooks = async () => {
  if (query.value.trim().length < 3) {
    books.value = []; // Limpiar resultados si el query tiene menos de 3 caracteres
    return;
  }

  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No hay token de autenticación");
        return;
      }

      let localResponse;
      if (isIsbn(query.value)) {
        localResponse = await apiClient.get(`/books/search`, {
          params: { query: query.value, type: "isbn" },
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        localResponse = await apiClient.get(`/books/search`, {
          params: { query: query.value, type: "title" },
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      const localBooks = localResponse.data.map(book => ({
        id: book.id,
        title: book.title,
        cover: book.coverUrl || '/default-cover.jpg'
      }));

      books.value = [...localBooks];

      let googleResponse;
      if (isIsbn(query.value)) {
        googleResponse = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${query.value}`);
      } else {
        googleResponse = await fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${query.value}&maxResults=5`);
      }

      const data = await googleResponse.json();
      const googleBooks = data.items?.map(book => ({
        id: book.id,
        title: book.volumeInfo.title,
        cover: book.volumeInfo.imageLinks?.thumbnail || '/default-cover.jpg'
      })) || [];

      books.value = [...localBooks, ...googleBooks];

    } catch (error) {
      console.error("Error al buscar libros:", error);
    }
  }, 500);
};

const selectBook = (book) => {
  if (router.currentRoute.value.path !== `/book/${book.id}`) {
    router.push(`/book/${book.id}`);
  }
  query.value = ''; // Limpia la barra de búsqueda
  books.value = []; // Oculta la lista de sugerencias
};

const logout = () => {
  localStorage.removeItem("token");
  router.push('/'); 
};
</script>

<style scoped src="../styles/navbar.css"/>