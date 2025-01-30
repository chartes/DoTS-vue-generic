import { createRouter, createWebHistory } from 'vue-router'

import HomePage from "@/views/HomePage.vue";
import AboutPage from "@/views/AboutPage.vue";
import DocumentPage from "@/views/DocumentPage.vue";
import DocumentationPage from "@/views/DocumentationPage.vue";

const rootURL = `${import.meta.env.VITE_APP_APP_ROOT_URL}`
console.log("const rootURL :", rootURL)

const router = createRouter({
  history: createWebHistory(rootURL),
  routes: [
    {
      path: `/:collId?`,
      name: 'Home',
      component: HomePage,
      props: true
    },
    {
      path: '/:collId?/about',
      name: 'About',
      component: AboutPage
    },
    {
      path: '/:collId?/documentation',
      name: 'Documentation',
      component: DocumentationPage,
    },
    {
      path: '/:collId?/document/:id',
      name: 'Document',
      component: DocumentPage,
      props: true
    }
  ]
})
router.afterEach((to, from, next) => {
    console.log(`Navigating to: ${to.name}, with params: ${to.params.id}, with query: ${to.query}, with hash: ${to.hash}`);
});
export default router
