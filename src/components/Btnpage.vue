<template>
  <div>
    <a href="javascript:;" class="goCar" v-if="btnoptions.showCar" @click="goCar"></a>
    <a href="javascript:;" class="goHelp" v-if="btnoptions.showHelp" @click="goIndex"></a>
  </div>
</template>

<script>
import { getQueryString } from '@/utils'
const aid = getQueryString('aid')
const gid = getQueryString('gid')

function defaultEvent(e) {
  e.preventDefault()
}
export default {
  name: 'pagebtn',
  props: {
    btnoptions: {
      type: Object,
      default: () => ({
        showCar: true,
        showHelp: true
      })
    }
  },
  data() {
    return {}
  },
  mounted() {
    var goCar = document.querySelector('.goCar')
    var goHelp = document.querySelector('.goHelp')
    if (goCar) {
      move(goCar)
    }
    if (goHelp) {
      move(goHelp)
    }

    function move(block) {
      var oW
      var oH
      var maxWidth = document.documentElement.clientWidth - block.offsetWidth
      var maxHeight = document.documentElement.clientHeight - block.offsetHeight
      block.addEventListener(
        'touchstart',
        function(e) {
          var touches = e.touches[0]
          oW = touches.clientX - block.offsetLeft
          oH = touches.clientY - block.offsetTop
          document.addEventListener('touchmove', defaultEvent, false)
        },
        false
      )

      block.addEventListener(
        'touchmove',
        function(e) {
          var touches = e.touches[0]
          var oLeft = touches.clientX - oW
          var oTop = touches.clientY - oH
          oLeft = oLeft < 0 ? 0 : oLeft
          oLeft = oLeft > maxWidth ? maxWidth : oLeft
          oTop = oTop < 0 ? 0 : oTop
          oTop = oTop > maxHeight ? maxHeight : oTop
          block.style.left = oLeft + 'px'
          block.style.top = oTop + 'px'
          e.preventDefault()
        },
        false
      )

      block.addEventListener(
        'touchend',
        function() {
          document.removeEventListener('touchmove', defaultEvent, false)
        },
        false
      )
    }
  },
  methods: {
    goCar() {
      window.location.href =
        '/free-order/create-activity?aid=' + aid + '&gid=' + gid
    },
    goIndex() {
      window.location.href = '/free-order/index?aid=' + aid + '&gid=' + gid
    }
  }
}
</script>

<style  lang="less" scoped>
@url: '//dl2.gxpan.cn/gsd/shuang12/';
.goCar,
.goHelp {
  position: fixed;
  z-index: 88;
  right: 0.2rem;
  bottom: 0.5rem;
  width: 1.28rem;
  height: 1.28rem;
  background: url('@{url}icon-car.png') no-repeat;
  background-size: 100% auto;
  touch-action: none;
}
.goHelp {
  background-image: url('@{url}icon-help.png');
}
</style>
