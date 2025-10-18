<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getSummaries } from '../utils/s3Service'

const summaries = ref<any[]>([])

onMounted(async () => {
  summaries.value = await getSummaries()
})
</script>

<template>
  <div>
    <h1>Summaries</h1>
    <ul>
      <li v-for="summary in summaries" :key="summary.Key">{{ summary.Key }}</li>
    </ul>
  </div>
</template>