<template>
  <div id="app">
    <iframe :src="this.lavEnv.labEnvPath" ref="iframe1" height="100%" width="100%"></iframe>
  </div>
</template>

<script>

export default {

  name: "jupyter",
  props: ["lavEnv"],
  data() {
    return {}
  },
  mounted() {

  },
  beforeDestroy() {

  }
}
</script>

<style scoped>
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  height: 100%;
}
</style>
