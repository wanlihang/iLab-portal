<template>
  <div id="app">
    <splitpanes class="default-theme">
      <pane size="40" min-size="30">
        <iframe :src="this.lavEnv.coursewarePath" ref="iframe1" height="100%" width="100%"></iframe>
      </pane>
      <pane size="60" min-size="50">
        <iframe :src="this.lavEnv.labEnvPath" ref="iframe2" height="100%" width="100%"></iframe>
      </pane>
    </splitpanes>
  </div>
</template>

<script>

import {Splitpanes, Pane} from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

export default {
  components: {
    Splitpanes,
    Pane
  },
  name: 'Terminal',
  props: ["lavEnv"],

  data() {
    return {
      leftWidth: "40%",
      rightWidth: "60%",
    }
  },
  methods: {}
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
