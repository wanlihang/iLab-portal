<template>
  <div class="content">
    <el-container>
      <el-aside width="40%" style="background-color: rgb(238, 241, 246)">
        <iframe :src="this.lavEnv.coursewarePath" ref="iframe1" height="700px" width="100%"></iframe>
      </el-aside>
      <el-aside width="60%" style="background-color: rgb(238, 241, 211)">
        <iframe :src="this.lavEnv.labEnvPath" ref="iframe2" height="700px" width="100%"></iframe>
      </el-aside>
    </el-container>
  </div>
</template>

<script>

export default {
  name: 'Terminal',
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
.content {
  width: 100%;
  height: 100%;
}
</style>
