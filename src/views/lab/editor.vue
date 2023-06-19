<template>

  <div id="app">
    <splitpanes class="default-theme">
      <pane size="40" min-size="30">
        <iframe :src="this.lavEnv.coursewarePath" ref="iframe1" height="100%" width="100%"></iframe>
      </pane>
      <pane size="60" min-size="50">
        <splitpanes horizontal>
          <pane size="70" min-size="20">
            <el-row style="margin: 5px 10px 5px 10px">
              <el-col :span="20">
                <span style="margin: 5px 10px 5px 10px">编程语言</span>
                <el-select
                  v-model="currentMode"
                  style="width:120px"
                  :placeholder="currentMode">
                  <el-option
                    v-for="item in modeArray"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="4">
                <el-button
                  type="primary"
                  @click="saveCode"
                  :loading="loading"
                >保存
                </el-button>
                <el-button
                  type="success"
                  :loading="runLoading"
                  @click="runCode"
                >运行
                </el-button>
              </el-col>
            </el-row>

            <el-scrollbar>
              <div ref="codeContainer" class="coder-editor">
              </div>
            </el-scrollbar>
          </pane>

          <pane size="30" min-size="25">
            <div class="codeSubmitter" ref="codeSubmitter" style="height: 100%; margin-bottom: 20px;"
                 v-loading="runLoading">
              <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick" class="codeSubmitter">
                <el-tab-pane label="控制台信息" name="first" class="terminal-out">
                  <el-scrollbar>
                    <div ref="terminalOutput" class="coder-output">
                    </div>
                  </el-scrollbar>
                </el-tab-pane>

              </el-tabs>
            </div>
          </pane>
        </splitpanes>
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
import {mapState} from "vuex";

export default {
  components: {
    Splitpanes,
    Pane,
  },
  name: 'Editor',
  props: ["lavEnv", "chapter"],
  computed: {
    ...mapState(["isLogin", "user", "freshUnread", "config", "configFunc"]),
  },
  data() {
    return {
      terminalOutput: '请点击代码运行按钮',
      activeName: 'first',
      loading: false,
      runLoading: false,
      leftWidth: "40%",
      rightWidth: "60%",
      monacoEditor: null, // 语言编辑器
      initCode: this.lavEnv.labEnvPath,
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
      terminalOutputEditor: null,
      currentTheme: 'monokai',
      terminalOutputTheme: 'dracula',
      // currentMode: 'Golang',
      themePath: 'ace/theme/',
      modePath: 'ace/mode/',
    }
  },

  mounted() {
    this.$nextTick(function () {
      this.init();  //输出：修改后的值
    });
  },

  methods: {
    init() {
      ace.require("ace/ext/language_tools");
      this.aceEditor = ace.edit(this.$refs.codeContainer, {
        maxLines: 40, // 最大行数，超过会自动出现滚动条
        minLines: 40, // 最小行数，还未到最大行数时，编辑器会自动伸缩大小
        fontSize: 14, // 编辑器内字体大小
        theme: this.themePath + this.currentTheme, // 默认设置的主题
        mode: this.modePath + this.currentMode.toLowerCase(), // 默认设置的语言模式
        tabSize: 4, // 制表符设置为 4 个空格大小
        showPrintMargin: false,   //去除编辑器里的竖线
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
        value: this.initCode,
      })

      this.terminalOutputEditor = ace.edit(this.$refs.terminalOutput, {
        maxLines: 40, // 最大行数，超过会自动出现滚动条
        minLines: 40, // 最小行数，还未到最大行数时，编辑器会自动伸缩大小
        fontSize: 14, // 编辑器内字体大小
        theme: this.themePath + this.terminalOutputTheme, // 默认设置的主题
        mode: this.modePath + this.currentMode.toLowerCase(), // 默认设置的语言模式
        tabSize: 4, // 制表符设置为 4 个空格大小
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
        showLineNumbers: false,
        showPrintMargin: false,   //去除编辑器里的竖线
        readOnly: true,
        showGutter: false,
        autoScrollEditorIntoView: true,
        value: this.terminalOutput,
      })

    },
    saveCode() {
      this.loading = true
      console.log("this.lavEnv", this.lavEnv);
      console.log("this.initCode", this.initCode);
      console.log("this.chapter", this.chapter);
      const initCode = this.aceEditor.getSession().getValue()
      const params = Object.assign({initCode}, this.chapter, this.user);

      this.$api.iLab.saveEditorCode(params)
        .then((res) => {
          console.log("saveEditorCode res", res);
          this.loading = false
          this.$message({
            message: '保存成功',
            type: 'success'
          });
        })
        .catch((e) => {
          this.$message.error("saveEditorCode 失败:" + e);
        })
        .finally(() => {
          this.loading = false
        });
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    runCode() {
      this.runLoading = true
      const initCode = this.aceEditor.getSession().getValue()
      const params = Object.assign({initCode}, this.chapter, this.user);

      this.$api.iLab.runEditorCode(params)
        .then((res) => {
          console.log("runEditorCode res", res);
          // 控制台返回值
          this.terminalOutputEditor.setValue(res.msg)
          this.runLoading = false
          this.$message({
            message: '运行完成',
            type: 'info'
          });
        })
        .catch((e) => {
          this.$message.error("runEditorCode 失败:" + e);
        })
        .finally(() => {
          this.runLoading = false
        });
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

.coder-output {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: 1px solid rgba(0, 0, 0, 0.08);
  text-align: left;
}

.codeSubmitter {
  width: 100%;
  height: 100%;
}

</style>
