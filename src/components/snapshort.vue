<template>
  <div class="snapshot-box" v-if="status">
    <div class="tabIcon" v-show="!showList" @click="showImagesList">
      <img src="../assets/img/commen/icon-camera.png" />
    </div>
    <shapshot-preview
      :url="previewThumb"
      v-show="previewStatus"
      @close="closePreview"
      @del="delThumb"
    ></shapshot-preview>
    <div class="list-box" v-show="showList">
      <div class="list-top">
        <div class="left" v-if="changeBox">照片管理</div>
        <div class="left" v-else>学习拍照</div>
        <div class="right" v-if="changeBox" @click="back">返回</div>
        <div class="right" v-else @click="cancel">最小化窗口</div>
      </div>
      <div class="thumb-box" v-show="changeBox">
        <div
          class="thumb-item"
          :class="{ active: sel === index }"
          v-for="(imgItem, index) in imagesList"
          :key="index"
          @click="showPreviewImage(index, imgItem.thumb, imgItem.id)"
        >
          <div
            v-show="imgItem.thumb"
            class="image-view"
            :style="{ 'background-image': 'url(' + imgItem.thumb + ')' }"
          ></div>
        </div>
      </div>
      <div class="camera-box" v-show="!changeBox">
        <div class="content" id="contentHolder" v-show="openCamera">
          <template>
            <canvas
              v-show="false"
              ref="canvas"
              width="1920"
              height="1440"
            ></canvas>
            <video
              v-show="false"
              id="video"
              width="1920"
              height="1440"
              autoplay
              ref="capture-video"
            ></video>
          </template>
          <video
            id="video"
            width="290"
            height="164"
            autoplay
            ref="videos"
          ></video>
        </div>
        <span class="tip" v-show="!openCamera">摄像头未捕捉到画面</span>
      </div>
      <div v-show="changeBox" class="upload-image-snapshot">
        <input
          class="input-upload"
          type="file"
          accept="image/*"
          @change="uploadImage"
        />
        手动上传学习照片
      </div>
      <div v-show="!changeBox" class="upload-image-snapshot" @click="getList">
        学习照片管理
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Utils from "@/js/utils";
import ShapshotPreview from "../components/snapshot-preview.vue";
export default {
  components: {
    ShapshotPreview,
  },
  props: ["cid", "resourceType", "duration"],
  data() {
    return {
      status: false,
      sel: null,
      showList: true,
      uploadImgLoading: false,
      saveConfig: null,
      intervalId: null,
      loading: false,
      count: 0,
      changeBox: false,
      openCamera: false,
      imagesList: [],
      previewThumb: null,
      thumbId: null,
      previewStatus: false,
    };
  },
  computed: {
    ...mapState(["isLogin", "user"]),
  },
  mounted() {
    this.getCount();
    this.getConfig();
  },
  beforeDestroy() {
    this.stopCamera();
    this.clearTask();
  },
  methods: {
    cancel() {
      this.showList = false;
      this.previewStatus = false;
    },
    back() {
      this.changeBox = false;
      this.previewStatus = false;
    },
    closePreview() {
      this.sel = null;
      this.previewStatus = false;
    },
    showImagesList() {
      this.showList = true;
    },
    getConfig() {
      this.$api.Snapshot.Config().then((res) => {
        this.saveConfig = res.data;
        this.status = this.saveConfig.status[this.resourceType] === 1;

        if (this.status) {
          this.$nextTick(() => {
            this.getCamera();
          });
        }
      });
    },
    stopCamera() {
      if (window.snapShortMediaStream) {
        if (typeof window.snapShortMediaStream.stop === "function") {
          window.snapShortMediaStream.stop();
        } else {
          window.snapShortMediaStream.getTracks()[0].stop();
        }
      }
    },
    getCamera() {
      let video = this.$refs["videos"];
      let captureVideo = this.$refs["capture-video"];
      if (
        window.navigator.mediaDevices &&
        window.navigator.mediaDevices.getUserMedia
      ) {
        window.navigator.mediaDevices
          .getUserMedia({
            audio: false,
            video: {
              facingMode: "user",
              width: 290,
              height: 164,
            },
          })
          .then((mediaStream) => {
            window.snapShortMediaStream = mediaStream;

            video.srcObject = mediaStream;
            video.onloadedmetadata = () => {
              video.play();
            };

            captureVideo.srcObject = mediaStream;
            captureVideo.onloadedmetadata = () => {
              captureVideo.play();
            };

            // 开启定时任务
            this.openCamera = true;
            this.startTask();
          })
          .catch((err) => {
            console.log("err:" + err);
            this.openCamera = false;
          });
      }
    },
    getList() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.changeBox = true;
      this.$api.Snapshot.ImagesList({
        resource_id: this.cid,
        resource_type: this.resourceType,
      }).then((res) => {
        this.loading = false;
        this.imagesList = res.data.data;
      });
    },
    startTask() {
      this.intervalId = setInterval(
        this.taskHandler,
        this.saveConfig.cycle_time * 1000
      );
    },
    showPreviewImage(index, item, id) {
      this.sel = index;
      this.previewThumb = item;
      this.thumbId = id;
      this.previewStatus = true;
    },
    taskHandler() {
      console.info("开始拍照啦...");
      let randomInt = Utils.random(0, 100);
      if (
        randomInt <= this.saveConfig.rate &&
        this.count < this.saveConfig.max_times
      ) {
        this.uploadShotImage();
      }

      if (this.count >= this.saveConfig.max_times) {
        // 超过最大次数
        this.clearTask();
      }
    },
    clearTask() {
      console.log("删除拍照任务");
      this.intervalId && clearInterval(this.intervalId);
    },
    uploadShotImage() {
      // 触发视频暂停事件
      let canvas = this.$refs["canvas"];
      canvas
        .getContext("2d")
        .drawImage(this.$refs["capture-video"], 0, 0, 1920, 1440);
      canvas.toBlob((blob) => {
        let formData = new FormData();
        formData.append("file", blob);
        formData.append("duration", this.duration);
        formData.append("resource_id", this.cid);
        formData.append("resource_type", this.resourceType);
        this.uploadImgLoading = true;
        this.$api.Snapshot.UploadImages(formData)
          .then(() => {
            this.uploadImgLoading = false;
            this.count++;
          })
          .catch((e) => {
            this.uploadImgLoading = false;
            this.$message.error(e.message || "上传错误");
          });
      });
    },
    uploadImage(e) {
      let files = e.target.files;
      if (this.uploadImgLoading) {
        return;
      }
      if (!files[0].type.match(/.jpg|.png|.jpeg/i)) {
        this.$message.error("图片格式错误,请上传png/jpg/jpeg格式的图片");
        return;
      }
      let formData = new FormData();
      formData.append("file", files[0]);
      formData.append("duration", this.duration);
      formData.append("resource_id", this.cid);
      formData.append("resource_type", this.resourceType);
      this.uploadImgLoading = true;
      this.$api.Snapshot.UploadImages(formData)
        .then((res) => {
          this.uploadImgLoading = false;

          this.$message.success("上传成功");
          this.getList();
        })
        .catch(() => {
          this.uploadImgLoading = false;
          this.$message.error("上传出现错误");
        });
    },
    delThumb() {
      this.$api.Snapshot.DestroyImages(this.thumbId).then((res) => {
        this.$message.success("删除成功");
        this.getList();
      });
    },
    getCount() {
      this.$api.Snapshot.Query({
        resource_type: this.resourceType,
        resource_id: this.cid,
      }).then((res) => {
        this.count = res.data.count;
      });
    },
  },
};
</script>

