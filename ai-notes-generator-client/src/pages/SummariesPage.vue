<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getSummaries, getSummaryContent } from "../utils/s3Service";

interface Summary {
  key: string;
  content: string;
}

const summaries = ref<Summary[]>([]);

onMounted(async () => {
  const summaryObjects = await getSummaries();

  const summariesWithContent = await Promise.all(
    summaryObjects
      .filter((item): item is { Key: string } => !!item.Key) // filter out undefined Key
      .map(async (item) => {
        const content = await getSummaryContent(item.Key);
        return { key: item.Key, content };
      })
  );

  summaries.value = summariesWithContent;
});

</script>

<template>
  <div>
    <h1>Summaries</h1>
    <ul>
      <li v-for="summary in summaries" :key="summary.key">
        <h3>{{ summary.key }}</h3>
        <p>{{ summary.content }}</p>
      </li>
    </ul>
  </div>
</template>
