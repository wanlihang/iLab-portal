<template>
  <div class="index-section-box" v-if="items.length > 0">
    <div class="index-section-title">
      <div class="index-section-title-text">{{ name }}</div>
    </div>
    <div class="index-section-body">
      <template v-for="(course, index) in items">
        <div
          class="topic-course-item hover:shadow-lg"
          :key="index"
          @click="goTopicDetail(course)"
        >
          <div class="topic-course-thumb">
            <img :src="course.thumb" />
          </div>
          <div class="topic-course-body">
            <div class="topic-course-title">
              {{ course.title }}
            </div>
            <div class="topic-course-info">
              <span class="topic-course-type" v-if="course.category">{{
                course.category.name
              }}</span>
              <span class="topic-course-sub">
                <span>{{ course.view_times }}人已阅读</span>
              </span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: ["name", "items"],
  methods: {
    goTopicDetail(item) {
      this.$router.push({ name: "topicDetail", query: { id: item.id } });
    },
  },
};
</script>

<style lang="less" scoped>
.box {
  .topic-course-item {
    background-color: #fff;
  }
  .index-section-box {
    width: 100%;
    margin-top: 40px;
  }
  .index-section-title {
    width: 100%;
    text-align: center;
    margin-bottom: 50px;
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
    grid-template-columns: repeat(2, minmax(0, 1fr));
    overflow: hidden;
    white-space: nowrap;
    box-sizing: border-box;
    padding-bottom: 40px;

    .topic-course-item {
      width: 100%;
      height: auto;
      display: flex;
      cursor: pointer;
      flex-direction: row;
      box-sizing: border-box;
      padding: 15px;
      border-radius: 8px;
      border: 1px solid #f1f2fa;
      &:hover {
        .topic-course-thumb {
          img {
            transform: scale(1.1, 1.1);
          }
        }
      }
      .topic-course-thumb {
        width: 133px;
        height: 100px;
        border-radius: 8px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          border-radius: 8px;
          transition: all 0.3s;
        }
      }

      .topic-course-body {
        box-sizing: border-box;
        width: 388px;
        display: flex;
        flex-direction: column;
        padding-left: 15px;

        .topic-course-title {
          width: 360px;
          height: 20px;
          font-size: 16px;
          font-weight: 600;
          color: #333333;
          line-height: 20px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin-bottom: 28px;
          margin-top: 15px;
        }

        .topic-course-info {
          width: 100%;
          height: 24px;
          float: left;
          display: flex;
          align-items: center;
          .topic-course-type {
            padding: 5px 8px;
            background: rgba(255, 80, 104, 0.1);
            border-radius: 12px;
            font-size: 14px;
            font-weight: 400;
            color: #ff5068;
            line-height: 14px;
          }

          .topic-course-sub {
            margin-left: 15px;
            span {
              height: 14px;
              font-size: 14px;
              font-weight: 400;
              color: #333333;
              line-height: 14px;
            }
          }
        }
      }
    }
  }
}
</style>
