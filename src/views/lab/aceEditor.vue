<template>

  <div id="app">
    <splitpanes class="default-theme">
      <pane size="40" min-size="30">
        <iframe :src="this.lavEnv.coursewarePath" ref="iframe1" height="100%" width="100%"></iframe>
      </pane>
      <pane size="60" min-size="50">
        <el-scrollbar>

          <el-row :gutter="24">
            <el-col :span="2" style="top: 3px;">
              <b style="font-size: 13px;color: darkgray">编程环境:</b>
            </el-col>
            <el-col :span="3">
              <el-select
                ref="mode-selector"
                v-model="currentMode"
                style="width:120px"
                :options="modeArray"
                :placeholder="currentMode"
                @change="handleModeSeletct"/>
            </el-col>
          </el-row>

          <div ref="codeContainer" class="coder-editor">

          </div>

          <div ref="codeSubmitter">

          </div>
        </el-scrollbar>
      </pane>
    </splitpanes>
  </div>

</template>

<script>
import ace from 'ace-builds'
import 'ace-builds/webpack-resolver'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/mode-java'
import 'ace-builds/src-noconflict/snippets/javascript'
import 'ace-builds/src-noconflict/snippets/html'
import 'ace-builds/src-noconflict/snippets/css'
import 'ace-builds/src-noconflict/snippets/scss'
import 'ace-builds/src-noconflict/snippets/json'
import 'ace-builds/src-noconflict/snippets/java'
import 'ace-builds/src-noconflict/snippets/text'
import 'ace-builds/src-noconflict/snippets/golang'
import 'ace-builds/src-noconflict/snippets/python'
import {Pane, Splitpanes} from "splitpanes";

export default {
  components: {
    Splitpanes,
    Pane
  },
  // name: 'Editor',
  props: ["lavEnv"],

  data() {
    return {
      leftWidth: "40%",
      rightWidth: "60%",
      monacoEditor: null, // 语言编辑器

      initCode: 'class Solution {\n' +
        '    public List<Integer> largestValues(TreeNode root) {\n' +
        '\n' +
        '    }\n' +
        '}',
      currentMode: 'Java',
      currentCode: "",
      modeArray: [
        {
          label: 'Java',
          value: 'ace/mode/java'
        }, {
          label: 'Python',
          value: 'ace/mode/python'
        }, {
          label: 'Golang',
          value: 'ace/mode/golang'
        }, {
          label: 'JavaScript',
          value: 'ace/mode/javascript'
        }, {
          label: 'PHP',
          value: 'ace/mode/php'
        }, {
          label: 'Text',
          value: 'ace/mode/text'
        }],

      aceEditor: null,

      currentTheme: 'monokai',
      // currentMode: 'Golang',
      themePath: 'ace/theme/',
      modePath: 'ace/mode/',
    }
  },

  mounted() {
    this.$nextTick(function(){
      this.init();  //输出：修改后的值
    });
  },

  methods: {

    init() {
      console.log("ace", this.initCode)
      this.aceEditor = ace.edit(this.$refs.codeContainer, {
        maxLines: 40, // 最大行数，超过会自动出现滚动条
        minLines: 40, // 最小行数，还未到最大行数时，编辑器会自动伸缩大小
        fontSize: 14, // 编辑器内字体大小
        theme: this.themePath + this.currentTheme, // 默认设置的主题
        mode: this.modePath + this.currentMode.toLowerCase(), // 默认设置的语言模式
        tabSize: 4 // 制表符设置为 4 个空格大小

      })
      this.aceEditor.setValue(this.initCode);   // 初始代码
      ace.require("ace/ext/language_tools");
      this.aceEditor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
      })
    },

    handleModeSeletct(value) {
      console.log(value);
      this.aceEditor.getSession().setMode(value);

    },

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
