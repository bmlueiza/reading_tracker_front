<template>
    <div v-if="book" class="bookview_container">
      <div class="bookview_leftcolumn">
        <img :src="book.cover" alt="Portada del libro" class="book-cover" />
        <button
          :class="buttonClass"
          @click="showModal = true">
          {{ buttonText }}
        </button>
      </div>
      <div class="bookview_rightcolumn">
        <div class="book-info">
          <h1>{{ book.title }}</h1>
          <p><strong>{{ book.authors.join(', ') }}</strong></p>
          <p><strong>Categorías:</strong> {{ book.categories.join(', ') }}</p>
          <p><strong>ISBN:</strong> {{ book.isbn }}</p>
          <p><strong>Páginas:</strong> {{ book.pageCount }}</p>
          <p><strong>Idioma:</strong> {{ book.language }}</p>
          <p>{{ book.description }}</p>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Cargando detalles del libro...</p>
    </div>
    <!-- MODAL -->
  <div v-if="showModal" class="modal-overlay">
    <div class="modal">
      <button class="close-btn" @click="showModal = false">✖</button>
      <h3>Selecciona un estado de lectura</h3>
      <ul>
        <li v-for="(label, key) in statusLabels" :key="key">
          <button
            :class="{ active: key === readingStatus }"
            @click="updateReadingStatus(key)"
            :disabled="key === readingStatus"
          >
            {{ label }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
  
<script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import apiClient from '../api/axios'; // Ajusta la importación de tu cliente API
  
  const route = useRoute();
  const book = ref(null);
  const readingStatus = ref(null);
  const showModal = ref(false);

  const statusLabels = {
    READING: "Leyendo",
    READ: "Leído",
    TOREAD: "Quiero leerlo",
    DROPPED: "Abandonado",
  };

  const buttonText = computed(() => {
    return readingStatus.value ? statusLabels[readingStatus.value] : "Quiero leerlo";
  });

  const buttonClass = computed(() => {
    return {
      reading: readingStatus.value === "READING",
      read: readingStatus.value === "READ",
      toread: readingStatus.value === "TOREAD",
      dropped: readingStatus.value === "DROPPED",
      notAdded: !readingStatus.value, // Si no hay status, significa que no está en la biblioteca
    };
  });  
  
  // Obtener detalles del libro cuando la vista se monte
  onMounted(async () => {
    const isbn = route.params.isbn; // Obtener el ISBN del libro desde los parámetros de la ruta
    console.log(isbn);
    if (!isbn) {
      console.error("ISBN no encontrado en los parámetros de la ruta.");
      return;
    }
  
    try {
      // Primer intento: buscar en la API local
      const token = localStorage.getItem("token"); // Obtener token de localStorage
  
      const localResponse = await apiClient.get(`/books/`, {
        params: { isbn },
        headers: { Authorization: `Bearer ${token}` } // Autorizar la solicitud con el token
      });

      console.log(localResponse.data);
  
      if (localResponse.data && localResponse.data.length > 0) {
        // Si encontramos el libro en la API local
        book.value = {
        title: localResponse.data[0].title,
        authors: localResponse.data[0].authors || ['Desconocido'],
        categories: localResponse.data[0].categories || ['Sin categorías'],
        isbn: localResponse.data[0].isbn,
        pageCount: localResponse.data[0].pageCount || 'Desconocido',
        language: localResponse.data[0].language || 'Desconocido',
        description: localResponse.data[0].description || 'Sin descripción disponible',
        cover: localResponse.data[0].coverUrl || '/default-cover.jpg'
        };
      } else {
        // Si no se encuentra el libro en la API local, buscar en Google Books
        const googleResponse = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
        const googleData = await googleResponse.json();
  
        if (googleData.items?.length > 0) {
          const googleBook = googleData.items[0].volumeInfo;
          book.value = {
            title: googleBook.title,
            authors: googleBook.authors || ['Desconocido'],
            categories: googleBook.categories || ['Sin categorías'],
            isbn: isbn,
            pageCount: googleBook.pageCount,
            language: googleBook.language,
            description: googleBook.description || 'Sin descripción disponible',
            cover: googleBook.imageLinks?.thumbnail || '/default-cover.jpg'
          };
        } else {
          console.error("Libro no encontrado en Google Books");
        }
      }
      const statusResponse = await apiClient.get(`/readings/status`, {
        params: { isbn },
        headers: { Authorization: `Bearer ${token}` }
      });

      if (statusResponse.data === "Sin lectura registrada para este usuario y libro.") {
        readingStatus.value = null; // Indica que aún no ha sido añadido
      } else {
        readingStatus.value = statusResponse.data;
      }
    } catch (error) {
      console.error("Error al obtener los detalles del libro:", error);
    }
  });

  const handleButtonClick = () => {
    if (!readingStatus.value) {
      console.log("Abrir modal para añadir a la biblioteca");
    } else {
      console.log(`Estado actual: ${readingStatus.value}`);
    }
  };

  // Cambiar estado de lectura
const updateReadingStatus = async (newStatus) => {
  if (newStatus === readingStatus.value) return;

  try {
    const token = localStorage.getItem("token");
    await apiClient.patch(`/readings/update-status`, null, {
      params: { isbn: book.value.isbn, status: newStatus },
      headers: { Authorization: `Bearer ${token}` },
    });

    readingStatus.value = newStatus; // Actualizar la UI
    showModal.value = false; // Cerrar el modal
  } catch (error) {
    console.error("Error al actualizar el estado de lectura:", error);
  }
};
  </script>

  <style scoped src="../styles/book-view.css"/>
  