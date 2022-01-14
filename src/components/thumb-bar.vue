<template>
  <div class="box">
    <div
      :style="{
        'background-image': 'url(' + value + ')',
        width: width + 'px',
        height: height + 'px',
        'background-position': 'center center',
        'background-size': 'cover',
        'background-repeat': 'no-repeat',
      }"
    ></div>
  </div>
</template>
<script>
export default {
  props: ["value", "width", "height", "title"],
  methods: {},
};
</script>
<style lang="less" scoped>
.box {
  display: block;
  width: 100%;
  height: auto;
}
</style>
