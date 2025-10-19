<script setup lang="ts">
import { ref, watch } from "vue";
import { getPresignedUrl, uploadToS3, getSummaries, getSummaryContent } from "../utils/s3Service";

const selectedFile = ref<File | null>(null);
const uploading = ref(false);
const uploadSuccess = ref(false);
const uploadError = ref(false);
const loadingSummary = ref(false);
const latestSummary = ref<{ key: string; content: string } | null>(null);

function handleFileChange(event: Event) {
  const files = (event.target as HTMLInputElement).files;
  if (files && files.length > 0 && files[0]) {
  selectedFile.value = files[0] as File;
  uploadSuccess.value = false;
  uploadError.value = false;
  latestSummary.value = null;
}
}

async function uploadFile() {
  if (!selectedFile.value) return;

  uploading.value = true;
  uploadSuccess.value = false;
  uploadError.value = false;
  loadingSummary.value = false;

  try {
    const url = await getPresignedUrl(selectedFile.value.name);
    await uploadToS3(url, selectedFile.value);

    uploadSuccess.value = true;
    loadingSummary.value = true;

    // Poll for summary up to 2 minutes (30 * 4s = 120s)
    let summaryObjects: { Key?: string }[] = [];
    for (let i = 0; i < 30; i++) {
      const fetched = await getSummaries();
      summaryObjects = (fetched || []).filter(
        (s): s is { Key: string } => !!s && !!s.Key && typeof s.Key === "string"
      );

      if (summaryObjects.length > 0) break;
      await new Promise((r) => setTimeout(r, 4000));
    }

    if (summaryObjects.length === 0) {
      throw new Error("Summary not found after waiting 2 minutes");
    }
    
    const key = summaryObjects[0]?.Key!;
    const content = await getSummaryContent(key);
    latestSummary.value = { key, content };
  } catch (error) {
    console.error(error);
    uploadError.value = true;
  } finally {
    uploading.value = false;
    loadingSummary.value = false;
  }
}

</script>

<template>
  <div class="upload-container">
    <h1 class="title">Audio Summarizer</h1>

    <div class="upload-box">
      <input type="file" @change="handleFileChange" accept=".mp3" />
      <button @click="uploadFile" :disabled="!selectedFile || uploading" class="upload-btn">
        {{ uploading ? "Uploading..." : "Upload" }}
      </button>

      <p v-if="uploading">Uploading: {{ selectedFile?.name }}</p>
      <p v-if="uploadSuccess" class="success">Upload successful!</p>
      <p v-if="uploadError" class="error">Error uploading file.</p>
      <p v-if="loadingSummary">Generating summary... please wait.</p>
    </div>

    <div v-if="latestSummary" class="summary-box">
      <h2>Summary</h2>
      <p>{{ latestSummary.content }}</p>
    </div>
  </div>
</template>

<style scoped>
.upload-container {
  max-width: 600px;
  margin: 40px auto;
  text-align: center;
  font-family: "Inter", sans-serif;
}

.title {
  font-size: 2em;
  margin-bottom: 20px;
}

.upload-box {
  border: 2px dashed #ccc;
  padding: 20px;
  border-radius: 12px;
  background-color: #fafafa;
}

.upload-btn {
  margin-top: 10px;
  padding: 10px 18px;
  border: none;
  background-color: #3273dc;
  color: white;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
}

.upload-btn:hover {
  background-color: #275ba8;
}

.success {
  color: green;
}

.error {
  color: red;
}

.summary-box {
  margin-top: 30px;
  background-color: #f0f6ff;
  border-radius: 10px;
  padding: 20px;
  text-align: left;
}

.summary-box h2 {
  margin-bottom: 10px;
  color: #3273dc;
}
</style>
