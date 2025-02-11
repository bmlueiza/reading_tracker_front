<template>
    <nav class="navbar">
      <div class="nav-izq">
        <img src="../../../logo.png" alt="Reading Tracker" />
        <div class="nav-title">
          <router-link to="/home">Reading Tracker</router-link>
        </div>
        <router-link to="/home">Inicio</router-link>
        <router-link to="#">Mis libros</router-link>
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
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query.value}&maxResults=5`);
        const data = await response.json();
  
        books.value = data.items?.map(book => ({
          id: book.id,
          title: book.volumeInfo.title,
          cover: book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/50x75?text=No+Cover'
        })) || [];
  
      } catch (error) {
        console.error("Error al buscar libros:", error);
      }
    }, 500);
  };
  
  const selectBook = (book) => {
    router.push(`/book/${book.id}`);
    query.value = ''; // Limpia la barra de búsqueda después de seleccionar un libro
    books.value = []; // Oculta la lista de sugerencias
};

  
  const logout = () => {
    console.log("Cerrando sesión...");
    router.push('/login');
  };
  </script>
  
  <style scoped src="../styles/navbar.css"></style>
  