<template>
  <div>
    <div class="header">
      <div class="header-left">
        <router-link to>
          <el-button type="primary" icon="el-icon-arrow-left" circle @click="$router.back(-1)"></el-button>
        </router-link>
      </div>
      <div class="header-center">
        {{ title }}
      </div>
      <div class="header-right">
        <a @click="$router.push({ name: 'Member' })" class="userAvatar" target="_blank">
          <img class="avatar" :src="user.avatar"/>
        </a>
      </div>
    </div>
    <div class="lab">
      <template v-if="loading">
        <skeletonDetail></skeletonDetail>
      </template>
      <Editor
        v-show="editorModel"
        :lavEnv="lavEnv"
        :chapter="chapter"
      ></Editor>

      <RemoteDesktop
        v-show="remoteDesktopModel"
        :lavEnv="lavEnv"
      ></RemoteDesktop>

      <Terminal
        v-show="terminalModel"
        :lavEnv="lavEnv"
      ></Terminal>

      <Jupyter
        v-show="jupyterModel"
        :lavEnv="lavEnv"
      ></Jupyter>
    </div>
  </div>


</template>
<script>
import Editor from "@/views/lab/editor.vue";
import RemoteDesktop from "@/views/lab/remoteDesktop.vue";
import Terminal from "@/views/lab/terminal.vue";
import Jupyter from "@/views/lab/jupyter.vue";
import SkeletonDetail from "@/components/skeleton/skeletonDetail.vue";
import {mapState} from "vuex";

export default {
  components: {
    Editor,
    RemoteDesktop,
    Terminal,
    Jupyter,
    SkeletonDetail,
  },
  data() {
    return {
      loading: true,
      lavEnv: this.$route.query.lavEnv,
      chapter: this.$route.query.chapter,
      course: this.$route.query.course,
      open: false,
      title: "",
      editorModel: false,
      remoteDesktopModel: false,
      terminalModel: false,
      jupyterModel: false,
      fullscreenLoading: false
    };
  },
  computed: {
    ...mapState(["isLogin", "user", "freshUnread", "config", "configFunc"]),
  },
  mounted() {
    console.log("labEnv", this.lavEnv);
    console.log("chapter", this.chapter);
    console.log("course", this.course);
    this.title = this.course.title + "：第" + (this.chapter.index + 1) + "章 " + this.chapter.title
    switch (this.lavEnv.envType) {
      case "editor":
        this.editorModel = true;
        break;
      case "desktop":
        this.remoteDesktopModel = true;
        break;
      case "terminal":
        this.terminalModel = true;
        break;
      case "juypter":
        this.jupyterModel = true;
        break;
    }
    this.loading = false;
    console.log("lab envType", this.lavEnv.envType);

    this.openFullScreen2()

  },
  beforeDestroy() {

  },
  methods: {
    openFullScreen2() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      setTimeout(() => {
        loading.close();
      }, 3000);
    }
  },
};
</script>
<style lang="less" scoped>
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

.lab {
  position: fixed;
  width: 100%;
  height: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 20px;
}

.header-left {
  display: flex;
}

.header-center {
  font-size: 20px;
}

.header-right img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
</style>
