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
            placeholder="Buscar libro..." 
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
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
import apiClient from '../api/axios';
  
  const router = useRouter();
  const query = ref('');
  const books = ref([]);
  let debounceTimeout = null;
  
  const searchBooks = async () => {
    if (query.value.length < 3) {
      books.value = [];
      return;
    }
  
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(async () => {
      try {
        // Busqueda de libros en la API local
        const token = localStorage.getItem("token"); // Obtener el token JWT almacenado
        if (!token) {
          console.error("No hay token de autenticación");
          return;
        }
        const localResponse = await apiClient.get(`/books/search`,{
          params: { query: query.value },
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(localResponse);
        if (localResponse.data.lenght > 0){
          books.value = localResponse.data.map(book => ({
            id: book.id,
            title: book.title,
            cover: book.coverUrl || '/default-cover.jpg'
          }));
          return;
        }
        // Busqueda de libros en la API externa
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query.value}&maxResults=5`);
        const data = await response.json();
  
        books.value = data.items?.map(book => ({
          id: book.id,
          title: book.volumeInfo.title,
          cover: book.volumeInfo.imageLinks?.thumbnail || '/default-cover.jpg'
        })) || [];
  
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
    console.log("Cerrando sesión...");
    router.push('/');
  };
  </script>
  
  <style scoped src="../styles/navbar.css"></style>
  