import { createRouter, createWebHistory } from 'vue-router'
import UploadPage from '../pages/UploadPage.vue'


const routes = [
  { path: '/', redirect: '/upload' },
  { path: '/upload', component: UploadPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router