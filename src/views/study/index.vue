<template>
  <div class="content">
    <shapshot-preview
      :url="previewThumb"
      v-show="previewStatus"
      @close="closePreview"
      @del="delThumb"
    ></shapshot-preview>
    <div class="mask" v-show="dialogStatus">
      <div class="dialog-box" v-show="editStatus">
        <div class="item-tab">修改个人信息</div>
        <img
          v-if="status"
          class="btn-close"
          @click="cancel()"
          src="../../assets/img/commen/icon-close.png"
        />
        <div class="info">
          <div class="input-item">
            <label>真实姓名：</label>
            <input
              type="text"
              placeholder="请填写您的真实姓名"
              autocomplete="off"
              v-model="form.real_name"
              class="input"
              required=""
            />
          </div>
          <div class="input-item">
            <label>身份证号码：</label>
            <input
              type="text"
              placeholder="请填写问您的身份证号码"
              autocomplete="off"
              v-model="form.id_number"
              class="input"
              required=""
            />
          </div>
        </div>
        <div class="btn-box">
          <div class="btn-submit" @click="saveSubmit()">保存</div>
          <div v-if="status" class="btn-cancel" @click="cancel()">取消</div>
        </div>
      </div>
      <div class="dialog-box" v-show="picStatus">
        <div class="item-tab">照片管理</div>
        <img
          class="btn-close"
          @click="cancel()"
          src="../../assets/img/commen/icon-close.png"
        />
        <div class="thumb-box">
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
        <div class="btn-box">
          <div class="upload-image">
            <input
              class="input-upload"
              type="file"
              accept="image/*"
              @change="uploadImage"
            />
            手动上传学习照片
          </div>
        </div>
      </div>
    </div>
    <div class="contanier">
      <div class="top-content">
        <div class="left" v-if="profile">
          <div class="nickname">
            姓名：<span>{{ profile.real_name || "未填写" }}</span>
          </div>
          <div class="id-number">
            身份证号：<span>{{ profile.id_number || "未填写" }}</span>
          </div>
        </div>
        <div class="right-button" @click="editProfile">修改信息</div>
      </div>
      <div class="item-box">
        <template v-if="courses && courses.length > 0">
          <div class="item" v-for="item in courses" :key="item.id">
            <div class="item-content">
              <div class="item-thumb"><img :src="item.thumb" /></div>
              <div class="item-info">
                <div class="item-title">{{ item.title }}</div>
                <div
                  class="item-text"
                  v-if="courseProgress && courseProgress[item.id]"
                >
                  整体学习进度：{{ courseProgress[item.id].progress }}%
                </div>
              </div>
            </div>
            <template v-if="videos && videos[item.id]">
              <div class="videoItem-box">
                <div
                  class="videoItem"
                  v-for="videoItem in videos[item.id]"
                  :key="videoItem.id"
                  @click="goDetail(videoItem.id)"
                >
                  <div class="videoItem-tit">
                    <img
                      class="play-icon"
                      src="../../assets/img/commen/icon-video@2x.png"
                    />
                    <div class="tit">{{ videoItem.title }}</div>
                  </div>
                  <div
                    class="videoItem-progress"
                    v-if="videoProgress && videoProgress[videoItem.id]"
                  >
                    学习进度:<span>{{
                      noWatched(
                        videoItem.duration,
                        videoProgress[videoItem.id].watch_seconds
                      )
                    }}</span>
                  </div>
                  <div class="videoItem-progress" v-else>
                    学习进度:<span>{{ noWatched(videoItem.duration, 0) }}</span>
                  </div>
                  <div
                    class="videoItem-images"
                    v-if="
                      images &&
                      images[videoItem.id] &&
                      images[videoItem.id].images_count !== 0
                    "
                    @click.stop="showImagesDialog(videoItem.id)"
                  >
                    <img
                      class="pic-icon"
                      src="../../assets/img/commen/icon-camera-h@2x.png"
                    />
                    {{ images[videoItem.id].images_count }}张照片
                  </div>
                  <div
                    class="videoItem-images"
                    v-else
                    @click.stop="showImagesDialog(videoItem.id)"
                  >
                    <img
                      class="pic-icon"
                      src="../../assets/img/commen/icon-camera-n@2x.png"
                    />
                    无照片
                  </div>
                </div>
              </div>
            </template>
          </div>
        </template>
        <none type="white" v-else></none>
      </div>
    </div>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
import NavFooter from "../../components/footer.vue";
import None from "../../components/none.vue";
import ShapshotPreview from "../../components/snapshot-preview.vue";

