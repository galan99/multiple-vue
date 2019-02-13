<template>
    <p v-html="time"></p>
</template>

<script>
export default {
  name: 'timedown',
  props: ['endTime', 'type'],
  data() {
    return {
      time: ''
    }
  },
  mounted() {
    this.timeGo()
  },
  methods: {
    timeGo() {
      let _this = this
      let endtime = _this.endTime * 1e3 + new Date().getTime()
      let timer = null
      let timeHtml = ''

      timer = setInterval(function() {
        let t = (endtime - new Date().getTime()) / 1e3
        let d = Math.floor(t / 60 / 60 / 24)
        let h = Math.floor((t / 60 / 60) % 24)
        let m = Math.floor((t / 60) % 60)
        let s = Math.floor(t % 60)

        if (t <= 0) {
          s = 0
          d = 0
          h = 0
          m = 0
          clearInterval(timer)
          _this.$emit('timeEnd', '倒计时结束')
        }
        if (_this.type === 'help') {
          timeHtml = `<span>${_this.addZero(
            h + d * 24
          )}</span>小时<span>${_this.addZero(m)}</span>分<span>${_this.addZero(
            s
          )}</span>秒过期`
        } else if (_this.type === 'jinli') {
          timeHtml = `<span>${_this.addZero(d)}</span>天<span>${_this.addZero(h)}</span>小时<span>${_this.addZero(m)}</span>分<span>${_this.addZero(s)}</span>秒开奖`
        } else {
          timeHtml = `<p>${_this.addZero(h + d * 24)}:${_this.addZero(
            m
          )}:${_this.addZero(s)}后结束</p>`
        }
        _this.time = timeHtml
      }, 1e3 / 2)
    },
    addZero(num) {
      return num < 10 ? '0' + num : num
    }
  }
}
</script>
<style  lang="less" scoped>
</style>