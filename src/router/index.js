import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import SignupView from '../views/SignupView.vue';
import HomeView from '../views/HomeView.vue';
import BookView from '../views/BookView.vue';

const routes = [
  { path: "/", name: "Login", component: LoginView },
  { path: "/signup", name: "Signup", component: SignupView },
  { path: "/home", name: "Home", component: HomeView },
  { path: "/book/:id", name: "Book", component: BookView, props: true }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
