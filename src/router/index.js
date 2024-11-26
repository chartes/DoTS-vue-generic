import { createRouter, createWebHistory } from 'vue-router'

import HomePage from "@/views/HomePage.vue";
import AboutPage from "@/views/AboutPage.vue";
import DocumentPage from "@/views/DocumentPage.vue";

console.log("import.meta.env.VITE_BASE_URL :", import.meta.env.VITE_APP_APP_ROOT_URL)

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes: [
    {
      path: `/`,
      name: 'Home',
      component: HomePage
    },
    {
      path: '/about',
      name: 'About',
      component: AboutPage
    },
    {
      path: '/document/:id',
      name: 'Document',
      component: DocumentPage,
      props: true
    }
  ]
})
router.afterEach((to, from, next) => {
    console.log(`Navigating to: ${to.name}, with params: ${to.params.id}, with query: ${to.params.query}`);
});
export default router