export default {
  components: {
    NavFooter,
    None,
    ShapshotPreview,
  },
  data() {
    return {
      loading: false,
      status: true,
      profile: [],
      images: [],
      courses: [],
      courseProgress: [],
      videoProgress: [],
      videos: [],
      dialogStatus: false,
      editStatus: false,
      picStatus: false,
      uploadImgLoading: false,
      form: {
        real_name: null,
        id_number: null,
      },
      sel: null,
      imagesList: [],
      previewThumb: null,
      thumbId: null,
      previewStatus: false,
      cid: null,
      type: null,
      duration: 0,
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    noWatched(sum, sec) {
      let num = parseInt(sum) - parseInt(sec);
      if (num <= 0) {
        return "已看完";
      } else {
        let time = this.$utils.getHMS(num);
        return "剩余" + time + "秒未看";
      }
    },
    cancel() {
      this.dialogStatus = false;
      this.editStatus = false;
      this.picStatus = false;
      this.status = true;
    },
    editProfile() {
      this.dialogStatus = true;
      this.editStatus = true;
    },
    closePreview() {
      this.sel = null;
      this.previewStatus = false;
    },
    showPreviewImage(index, item, id) {
      this.sel = index;
      this.previewThumb = item;
      this.thumbId = id;
      this.previewStatus = true;
    },
    delThumb() {
      this.$api.Snapshot.DestroyImages(this.thumbId).then((res) => {
        this.$message.success("删除成功");
        this.getList();
        this.getImagesList();
      });
    },
    saveSubmit() {
      if (this.loading) {
        return;
      }
      if (!this.form.real_name) {
        this.$message.error("请输入姓名");
        return;
      }
      if (!this.form.id_number) {
        this.$message.error("请输入身份证号");
        return;
      }
      this.loading = true;
      this.$api.Member.ProfileSave(this.form)
        .then((res) => {
          this.loading = false;
          this.$message.success("修改成功");
          this.cancel();
          this.getList();
        })
        .catch((e) => {
          this.loading = false;
          this.cancel();
          this.getList();
          this.$message.error(e.message);
        });
    },
    goDetail(id) {
      this.$router.push({
        name: "coursesVideo",
        query: {
          id: id,
        },
      });
    },
    getList() {
      this.$api.Study.List().then((res) => {
        this.profile = res.data.profile;
        this.courseProgress = res.data.courseProgress;
        this.courses = res.data.courses;
        this.images = res.data.images;
        this.videoProgress = res.data.videoProgress;
        this.videos = res.data.videos;
        this.form.real_name = this.profile.real_name;
        this.form.id_number = this.profile.id_number;
        if (!this.profile.real_name || !this.profile.id_number) {
          this.status = false;
          this.editProfile();
        }
      });
    },
    showImagesDialog(id) {
      if (this.videoProgress[id]) {
        this.duration = this.videoProgress[id].watch_seconds;
      } else {
        this.duration = 0;
      }
      this.cid = id;
      this.type = "vod";
      this.getImagesList();
      this.dialogStatus = true;
      this.picStatus = true;
    },
    getImagesList() {
      this.changeBox = true;
      this.$api.Snapshot.ImagesList({
        resource_id: this.cid,
        resource_type: this.type,
      }).then((res) => {
        this.imagesList = res.data.data;
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
      formData.append("resource_type", this.type);
      this.uploadImgLoading = true;
      this.$api.Snapshot.UploadImages(formData)
        .then((res) => {
          this.uploadImgLoading = false;
          this.$message.success("上传成功");
          this.getList();
          this.getImagesList();
        })
        .catch(() => {
          this.uploadImgLoading = false;
          this.$message.error("上传出现错误");
        });
    },
  },
};
</script>
<style lang='less' scoped>
.content {
  width: 100%;
  min-height: 500px;
  background: #fff;
  .mask {
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    position: fixed;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    .dialog-box {
      width: 500px;
      height: auto;
      background: #ffffff;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      position: relative;
      padding: 30px 0px 0px 0px;
      animation: scaleBig 0.3s;
      .item-tab {
        width: 100%;
        height: 18px;
        font-size: 18px;
        font-weight: 500;
        color: #333333;
        line-height: 18px;
        padding: 0px 30px;
        box-sizing: border-box;
      }
      .btn-close {
        width: 19px;
        height: 19px;
        position: absolute;
        right: 23px;
        top: 22px;
        cursor: pointer;
        &:hover {
          opacity: 0.8;
          animation: rotate360 1s;
        }
      }
      .thumb-box {
        width: 100%;
        margin-top: 50px;
        padding: 0px 12px 0px 30px;
        min-height: 222px;
        max-height: 338px;
        box-sizing: border-box;
        overflow-y: auto;
        display: grid;
        gap: 10px;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        .thumb-item {
          width: 140px;
          height: 106px;
          border: 1px solid #e5e5e5;
          cursor: pointer;
          position: relative;
          &.active {
            opacity: 0.6;
            border: 1px solid #04c877;
          }
          .image-view {
            width: 100%;
            height: 106px;
            background-repeat: no-repeat;
            background-size: contain;
            background-position: center center;
          }
        }
      }
      .info {
        width: 100%;
        margin-top: 50px;
        display: flex;
        flex-direction: column;
        padding: 0px 30px;
        box-sizing: border-box;
        .input-item {
          width: 100%;
          display: flex;
          flex-direction: row;
          margin-bottom: 30px;
          align-items: center;
          label {
            width: 100px;
            height: 18px;
            font-size: 16px;
            font-weight: 400;
            color: #333333;
            line-height: 18px;
          }
          .input {
            width: 330px;
            height: 48px;
            border-radius: 4px;
            border: 1px solid #cccccc;
            outline: none;
            padding-left: 15px;
          }
        }
      }
      .btn-box {
        width: 100%;
        height: 74px;
        background: #ffffff;
        box-shadow: 0px -1px 5px 0px rgba(0, 0, 0, 0.1);
        border-radius: 0px 0px 8px 8px;
        display: flex;
        flex-direction: row-reverse;
        margin-top: 20px;
        padding: 15px 30px;
        box-sizing: border-box;
        .upload-image {
          width: 152px;
          height: 44px;
          background: #f63b46;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 400;
          color: #ffffff;
          position: relative;
          cursor: pointer;
          margin-right: 144px;
          &:hover {
            opacity: 0.8;
          }
          .input-upload {
            width: 152px;
            height: 44px;
            position: absolute;
            top: 0;
            opacity: 0;
          }
        }
        .btn-submit {
          width: 88px;
          height: 44px;
          background: #f63b46;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 400;
          color: #ffffff;
          cursor: pointer;
          &:hover {
            opacity: 0.8;
          }
        }
        .btn-cancel {
          width: 88px;
          height: 44px;
          border-radius: 4px;
          border: 1px solid #cccccc;
          margin-right: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 400;
          color: #666666;
          cursor: pointer;
          &:hover {
            opacity: 0.8;
          }
        }
      }
    }
  }
  .contanier {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    .top-content {
      width: 100%;
      height: 141px;
      border-bottom: 1px solid #eaeaea;
      box-sizing: border-box;
      padding: 30px 0px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .left {
        height: 80px;
        display: flex;
        flex-direction: row;
        align-items: center;
        .avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          overflow: hidden;
          img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
          }
        }
        .nickname {
          height: 16px;
          font-size: 16px;
          font-weight: 400;
          color: #666666;
          line-height: 16px;
          span {
            font-size: 16px;
            font-weight: 500;
            color: #333333;
          }
        }
        .id-number {
          margin-left: 50px;
          height: 16px;
          font-size: 16px;
          font-weight: 400;
          color: #666666;
          line-height: 16px;
          span {
            font-size: 16px;
            font-weight: 500;
            color: #333333;
          }
        }
      }
      .right-button {
        width: 88px;
        height: 44px;
        border-radius: 4px;
        border: 1px solid #cccccc;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 400;
        color: #666666;
        cursor: pointer;
        &:hover {
          opacity: 0.8;
        }
      }
    }
    .item-box {
      width: 100%;
      display: flex;
      flex-direction: column;
      .item {
        width: 100%;
        display: flex;
        flex-direction: column;
        border-bottom: 1px solid #eaeaea;
        .item-content {
          width: 100%;
          height: 225px;
          display: flex;
          flex-direction: row;
          margin-top: 30px;
          margin-bottom: 50px;
          .item-thumb {
            width: 300px;
            height: 225px;
            border-radius: 8px;
            margin-right: 50px;
            img {
              width: 300px;
              height: 225px;
              border-radius: 8px;
            }
          }
          .item-info {
            width: 850px;
            height: 225px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            .item-title {
              width: 100%;
              height: 20px;
              font-size: 20px;
              font-weight: 600;
              color: #333333;
              line-height: 20px;
              margin-top: 50px;
              margin-bottom: 50px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .item-text {
              width: 100%;
              height: 18px;
              font-size: 18px;
              font-weight: 400;
              color: #666666;
              line-height: 18px;
            }
          }
        }
        .videoItem-box {
          width: 100%;
          display: flex;
          flex-direction: column;
          margin-bottom: 50px;
          .videoItem {
            width: 100%;
            height: 20px;
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-bottom: 30px;
            cursor: pointer;
            &:hover {
              .videoItem-tit {
                .tit {
                  color: #f63b46;
                }
              }
              .videoItem-images {
                color: #f63b46;
              }
            }
            &:last-child {
              margin-bottom: 0px;
            }
            .videoItem-tit {
              width: 530px;
              height: 20px;
              display: flex;
              flex-direction: row;
              .play-icon {
                width: 20px;
                height: 20px;
                margin-right: 10px;
              }
              .tit {
                width: 500px;
                height: 20px;
                font-size: 16px;
                font-weight: 400;
                color: #333333;
                line-height: 20px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
            .videoItem-progress {
              width: 300px;
              height: 20px;
              display: flex;
              flex-direction: row;
              font-size: 16px;
              font-weight: 400;
              color: #999999;
              line-height: 20px;
              margin-right: 260px;
              span {
                margin-left: 10px;
                font-weight: 400;
                color: #333333;
              }
            }
            .videoItem-images {
              height: 20px;
              display: flex;
              flex-direction: row;
              font-size: 16px;
              font-weight: 400;
              color: #666666;
              line-height: 20px;
              .pic-icon {
                width: 20px;
                height: 20px;
                margin-right: 10px;
              }
            }
          }
        }
      }
    }
  }
}
</style>