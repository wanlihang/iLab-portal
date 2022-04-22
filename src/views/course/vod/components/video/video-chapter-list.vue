<template>
  <div>
    <div class="chapter-item" v-for="chapter in chapters" :key="chapter.id">
      <div class="chapter-name">{{ chapter.title }}</div>
      <div class="chapter-videos-box">
        <div
          class="video-item"
          :class="{ selChapter: videoItem.id === video.id }"
          @click="switchVideo(videoItem)"
          v-for="videoItem in videos[chapter.id]"
          :key="videoItem.id"
        >
          <img
            class="play-icon"
            v-if="
              isBuy ||
                course.is_free === 1 ||
                videoItem.charge === 0 ||
                (videoItem.charge > 0 && videoItem.free_seconds > 0) ||
                buyVideos.indexOf(videoItem.id) !== -1
            "
            src="@/assets/img/commen/icon-unlock.png"
          />
          <img
            class="play-icon"
            v-else
            src="@/assets/img/commen/icon-lock.png"
          />
          <div class="video-title">
            <div
              :class="{
                active: videoItem.id === video.id,
                text1:
                  !isBuy &&
                  course.is_free !== 1 &&
                  (videoItem.charge === 0 || videoItem.free_seconds > 0),
                text2: !(
                  !isBuy &&
                  course.is_free !== 1 &&
                  (videoItem.charge === 0 || videoItem.free_seconds > 0)
                ),
              }"
              class="text"
            >
              {{ videoItem.title }}
            </div>

            <div
              class="free"
              v-if="
                isBuy === false &&
                  course.is_free !== 1 &&
                  (videoItem.charge === 0 || videoItem.free_seconds > 0)
              "
            >
              试看
            </div>
          </div>
        </div>
      </div>
    </div>
    <template v-if="videos[0] && videos[0].length > 0">
      <div class="chapter-item">
        <div class="chapter-name">无章节内容</div>
        <div class="chapter-videos-box">
          <div
            class="video-item"
            :class="{ selChapter: videoItem.id === video.id }"
            @click="switchVideo(videoItem)"
            v-for="videoItem in videos[0]"
            :key="videoItem.id"
          >
            <img
              class="play-icon"
              v-if="
                isBuy ||
                  course.is_free === 1 ||
                  videoItem.charge === 0 ||
                  (videoItem.charge > 0 && videoItem.free_seconds > 0) ||
                  buyVideos.indexOf(videoItem.id) !== -1
              "
              src="@/assets/img/commen/icon-unlock.png"
            />
            <img
              class="play-icon"
              v-else
              src="@/assets/img/commen/icon-lock.png"
            />
            <div class="video-title">
              <div
                :class="{
                  active: videoItem.id === video.id,
                  text1:
                    !isBuy &&
                    course.is_free !== 1 &&
                    (videoItem.charge === 0 || videoItem.free_seconds > 0),
                  text2: !(
                    !isBuy &&
                    course.is_free !== 1 &&
                    (videoItem.charge === 0 || videoItem.free_seconds > 0)
                  ),
                }"
                class="text"
              >
                {{ videoItem.title }}
              </div>

              <div
                class="free"
                v-if="
                  isBuy === false &&
                    course.is_free !== 1 &&
                    (videoItem.charge === 0 || videoItem.free_seconds > 0)
                "
              >
                试看
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: ["videos", "video", "isBuy", "course", "buyVideos", "chapters"],
  methods: {
    switchVideo(item) {
      if (this.video.id === item.id) {
        return;
      }
      this.$emit("switchVideo", item);
    },
  },
};
</script>

<style lang="less" scoped>
.video-item {
  width: 100%;
  height: 24px;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  margin-top: 30px;
  cursor: pointer;
  overflow: hidden;
  &:first-child {
    margin-top: 0px;
  }
  .play-icon {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
  .video-title {
    width: 100%;
    height: 22px;
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    line-height: 14px;
    margin-left: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    .active {
      color: #3ca7fa;
    }
    .text {
      width: 173px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-all;
    }
    .text2 {
      width: 222px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-all;
    }
    .free {
      margin-left: 5px;
      width: 44px;
      height: 22px;
      background: #04c877;
      border-radius: 2px;
      color: #fff;
      font-size: 12px;
      font-weight: 400;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .video-duration {
    position: absolute;
    height: 14px;
    font-size: 14px;
    font-weight: 400;
    color: #999999;
    line-height: 14px;
    top: 5px;
    right: 0;
  }
}
.chapter-item {
  width: 100%;
  height: auto;
  margin-top: 50px;
  &:first-child {
    margin-top: 0px;
  }
  .chapter-name {
    width: 100%;
    height: 16px;
    font-size: 16px;
    font-weight: 500;
    color: #333333;
    line-height: 16px;
    margin-bottom: 30px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    &:first-child {
      margin-bottom: 0px;
    }
    &:last-child {
      margin-bottom: 0px;
    }
  }
  .chapter-videos-box {
    width: 100%;
    height: auto;
    .video-item {
      width: 100%;
      height: 24px;
      display: flex;
      flex-direction: row;
      align-items: center;
      position: relative;
      cursor: pointer;
      margin-top: 30px;
      overflow: hidden;
      .play-icon {
        width: 20px;
        height: 20px;
        cursor: pointer;
      }
      .video-title {
        height: 22px;
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        line-height: 14px;
        margin-left: 10px;
        display: flex;
        flex-direction: row;
        align-items: center;
        .active {
          color: #3ca7fa;
        }
        .text {
          width: 173px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
        }
        .text2 {
          width: 222px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
        }
        .free {
          margin-left: 5px;
          width: 44px;
          height: 22px;
          background: #04c877;
          border-radius: 2px;
          color: #fff;
          font-size: 12px;
          font-weight: 400;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
      .video-info {
        position: absolute;
        height: 24px;
        display: flex;
        align-items: center;
        flex-direction: row;
        font-size: 14px;
        font-weight: 400;
        color: #999999;
        line-height: 14px;
        top: 0px;
        right: 0;
        .active-icon {
          width: 22px;
          height: 22px;
          margin-right: 30px;
        }
      }
    }
  }
}
</style>
