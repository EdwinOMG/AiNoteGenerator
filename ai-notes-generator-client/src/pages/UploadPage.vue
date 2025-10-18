<template>
  <div class="upload-page">
    <h1>Upload MP3</h1>
    <input type="file" @change="handleFileChange" accept=".mp3" />
    <button @click="uploadFile" :disabled="!selectedFile">Upload</button>

    <p v-if="uploading">Uploading: {{ selectedFile?.name }}</p>
    <p v-if="uploadSuccess" style="color: green;">Upload successful!</p>
    <p v-if="uploadError" style="color: red;">Error uploading file.</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getPresignedUrl, uploadToS3 } from '../utils/s3Service'

const selectedFile = ref<File | null>(null)
const uploading = ref(false)
const uploadSuccess = ref(false)
const uploadError = ref(false)

function handleFileChange(event: Event) {
  const files = (event.target as HTMLInputElement).files
  if (files && files.length > 0) {
    selectedFile.value = files[0]
    uploadSuccess.value = false
    uploadError.value = false
  }
}

async function uploadFile() {
  if (!selectedFile.value) return

  uploading.value = true
  uploadSuccess.value = false
  uploadError.value = false

  try {
    // Step 1: get presigned URL from your backend
    const url = await getPresignedUrl(selectedFile.value.name)
console.log("Presigned URL:", url)
await uploadToS3(url, selectedFile.value)
    uploadSuccess.value = true
  } catch (error) {
    console.error(error)
    uploadError.value = true
  } finally {
    uploading.value = false
  }
}
</script>

<style scoped>
.upload-page {
  max-width: 400px;
  margin: auto;
  text-align: center;
}

button {
  margin-top: 10px;
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
}
</style>