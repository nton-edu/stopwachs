<template>
  <div id="app">
    <vs-button
      class="help-btn"
      color="success"
      type="filled"
      icon="help"
      @click="activePrompt = true"
    />
    <vs-prompt
      :active.sync="activePrompt"
      title="ホームに追加する方法"
      buttons-hidden="true"
      @close="activePrompt = false"
    >
      <div>
        <img src="./assets/howto.gif" /> <img src="./assets/qrcode.png" />
        <vs-button
          color="primary"
          type="filled"
          target
          :href="{ url: 'https://github.com/nton-edu/stopwachs' }"
          >Github[HP]</vs-button
        >
      </div>
    </vs-prompt>
    <div class="fb-container">
      <div class="fb-item-watchs">
        <div class="fb-container fb-item-watch">
          <div v-for="index in (0, 6)" :key="index" class="fb-watch-col">
        <StopWatch
          :timer="timers[index]"
          :index="index"
          @saveLocalStorage="saveLocalStorage"
        />
          </div>
        </div>
      </div>
      <div class="fb-item-btns">
        <div class="fb-container fb-item-control-btn">
        <vs-button
          :color="isSomeRunning ? 'warning' : 'primary'"
          @click="toggleAllStatus"
            class="control-timer-btn"
          >All {{ isSomeRunning ? "Stop" : "Start" }}</vs-button
        >
          <vs-button color="danger" @click="clearAll" class="control-timer-btn"
          >All Clear</vs-button
        >
  </div>
      </div>
    </div>
  </div>
</template>

<script>
import StopWatch from "./components/StopWatch.vue";

class Timer {
  constructor(diffTime = 0, startTime = 0, isRunning = false) {
    this.nowTime = 0;
    this.diffTime = diffTime;
    this.startTime = startTime;
    this.animateFrame = 0;
    if (isRunning) {
      //LocalStorageから呼ばれた時に、9時間回ってるならクリアしちゃおう的な
      if ((Date.now() - this.startTime) / 1000 / 60 / 60 >= 9) {
        this.clear();
        return;
      }
      this.restart();
    } else {
      this.isRunning = false;
    }
  }
  set setSubtractStartTime(time) {
    time = typeof time !== "undefined" ? time : 0;
    this.startTime = Math.floor(Date.now() - time);
  }
  start() {
    var vm = this;
    vm.startTime = Math.floor(Date.now() - vm.diffTime || 0);
    vm.isRunning = true;
  }
  restart() {
    var vm = this;
    vm.isRunning = true;
  }
  stop() {
    this.isRunning = false;
  }
  clear() {
    this.stop();
    this.startTime = 0;
    this.diffTime = 0;
    this.animateFrame = 0;
    this.isRunning = false;
  }
  get hours() {
    return Math.floor(this.diffTime / 1000 / 60 / 60);
  }
  // 分数を計算 (60分になったら0分に戻る)
  get minutes() {
    return Math.floor(this.diffTime / 1000 / 60) % 60;
  }
  // 秒数を計算 (60秒になったら0秒に戻る)
  get seconds() {
    return Math.floor(this.diffTime / 1000) % 60;
  }
  // ミリ数を計算 (1000ミリ秒になったら0ミリ秒に戻る)
  get milliSeconds() {
    return Math.floor((this.diffTime % 1000) / 100);
  }
}

export default {
  name: "app",
  components: {
    StopWatch
  },
  data() {
    return {
      timers: [],
      activePrompt: false
    };
  },
  methods: {
    saveLocalStorage: function() {
      let obj = this.timers.reduce((o, c, i) => {
        return c
          ? Object.assign(
              o,
              {
                [i]: {
                  diffTime: c.diffTime,
                  isRunning: c.isRunning,
                  startTime: c.startTime
                }
              },
              {}
            )
          : o;
      }, {});
      localStorage.setItem("timers", JSON.stringify(obj));
    },
    clearAll: function() {
      this.timers.forEach(timer => {
        timer.clear();
      });
      this.saveLocalStorage();
    },
    toggleAllStatus: function() {
      let isSomeRunning = this.isSomeRunning;
      this.timers.forEach(timer => {
        if (isSomeRunning) {
          timer.stop();
        } else {
          timer.start();
        }
      });
      this.saveLocalStorage();
    }
  },
  computed: {
    isSomeRunning: function() {
      return this.timers.some(timer => {
        return timer.isRunning;
      });
    }
  },
  head() {
    return {
      title: this.title,
      meta: [
        {
          hid: "description",
          name: "description",
          content: "My custom description"
        }
      ]
    };
  },
  created() {
    let item = localStorage.getItem("timers");
    if (item) {
      let obj = JSON.parse(localStorage.getItem("timers"));
      [...Array(7)].forEach((_, i) => {
        this.timers.splice(
          i,
          0,
          new Timer(obj[i].diffTime, obj[i].startTime, obj[i].isRunning)
        );
      });
    } else {
      [...Array(7)].forEach((_, i) => {
        this.timers.splice(i, 0, new Timer());
      });
    }
    setInterval(() => {
      this.timers.forEach(timer => {
        let nowTime = Math.floor(Date.now());
        if (timer.isRunning) timer.diffTime = nowTime - timer.startTime;
      });
    }, 100);
  }
};
</script>

<style lang="stylus">
body
  background-color black
  background-image url("./assets/brushed-alum.png")

#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
  margin-top 10px

#app .help-btn
  position absolute
  right 10px

.fb-container
  display flex
  flex-wrap wrap
  justify-content space-around
  align-items center
.fb-item-watchs
  @media screen and (min-width:0px) {
    flex-direction column
    max-height 90vh
  }
  @media screen and (min-width:1024px) {
    flex-direction row
    max-width 80vw
    height 100%
  }
.fb-item-btns
  @media screen and (min-width:0px) {
    width 100vw
    height 10vh
  }
  @media screen and (min-width:1024px) {
    width 20vw
    height 100vh
  }


.fb-item-watch
  @media screen and (min-width:0px) {
    width 100vw
    height 90vh
  }
  @media screen and (min-width:1024px) {
    width 80vw
    height 100vh
  }

.fb-watch-col
  @media screen and (min-width:0px) {
    width 25vh
  }
  @media screen and (min-width:768px) and ( max-width:1024px) {
    width 28vh
  }
  @media screen and (min-width:1024px) {
    width 25vw
  }

.fb-item-control-btn
  align-items stretch
  @media screen and (min-width:480px) {
    flex-direction row
  }
  @media screen and (min-width:1024px) {
    flex-direction row
    padding-top 5.5vh
  }

.control-timer-btn
  width 35vw
  font-size 3rem
  @media screen and (min-width:1024px) {
    width 18vw
    height 50vh
  }

</style>
