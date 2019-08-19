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
    <vs-row vs-justify="center" class="watchs">
      <vs-col
        v-for="index in (0, 6)"
        :key="index"
        vs-type="flex"
        vs-justify="center"
        vs-align="flex-start"
        vs-w="4.7"
      >
        <StopWatch
          :timer="timers[index]"
          :index="index"
          @saveLocalStorage="saveLocalStorage"
        />
      </vs-col>
      <vs-col
        vs-type="flex"
        vs-justify="center"
        vs-align="flex-start"
        vs-w="4.7"
      >
        <vs-button
          :color="isSomeRunning ? 'warning' : 'primary'"
          class=""
          @click="toggleAllStatus"
          >All {{ isSomeRunning ? "Stop" : "Start" }}</vs-button
        >
      </vs-col>
      <vs-col
        vs-type="flex"
        vs-justify="center"
        vs-align="flex-start"
        vs-w="4.7"
      >
        <vs-button color="danger" class="" @click="clearAll"
          >All Clear</vs-button
        >
      </vs-col>
    </vs-row>
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
    // loop()内で this の値が変更されるので退避
    var vm = this;
    vm.startTime = Math.floor(Date.now() - vm.diffTime || 0);
    // ループ処理
    (function loop() {
      vm.nowTime = Math.floor(Date.now());
      vm.diffTime = vm.nowTime - vm.startTime;
      vm.animateFrame = requestAnimationFrame(loop);
    })();
    vm.isRunning = true;
  }
  restart() {
    // loop()内で this の値が変更されるので退避
    var vm = this;
    // ループ処理
    (function loop() {
      vm.nowTime = Math.floor(Date.now());
      vm.diffTime = vm.nowTime - vm.startTime;
      vm.animateFrame = requestAnimationFrame(loop);
    })();
    vm.isRunning = true;
  }
  stop() {
    this.isRunning = false;
    cancelAnimationFrame(this.animateFrame);
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
    return Math.floor((this.diffTime % 1000) / 10);
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

.vs-col button
  margin 1vw
  height auto
  width 100%
  font-size 6vw

#app .help-btn
  position absolute
  right 10px
</style>
