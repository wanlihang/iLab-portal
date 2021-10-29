<template>
  <span>{{ hour }}:{{ minute }}:{{ second }}</span>
</template>

<script>
export default {
  props: ["seconds"],
  computed: {
    hour() {
      let h = parseInt(this.seconds / 3600);
      return h >= 10 ? h : "0" + h;
    },
    minute() {
      let m = parseInt((this.seconds % 3600) / 60);
      return m >= 10 ? m : "0" + m;
    },
    second() {
      let s = (this.seconds % 3600) % 60;
      return s >= 10 ? s : "0" + s;
    },
  },
};
</script>