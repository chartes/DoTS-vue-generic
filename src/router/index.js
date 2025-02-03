import { createRouter, createWebHistory } from 'vue-router'

/* import HomePage from '@/views/HomePage.vue'
import AboutPage from '@/views/AboutPage.vue'
import DocumentationPage from '@/views/DocumentationPage.vue' */

const rootURL = `${import.meta.env.VITE_APP_APP_ROOT_URL}`
console.log('const rootURL :', rootURL)

const router = createRouter({
  history: createWebHistory(rootURL),
  routes: [
    {
      path: '/:collId?',
      name: 'Home',
      component: () => import('@/views/HomePage.vue'),
      props: true
    },
    {
      path: '/:collId?/about',
      name: 'About',
      component: () => import('@/views/AboutPage.vue')
    },
    {
      path: '/:collId?/documentation',
      name: 'Documentation',
      component: () => import('@/views/DocumentationPage.vue')
    },
    {
      path: '/:collId?/document/:id',
      name: 'Document',
      component: () => import('@/views/DocumentPage.vue'),
      props: true
    }
  ]
})
router.afterEach((to, from, next) => {
  console.log(`Navigating to: ${to.name}, with params: ${to.params.id}, with query: ${to.query}, with hash: ${to.hash}`)
})
export default router
