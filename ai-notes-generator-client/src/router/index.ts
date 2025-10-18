import { createRouter, createWebHistory } from 'vue-router'
import UploadPage from '../pages/UploadPage.vue'
import TranscriptsPage from '../pages/TranscriptsPage.vue'
import SummariesPage from '../pages/SummariesPage.vue'

const routes = [
  { path: '/', redirect: '/upload' },
  { path: '/upload', component: UploadPage },
  { path: '/transcripts', component: TranscriptsPage },
  { path: '/summaries', component: SummariesPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router