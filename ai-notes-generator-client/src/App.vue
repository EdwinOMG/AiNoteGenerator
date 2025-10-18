<template>
  <div id="app">
    <nav>
      <router-link to="/upload">Upload</router-link>
      <router-link to="/transcripts">Transcripts</router-link>
      <router-link to="/summaries">Summaries</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script setup lang="ts">
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  margin-top: 20px;
}

nav {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
}

router-link {
  text-decoration: none;
  color: #42b983;
  font-weight: bold;
}

router-link.router-link-exact-active {
  color: #35495e;
}
</style>