<template>
  <div id="app">
    <splitpanes class="default-theme">
      <pane size="40" min-size="30">
        <iframe :src="this.lavEnv.coursewarePath" ref="iframe1" height="100%" width="100%"></iframe>
      </pane>
      <pane size="60" min-size="50">
        <el-scrollbar>
          <div ref="codeContainer" class="coder-editor"></div>
          <div ref="codeSubmitter">

          </div>
        </el-scrollbar>
      </pane>
    </splitpanes>
  </div>
</template>

<script>
import * as monaco from 'monaco-editor';
import {Pane, Splitpanes} from "splitpanes";

export default {
  components: {
    Splitpanes,
    Pane
  },
  name: 'Editor',
  props: ["lavEnv"],
  data() {
    return {
      leftWidth: "40%",
      rightWidth: "60%",
      monacoEditor: null, // 语言编辑器
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      if (this.$refs.codeContainer) {
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
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  height: 100%;
}

.el-scrollbar {
  width: 100%;
  height: 100%;
}

.coder-editor {
  width: 100%;
  height: 700px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  text-align: left;
}

</style>
