<template>
  <div class="index-section-box" v-if="items.length > 0">
    <div class="index-section-title">
      <div class="index-section-title-text">{{ name }}</div>
    </div>
    <div class="index-section-body">
      <template v-for="(course, index) in items">
        <div
          class="book-course-item hover:shadow-lg"
          :key="index"
          @click="goBookDetail(course)"
        >
          <div class="book-course-thumb">
            <img :src="course.thumb" />
          </div>
          <div class="book-course-body">
            <div class="book-course-title">
              {{ course.name }}
            </div>
            <div class="book-course-info">
              <div class="book-course-charge">
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
    goBookDetail(item) {
      this.$router.push({ name: "bookDetail", query: { id: item.id } });
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
  .book-course-item {
    background-color: #fff;
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

    .book-course-item {
      width: 100%;
      height: 290px;
      display: flex;
      cursor: pointer;
      box-sizing: border-box;
      flex-direction: column;
      padding: 15px;
      border-radius: 8px;
      border: 1px solid #f1f2fa;
      &:hover {
        .book-course-thumb {
          img {
            transform: scale(1.1, 1.1);
          }
        }
      }
      .book-course-thumb {
        width: 100%;
        height: 160px;
        text-align: center;
        img {
          object-fit: cover;
          display: inline-block;
          width: 120px;
          height: 160px;
          border-radius: 8px;
          transition: all 0.3s;
        }
      }

      .book-course-body {
        box-sizing: border-box;
        width: 100%;
        margin-top: 20px;
        .book-course-title {
          width: 100%;
          height: 20px;
          text-align: center;
          float: left;
          font-size: 16px;
          font-weight: 600;
          color: #333333;
          line-height: 20px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin-bottom: 20px;
        }

        .book-course-info {
          width: 100%;
          height: 20px;
          float: left;
          display: flex;
          align-items: center;

          .book-course-charge {
            width: 100%;
            text-align: center;
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
