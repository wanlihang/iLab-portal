<template>
  <div class="ms-comp" v-if="ms.data">111</div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  props: ["ms"],
  computed: {
    ...mapState(["isLogin", "user"]),
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.ms-comp {
  width: 100%;
  height: auto;
  float: left;
  background: #ffffff;
  flex-direction: column;
  box-sizing: border-box;
  padding: 0px 30px;
}
</style>
