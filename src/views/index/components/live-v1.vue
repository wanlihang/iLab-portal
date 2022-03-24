<template>
  <div class="index-section-box" v-if="items.length > 0">
    <div class="index-section-title">
      <div class="index-section-title-text">{{ name }}</div>
    </div>
    <div class="index-section-body">
      <template v-for="(course, index) in items">
        <div
          class="live-course-item hover:shadow-lg"
          :key="index"
          @click="goLiveDetail(course)"
        >
          <div class="live-course-thumb">
            <img :src="course.thumb" />
          </div>
          <div class="live-course-body">
            <div class="live-course-title">
              {{ course.title }}
            </div>
            <div class="live-course-info">
              <div class="live-course-sub" v-if="course.category">
                {{ course.category.name }}
              </div>
              <div class="live-course-charge">
                <span class="charge-text" v-if="course.charge > 0">
                  <template>
                    <span class="unit">￥</span>{{ course.charge }}
                  </template>
                </span>
                <span class="free-text" v-else> 免费 </span>
              </div>
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
    goLiveDetail(item) {
      this.$router.push({ name: "liveDetail", query: { id: item.id } });
    },
  },
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
    grid-template-columns: repeat(4, minmax(0, 1fr));
    overflow: hidden;
    white-space: nowrap;
    box-sizing: border-box;
    padding-bottom: 40px;

    .live-course-item {
      width: 100%;
      height: 273px;
      display: flex;
      cursor: pointer;
      flex-direction: column;
      border-radius: 8px;
      &:hover {
        .live-course-thumb {
          img {
            transform: scale(1.1, 1.1);
          }
        }
      }

      .live-course-thumb {
        width: 264px;
        height: 198px;
        border-radius: 8px 8px 0px 0px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          border-radius: 8px 8px 0px 0px;
          transition: all 0.5s;
        }
      }

      .live-course-body {
        box-sizing: border-box;
        width: 100%;
        height: 75px;
        background-color: #fff;
        border-radius: 0px 0px 8px 8px;
        padding: 15px 15px 15px 10px;

        .live-course-title {
          width: 100%;
          height: 20px;
          float: left;
          font-size: 16px;
          font-weight: 600;
          color: #333333;
          line-height: 20px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin-bottom: 9px;
        }

        .live-course-info {
          width: 100%;
          height: 20px;
          float: left;
          display: flex;
          align-items: center;

          .live-course-sub {
            flex: 1;
            text-align: left;
            height: 14px;
            font-size: 14px;
            font-weight: 400;
            color: #999999;
            line-height: 14px;
          }

          .live-course-charge {
            flex: 1;
            text-align: right;
            height: 20px;
            font-size: 20px;
            line-height: 20px;
            font-weight: 600;

            .charge-text {
              color: #ff5858;

              .unit {
                font-size: 14px;
              }
            }

            .free-text {
              font-size: 14px;
              color: #04c877;
            }
          }
        }
      }
    }
  }
}
</style>
