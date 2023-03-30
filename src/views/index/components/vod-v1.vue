<template>
  <div class="index-section-box" v-if="items.length > 0">
    <div class="index-section-title">
      <div class="index-section-title-text">{{ name }}</div>
    </div>
    <div class="index-section-body">
      <div
        class="vod-course-item"
        v-for="(course, index) in items"
        :key="index"
      >
        <vod-course-item
          :cid="course.id"
          :videos-coun="course.videos_count"
          :thumb="course.thumb"
          :category="course.category"
          :title="course.title"
          :charge="course.charge"
          :is-free="course.is_free"
          :user-count="course.user_count"
        ></vod-course-item>
      </div>
    </div>
  </div>
</template>

<script>
import VodCourseItem from "../../../components/vod-course-item";

export default {
  components: {
    VodCourseItem,
  },
  props: ["name", "items"],
  computed: {},
};
</script>

<style lang="less" scoped>
.box {
  .index-section-box {
    width: 100%;
    margin-top: 40px;
  }
  .index-section-title {
    width: 100%;
    text-align: center;
    margin-bottom: 30px;
    .index-section-title-text {
      height: 30px;
      font-size: 30px;
      font-weight: 600;
      color: #333333;
      line-height: 30px;
    }
  }
  .index-section-body {
    width: 100%;
    display: grid;
    row-gap: 30px;
    column-gap: 48px;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    overflow: hidden;
    white-space: nowrap;
    box-sizing: border-box;
    padding-bottom: 40px;
  }
}
</style>
