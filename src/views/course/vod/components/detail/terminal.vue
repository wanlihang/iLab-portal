<template>
  <div>
    <el-container>
      <el-aside width="30%" style="background-color: rgb(238, 241, 246)">
        <iframe :src="src1" ref="iframe1" height="500px" width="100%"></iframe>
      </el-aside>
      <el-aside width="70%" style="background-color: rgb(238, 241, 211)">
        <iframe :src="src2" ref="iframe2" height="500px" width="100%"></iframe>
      </el-aside>
    </el-container>
  </div>
</template>

<script>

export default {
  name: 'Terminal',
  data() {
    return {
      containerId: 'f68b3a91e526', //this.$route.params.containerId
      src1: 'http://localhost:8000/',
      // 连接容器的地址
      src2: 'http://192.168.102.40:9000/?arg=test&arg=python-5f584b798c-6trkx&arg=%2fbin%2fbash'
    }
  },
  mounted() {

  },
  beforeDestroy() {

  }
}
</script>
<style scoped>
</style>
