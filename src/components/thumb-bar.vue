<template>
  <div class="content-box">
    <div class="flex justify-center" style="width: 100%">
      <div
        class="thumb"
        :style="{
          'border-radius': border + 'px',
          'background-image': 'url(' + value + ')',
          width: width + 'px',
          height: height + 'px',
          'background-position': 'center center',
          'background-size': 'cover',
          'background-repeat': 'no-repeat',
        }"
      ></div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["value", "width", "height", "border"],
  methods: {},
};
</script>
<style lang="less" scoped>
.content-box {
  display: block;
  width: 100%;
  height: auto;
}
</style>
