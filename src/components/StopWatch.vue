<template>
  <div class="adjust-box box-1x1" @click="clickTimer">
    <vs-card class="cardx circle" :style="statusBgcolor" ref="circle">
      <div slot="header">
        <h2 :style="{ color: colors[index] }">{{ index | repIndex }}</h2>
      </div>
      <div slot="media">
        <h1>
          {{ timer.hours }}-{{ timer.minutes | zeroPad }}-{{
            timer.seconds | zeroPad
          }}-{{ timer.milliSeconds }}
        </h1>
      </div>
    </vs-card>
  </div>
</template>

<script>
export default {
  name: "StopWatch",
  props: ["timer", "index"],
  data() {
    return {
      colors: [
        "white",
        "black",
        "#EE7700",
        "green",
        "#e50011",
        "#0064B3",
        "#5F1885"
      ]
    };
  },
  methods: {
    clickTimer: function() {
      if (this.timer.isRunning) this.timer.stop();
      else this.timer.start();

      this.$emit("saveLocalStorage");
    }
  },
  computed: {
    indexColorStyle: function(index) {
      return { colors: this.colors[index] };
    },
    statusBgcolor: function() {
      if (this.timer.isRunning)
        return {
          background: "linear-gradient(#FFFFFF,#a8c9ffDD, #1f74ffDD ) "
        };
      else if (this.timer.diffTime > 1)
        return { background: "linear-gradient(#FFFFFF,#FFF2B8DD,#FCC800DD)" };
      else return { background: "#d3d3d3e6" };
    },
    strokeColor: function() {
      if (this.timer.isRunning) return "navy" || "#1f74ffFF";
      else if (this.timer.diffTime > 1) return "darkorange" || "#FCB000FF";
      else return "#ffffff00";
    },
    timerBarPath: function() {
      // widthが60の意味は特にない。viewBoxとstrokeの値に合わせてwidthとoffsetを弄ればいいと思う。
      // シンプルなアプリだからいいけど、微妙に計算量多い気がする。あとこの機能いらなくね。
      let width = 60;
      let offset = 2;
      let x1 = width / 2;
      let y1 = offset / 2;
      let r = (width - offset) / 2;
      let angle = (this.timer.seconds + this.timer.milliSeconds * 0.01) * 6;
      let rad = (angle / 180) * Math.PI;
      let x2 = r * Math.sin(rad);
      let y2 = r * (1 - Math.cos(rad));
      // return `M 90,0 a 90 90 1 0 1 0,0` 0
      // return `M 90,0 a 90 90 0 0 1 90,90` 90
      // return `M 90,0 a 90 90 0 0 1 0,180` 180
      // return `M 90,0 a 90 90 1 0 1 -90,90` 270
      return `M ${x1} ${y1} a ${r} ${r} 0 ${angle > 180 ? 1 : 0} 1 ${x2} ${y2}`;
    }
  },
  filters: {
    // ゼロ埋めフィルタ 引数に桁数を入力する
    // ※ String.prototype.padStart() は IEじゃ使えない
    zeroPad: function(value, num) {
      num = typeof num !== "undefined" ? num : 2;
      return value.toString().padStart(num, "0");
    },
    // 時計がZ順で配置されるので、インデックスを調整
    // flexboxの問題だけど、もう面倒だからいいかな
    repIndex: function(index) {
      return [0, 1, 4, 2, 5, 3, 6][index];
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
.adjust-box
  margin 5px
  position relative
  width 100%
  height auto
  // background skyblue

.timer-bar
  z-index 1
  position absolute
  margin-top -100%
  height 100%

.box-1x1:before
  content ""
  display block
  padding-top 100%

.cardx.circle
  position absolute
  top 0
  left  0
  width 100%
  height 100%
  border-radius 50%
  background: radial-gradient(#FFEDBD,#FFD35C);

h1
  text-align center
  vertical-align middle
  font-size 6vw
  font-family 'segment7standard'
  transform scale(1,2)
  @media screen and (max-width: 1024px) and (orientation: portrait) { line-height 36vw }
  @media screen and (max-width: 480px) { line-height 28vw }

h2
  text-align left
  @media screen and (max-width: 1024px) and (orientation: portrait) { padding-left 16.5vw }
  @media screen and (max-width: 480px) { padding-left 14.5vw }
  padding-left 2rem
  font-size 6vw
  position absolute
ul
  list-style-type none
  padding 0

li
  display inline-block
  margin 0 10px

a
  color #42b983
</style>
