<template>
  <div class="backTop" v-show="backTopStatus" @click="goBackTop">
    <img src="../assets/img/commen/icon-backtop.png" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      backTopStatus:false,
      bodyHeight:document.body.clientHeight,
    };
  },
  watch:{
     'document.body.clientHeight'(val) {
       this.$nextTick(()=>{
          this.bodyHeight=val;
          console.log(this.bodyHeight);
       })
    },
  },
  mounted(){
     if(this.bodyHeight>200){
      this.backTopStatus=true;
    }
  },
  methods: {
    goBackTop() {
      window.scrollTo(0, 0);
    },
  }
}
</script>
<style lang="less" scoped>
.backTop {
  position: fixed;
  right: 17px;
  bottom: 150px;
  z-index: 30;
  cursor: pointer;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  &:hover {
    opacity: 0.8;
  }
  img {
    width: 64px;
    height: 64px;
    border-radius: 50%;
  }
}
</style>
