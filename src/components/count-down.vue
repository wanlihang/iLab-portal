<template>
  <div class="value">
    <template v-if="remainingTime.day === 0">
      {{ remainingTime.hr }}时{{ remainingTime.min }}分{{ remainingTime.sec }}秒
    </template>
    <template v-if="remainingTime.day > 0">
      {{ remainingTime.day }}天{{ remainingTime.hr }}时{{
        remainingTime.min
      }}分{{ remainingTime.sec }}秒
    </template>
  </div>
</template>
<script>
export default {
  props: ["timestamp"],
  data() {
    return {
      remainingTime: {
        all: 0,
        day: 0,
        hr: 0,
        min: 0,
        sec: 0,
      },
      endTime: 0,
    };
  },
  watch: {
    timestamp: function () {
      this.endTime = this.timestamp;
    },
  },
  mounted() {
    this.endTime = this.timestamp;
    this.countdown();
  },
  methods: {
    countdown() {
      const msec = this.endTime;
      if (msec < 0) {
        return;
      }
      let day = parseInt(msec / 60 / 60 / 24);
      let hr = parseInt((msec / 60 / 60) % 24);
      let min = parseInt((msec / 60) % 60);
      let sec = parseInt(msec % 60);
      this.remainingTime.day = day;
      this.remainingTime.hr = hr > 9 ? hr : "0" + hr;
      this.remainingTime.min = min > 9 ? min : "0" + min;
      this.remainingTime.sec = sec > 9 ? sec : "0" + sec;
      const that = this;
      if (min >= 0 && sec >= 0) {
        //倒计时结束关闭订单
        if (day === 0 && min === 0 && sec === 0 && hr === 0) {
          window.location.reload();
          return;
        }
        that.endTime--;
        setTimeout(() => {
          that.countdown();
        }, 1000);
      }
    },
  },
};
</script>
