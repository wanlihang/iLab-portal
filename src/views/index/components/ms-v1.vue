<template>
  <div class="index-section-box" v-if="items.length > 0">
    <div class="index-section-title">
      <div class="index-section-title-text">{{ name }}</div>
    </div>
    <div class="index-section-body">
      <template v-for="(course, index) in items">
        <div
          class="ms-course-item hover:shadow-lg"
          :key="index"
          @click="goMsDetail(course)"
        >
          <div class="ms-course-thumb">
            <img :src="course.goods_thumb" />
          </div>
          <div class="ms-course-body">
            <div class="ms-course-title">
              {{ course.goods_title }}
            </div>
            <div class="ms-course-info">
              <div class="ms-course-charge">
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
            <div class="ms-progress">
              <div class="label">立即抢购</div>
              <div class="progress-text">
                <div class="progress-render">
                  <div
                    class="nowprogress"
                    :style="{ width: proWidth(course.num, course.over_num) }"
                  ></div>
                </div>
                <div class="progress-text-pure">
                  {{
                    (
                      ((course.num - course.over_num) * 100) /
                      course.num
                    ).toFixed(0)
                  }}%
                </div>
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
  computed: {},
  methods: {
    proWidth(num, overnum) {
      return (((num - overnum) * 100) / num).toFixed(0) + "px";
    },
    goMsDetail(item) {
      this.$router.push({
        name: "msDetail",
        query: {
          id: item.id,
        },
      });
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

    .ms-course-item {
      width: 100%;
      height: auto;
      display: flex;
      cursor: pointer;
      flex-direction: column;
      border-radius: 8px;

      .ms-course-thumb {
        width: 264px;
        height: 198px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          border-radius: 8px 8px 0px 0px;
        }
      }

      .ms-course-body {
        box-sizing: border-box;
        width: 100%;
        height: 109px;
        background-color: #fff;
        border-radius: 0px 0px 8px 8px;
        padding: 15px 10px 15px 10px;
        position: relative;

        .ms-course-title {
          width: 100%;
          height: 16px;
          float: left;
          font-size: 16px;
          font-weight: 600;
          color: #333333;
          line-height: 16px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin-bottom: 15px;
        }

        .ms-course-info {
          width: 100%;
          float: left;
          display: flex;
          flex-direction: column;

          .ms-course-charge {
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
        .ms-progress {
          position: absolute;
          right: 10px;
          bottom: 15px;
          width: 137px;
          height: 48px;
          background: linear-gradient(90deg, #fa1b1b 0%, #ff7946 100%);
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
            margin-bottom: 8px;
          }
          .progress-text {
            width: 100%;
            height: 12px;
            font-size: 12px;
            font-weight: 400;
            color: #ffffff;
            line-height: 12px;
            padding: 0px 8px 0px 5px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            flex-direction: row;
            .progress-text-pure {
              margin-left: 2px;
            }
            .progress-render {
              width: 100px;
              height: 7px;
              background: rgba(255, 255, 255, 0.4);
              border-radius: 4px;
              position: relative;
              .nowprogress {
                position: absolute;
                top: 0;
                left: 0;
                height: 7px;
                background-color: #fff;
                border-radius: 4px;
                z-index: 10;
              }
            }
          }
        }
      }
    }
  }
}
</style>