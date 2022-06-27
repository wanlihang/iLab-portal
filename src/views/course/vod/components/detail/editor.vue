<template>
  <div>
    <el-container>
      <el-aside width="30%" style="background-color: rgb(238, 241, 246)">
        <iframe :src="src1" ref="iframe1" height="500px" width="100%"></iframe>
      </el-aside>
      <el-aside width="70%" style="background-color: rgb(238, 241, 211)">
        <el-scrollbar style="height: 100%; width: 100%">
          <div ref="codeContainer" class="coder-editor"></div>
        </el-scrollbar>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import * as monaco from 'monaco-editor';

export default {
  components: {},
  name: 'Editor',
  data() {
    return {
      containerId: 'f68b3a91e526', //this.$route.params.containerId
      src1: 'http://localhost:8000/',
      monacoEditor: null, // 语言编辑器
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init(){
      if(this.$refs.codeContainer){
        // 初始化编辑器，确保dom已经渲染
        this.monacoEditor = monaco.editor.create(this.$refs.codeContainer, {
          value: 'class Solution {\n' +
              '    public List<Integer> largestValues(TreeNode root) {\n' +
              '\n' +
              '    }\n' +
              '}', // 编辑器初始显示文字
          language: 'java', // 语言
          theme: 'vs-dark', // 官方自带三种主题vs, hc-black, or vs-dark
          minimap: { // 关闭小地图
            enabled: true,
          },
          lineNumbers: 'on', // 隐藏控制行号
          fontSize: 14,
        });
      }
    },
  },
  beforeDestroy() {

  }
}
</script>
<style scoped>
.coder-editor{
  width: 100%;
  height: 500px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  text-align:left;
}
</style>
