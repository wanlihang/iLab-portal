<template>
  <div class="index-section-box" v-if="items.length > 0">
    <div class="index-section-title">
      <div class="index-section-title-text">{{ name }}</div>
    </div>
    <div class="index-section-body">
      <template v-for="(course, index) in items">
        <div
          class="tg-course-item hover:shadow-lg"
          :key="index"
          @click="goTgDetail(course)"
        >
          <div class="tg-course-thumb">
            <template v-if="course.goods_thumb">
              <thumb-bar
                class="thumb-bar"
                v-if="course.goods_type === 'book'"
                :value="course.goods_thumb"
                :border="8"
                :width="148.5"
                :height="198"
              ></thumb-bar>
              <thumb-bar
                class="thumb-bar"
                v-else
                :value="course.goods_thumb"
                :width="264"
                :height="198"
              ></thumb-bar>
            </template>
          </div>
          <div class="tg-course-body">
            <div class="tg-course-title">
              {{ course.goods_title }}
            </div>
            <div class="tg-course-info">
              <div class="tg-course-charge">
                <span class="charge-text">
                  <template>
                    <span class="unit">￥</span>{{ course.charge }}
                  </template>
                </span>
              </div>
              <div class="original_charge">
                原价：{{ course.original_charge }}
              </div>
            </div>
            <div class="tg-progress">
              <div class="label">立即抢购</div>
              <div class="progress-text">{{ course.people_num }}人团</div>
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
    goTgDetail(item) {
      if (item.goods_type === "course") {
        this.$router.push({
          name: "coursesDetail",
          query: {
            id: item.other_id,
          },
        });
      } else if (item.goods_type === "live") {
        this.$router.push({
          name: "liveDetail",
          query: {
            id: item.other_id,
          },
        });
      } else if (item.goods_type === "book") {
        this.$router.push({
          name: "bookDetail",
          query: {
            id: item.other_id,
          },
        });
      } else if (item.goods_type === "learnPath") {
        this.$router.push({
          name: "learnPathDetail",
          query: {
            id: item.other_id,
          },
        });
      }
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

    .tg-course-item {
      width: 100%;
      height: auto;
      display: flex;
      cursor: pointer;
      border-radius: 8px;
      flex-direction: column;
      background-color: #fff;
      &:hover {
        .tg-course-thumb {
          .thumb-bar {
            transform: scale(1.1, 1.1);
          }
        }
      }
      .tg-course-thumb {
        width: 264px;
        height: 198px;
        border-radius: 8px 8px 0px 0px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          border-radius: 8px 8px 0px 0px;
        }
        .thumb-bar {
          transition: all 0.3s;
        }
      }

      .tg-course-body {
        box-sizing: border-box;
        width: 100%;
        height: auto;
        background-color: #fff;
        border-radius: 0px 0px 8px 8px;
        padding: 15px 10px 15px 10px;
        position: relative;

        .tg-course-title {
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
          margin-bottom: 15px;
        }

        .tg-course-info {
          width: 100%;
          float: left;
          display: flex;
          flex-direction: column;

          .tg-course-charge {
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
          .original_charge {
            margin-top: 10px;
            height: 14px;
            font-size: 14px;
            font-weight: 400;
            color: #999999;
            line-height: 14px;
            text-decoration: line-through;
          }
        }
        .tg-progress {
          position: absolute;
          right: 10px;
          bottom: 15px;
          width: 137px;
          height: 48px;
          background: linear-gradient(90deg, #ff2276 0%, #ff897c 100%);
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          .label {
            width: 100%;
            height: 16px;
            font-size: 16px;
            font-weight: 600;
            color: #ffffff;
            line-height: 16px;
            text-align: center;
            margin-top: 10px;
            margin-bottom: 6px;
          }
          .progress-text {
            width: 100%;
            height: 12px;
            font-size: 12px;
            font-weight: 400;
            color: #ffffff;
            line-height: 12px;
            box-sizing: border-box;
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
