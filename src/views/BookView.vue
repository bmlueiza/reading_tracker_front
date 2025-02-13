<template>
    <main class="book-view">
      <div v-if="book" class="book-container">
        <img :src="book.cover" :alt="book.title" class="book-cover-large" :key="book.cover" />
        <div class="book-details">
          <button @click="addToLibrary" class="add-btn">Añadir a mi biblioteca</button>
          <h1>{{ book.title }}</h1>
          <p><strong>Autor(es):</strong> {{ book.authors }}</p>
          <p><strong>Géneros:</strong> {{ book.categories || 'No disponible' }}</p>
          <p><strong>ISBN:</strong> {{ book.isbn || 'No disponible' }}</p>
          <p><strong>Páginas:</strong> {{ book.pageCount || 'No disponible' }}</p>
          <p><strong>Idioma:</strong> {{ book.language }}</p>
          <p class="description" v-html="book.description || 'Sin descripción'"></p>
        </div>
      </div>
      <p v-else>Cargando información del libro...</p>
    </main>
</template>
  
<script setup>
  import { ref, onMounted, watch } from 'vue';
  import { useRoute } from 'vue-router';
  
  const route = useRoute();
  const book = ref(null);
  
  const fetchBookDetails = async () => {
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${route.params.id}`);
      const data = await response.json();
  
      book.value = {
        title: data.volumeInfo.title,
        authors: data.volumeInfo.authors?.join(', ') || 'Autor desconocido',
        categories: data.volumeInfo.categories?.join(', '),
        isbn: data.volumeInfo.industryIdentifiers?.[0]?.identifier,
        pageCount: data.volumeInfo.pageCount,
        language: data.volumeInfo.language.toUpperCase(),
        description: data.volumeInfo.description,
        cover: data.volumeInfo.imageLinks?.large || data.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150x200?text=No+Cover',
      };
    } catch (error) {
      console.error("Error al obtener los detalles del libro:", error);
    }
  };
  
  const addToLibrary = () => {
    alert(`"${book.value.title}" agregado a tu biblioteca.`);
    // Aquí puedes hacer una petición al backend para guardar el libro en la biblioteca del usuario.
  };
  
  onMounted(fetchBookDetails);

  // Observar cambios en el ID del libro y volver a cargar los datos
    watch(() => route.params.id, fetchBookDetails);
</script>
  
<style scoped src="../styles/book-view.css"></style>  