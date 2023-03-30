<template>
  <div id="app">
    <iframe :src="src1" ref="iframe1" height="100%" width="100%"></iframe>
  </div>
</template>

<script>

export default {

  name: "jupyter",
  data() {
    return {
      src1: 'http://192.168.103.66:8888/notebooks/jupyter/main.ipynb',
    }
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
