<template>
  <div></div>
</template>
<script>
import { mapState } from "vuex";
export default {
  props: ["type", "id", "title"],
  data() {
    return {};
  },
  computed: {
    ...mapState(["configFunc"]),
  },
  mounted() {
    this.divHistoryRecord();
  },
  methods: {
    // 浏览记录
    divHistoryRecord() {
      if (this.type && this.configFunc.history) {
        this.$api.TemplateOne.History.Record(
          this.type,
          this.id,
          this.title
        ).then(() => {});
      }
    },
  },
};
</script>