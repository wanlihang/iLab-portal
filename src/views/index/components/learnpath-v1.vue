<template>
  <div class="index-section-box" v-if="items.length > 0">
    <div class="index-section-title">
      <div class="index-section-title-text">{{ name }}</div>
    </div>
    <div class="index-section-body">
      <template v-for="(course, index) in items">
        <div
          class="learnpath-course-item hover:shadow-lg"
          :key="index"
          @click="goLearnPathDetail(course)"
        >
          <div class="learnpath-course-thumb">
            <img :src="course.thumb" />
          </div>
          <div class="learnpath-course-body">
            <div class="learnpath-course-title">
              {{ course.name }}
            </div>
            <div class="learnpath-course-info">
              <span class="learnpath-course-charge" v-if="course.charge > 0"
                ><small>￥</small>{{ course.charge }}</span
              >
              <span class="green-free" v-if="course.charge === 0">免费</span>
              <span class="learnpath-course-step">
                <span>{{ course.courses_count }}步骤</span>
                <span class="colline">|</span>
                <span>{{ course.original_charge }}课程</span>
              </span>
            </div>
            <p class="learnpath-course-sub">{{ course.desc }}</p>
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
    goLearnPathDetail(item) {
      this.$router.push({ name: "learnPathDetail", query: { id: item.id } });
    },
  },
};
</script>

<style lang="less" scoped>
.box {
  .learnpath-course-item {
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

    .learnpath-course-item {
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
        .learnpath-course-thumb {
          img {
            transform: scale(1.1, 1.1);
          }
        }
      }

      .learnpath-course-thumb {
        width: 173px;
        height: 130px;
        border-radius: 8px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          border-radius: 8px;
          transition: all 0.3s;
        }
      }

      .learnpath-course-body {
        box-sizing: border-box;
        width: 388px;
        display: flex;
        flex-direction: column;
        padding-left: 15px;

        .learnpath-course-title {
          width: 360px;
          height: 20px;
          font-size: 16px;
          font-weight: 500;
          color: #333333;
          line-height: 20px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin-bottom: 20px;
          margin-top: 5px;
        }

        .learnpath-course-info {
          width: 100%;
          height: 20px;
          float: left;
          display: flex;
          align-items: center;
          .learnpath-course-charge {
            height: 20px;
            font-size: 20px;
            font-weight: 600;
            color: #ef4444;
            line-height: 20px;
            small {
              font-size: 14px;
            }
          }
          .green-free {
            font-weight: 600;
            font-size: 14px;
            color: #04c877;
          }

          .learnpath-course-step {
            margin-left: 30px;
            span {
              height: 14px;
              font-size: 14px;
              font-weight: 400;
              color: #333333;
              line-height: 14px;
              &.colline {
                height: 14px;
                color: #cccccc;
                margin-left: 10px;
                margin-right: 10px;
              }
            }
          }
        }
        .learnpath-course-sub {
          width: 360px;
          height: 45px;
          margin-top: 20px;
          font-size: 14px;
          font-weight: 400;
          color: #999999;
          line-height: 20px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>
