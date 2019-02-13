<template>
  <div class="toprules">
    <a href="javascript:;" class="rule" @click="show = true" :style="options.ruleStyle">{{text}}</a>
    <div class="pop_rule" :class="show ? 'show' : ''" @click="show = false">
      <div class="pop_mc" @click.stop="show = true">
        <div class="close" @click.stop="show = false"></div>
        <img class="pic" :src="options.picUrl"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'rlue',
  props: {
    options: {
      type: Object,
      default: () => ({
        ruleStyle: {},
        picUrl: ''
      })
    },
    text: {
      default: '活动规则'
    }
  },
  data() {
    return {
      show: false
    }
  }
}
</script>
<style  lang="less" scoped>
.toprules {
  .rule {
    position: absolute;
    right:.17rem;
    top:.22rem;
    width:1.36rem;
    line-height: .54rem;
    border:1px solid rgba(244,229,122,1);
    border-radius:.27rem;
    text-align: center;
    background: #FF2E50;
    font-size:.24rem;
    color:#FBF6D1;
    z-index: 2;
  }
  .pop_rule {
    -webkit-transform: scale(0);
    transform: scale(0);
    transition: all 0.3s ease-in;
    background: rgba(0, 0, 0, 0);
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 100;
    &.show {
      -webkit-transform: scale(1);
      transform: scale(1);
      background: rgba(0, 0, 0, 0.8);
    }
    .pop_mc {
      position: absolute;
      width: 6.8rem;
      left: 50%;
      top: 50%;
      -webkit-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
      img {
        width: 100%;
      }
      .close {
        position: absolute;
        right: 0;
        top: 0;
        width: 0.8rem;
        height: 0.8rem;
      }
    }
  }
}
</style>