<style lang="less" scoped>
.snapshot-box {
  min-height: 352px;
  position: fixed;
  z-index: 1000;
  right: 0;
  top: 200px;
  .preview-box {
    position: absolute;
    top: 0;
    right: 330px;
    width: 400px;
    height: 300px;
    background: #f4fafe;
    .mask {
      width: 100%;
      height: 100%;
      .image {
        width: 100%;
        height: 300px;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center center;
      }
    }
  }
  .tabIcon {
    position: absolute;
    top: 0;
    right: 0;
    width: 60px;
    height: 60px;
    background: #04c877;
    border-radius: 8px 0px 0px 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
    img {
      width: 30px;
      height: 30px;
    }
  }
  .list-box {
    width: 330px;
    // min-height: 352px;
    background: #ffffff;
    box-shadow: 0px 4px 8px 4px rgba(51, 51, 51, 0.05);
    border-radius: 8px 0px 0px 8px;
    padding: 15px 20px 20px 20px;
    box-sizing: border-box;
    .list-top {
      width: 100%;
      height: 20px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 15px;
      .left {
        font-size: 14px;
        font-weight: 500;
        color: #333333;
      }
      .right {
        font-size: 12px;
        font-weight: 400;
        color: #04c877;
        cursor: pointer;
        &:hover {
          opacity: 0.8;
        }
      }
    }
    .thumb-box {
      width: 290px;
      max-height: 224px;
      background: #ffffff;
      overflow-y: auto;
      display: grid;
      gap: 10px;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      .thumb-item {
        width: 90px;
        height: 68px;
        border: 1px solid #e5e5e5;
        cursor: pointer;
        position: relative;
        &.active {
          opacity: 0.6;
          border: 1px solid #04c877;
        }
        .image-view {
          width: 100%;
          height: 66px;
          background-repeat: no-repeat;
          background-size: contain;
          background-position: center center;
        }
      }
    }
    .camera-box {
      width: 290px;
      height: 164px;
      background: #f4fafe;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      .content {
        width: 100%;
        height: auto;
        canvas {
          display: none;
        }
      }
      .tip {
        width: 290px;
        height: 12px;
        text-align: center;
        font-size: 12px;
        font-weight: 400;
        color: #04c877;
        line-height: 12px;
      }
    }
    .upload-image-snapshot {
      width: 134px;
      height: 44px;
      background: #04c877;
      border-radius: 4px;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      font-weight: 400;
      color: #ffffff;
      cursor: pointer;
      position: relative;
      margin-top: 20px;
      .input-upload {
        width: 134px;
        height: 44px;
        background: #04c877;
        border-radius: 4px;
        opacity: 0;
        cursor: pointer;
        top: 0;
        left: 0;
        position: absolute;
      }
      &:hover {
        opacity: 0.8;
      }
    }
  }
}
</style>
