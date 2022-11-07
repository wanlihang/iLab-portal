<template>
  <div class="content">
    <template v-if="loading">
      <skeletonDetail></skeletonDetail>
    </template>
    <template>
      <div>
        <Editor
          v-show="editorModel"
          :lavEnv="lavEnv"
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
    </template>


    <nav-footer></nav-footer>
  </div>

</template>
<script>
import NavFooter from "../../../components/footer.vue";
import Editor from "@/views/course/vod/components/detail/editor";
import RemoteDesktop from "@/views/course/vod/components/detail/remoteDesktop";
import Terminal from "@/views/course/vod/components/detail/terminal";
import Jupyter from "@/views/course/vod/components/detail/jupyter";
import SkeletonDetail from "@/components/skeleton/skeletonDetail";

export default {
  components: {
    NavFooter,
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
      open: false,
      title: "",
      editorModel: false,
      remoteDesktopModel: false,
      terminalModel: false,
      jupyterModel: false,
    };
  },
  computed: {},
  mounted() {
    console.log("labEnv", this.lavEnv);
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
  },
  beforeDestroy() {

  },
  methods: {},
};
</script>
<style lang="less" scoped>
.content {
  width: 100%;
  height: 100%;
}
</style>
