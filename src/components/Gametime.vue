<template>
  <div class="gameTime" :class="gameTimeOps.show ? 'show' : ''" @click="close">
      <div class="pop_mc" @click.stop="gameTimeOps.show = true">
        <span class="ico"></span>
        <div class="over">
          <p v-if="gameTimeOps.type==1">亲，活动已结束，下次请早！</p>
          <p v-if="gameTimeOps.type==2">亲，活动待开启中，请耐心等待！</p>
          <span>活动时间:{{gameTimeOps.text}}</span>
        </div>
        <div class="btn" @click.stop="close">确定</div>
      </div>
    </div>
</template>
<script>
export default {
  name: 'gametime',
  props: ['gameTimeOps'],
  methods: {
    close() {
      this.gameTimeOps.show = false
      WeixinJSBridge.call('closeWindow')
    }
  }
}
</script>

<style lang="less" scoped>
@url: '//dl.gamdream.com/activity/galan/chunjie/img/';
.gameTime {
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
    background: #fff;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    box-sizing: border-box;
    line-height: 1;
    width: 5.4rem;
    height: 3.8rem;
    border-radius: 0.1rem;
    text-align: center;
    padding: 0.44rem 0 0;
    .ico {
      display: block;
      width: 0.93rem;
      height: 1rem;
      background: url('@{url}pop_time.png') no-repeat;
      background-size: 100% auto;
      margin: 0 auto;
    }
    .over {
      line-height: 1;
      padding: 0.33rem 0 0.3rem;
      color: #7a7a7a;
      font-size: 0.24rem;
      p {
        font-size: 0.3rem;
        color: #3f3f40;
        margin-bottom: 0.18rem;
      }
    }
    .btn {
      display: block;
      width: 2.35rem;
      line-height: 0.7rem;
      border-radius: 0.7rem;
      margin: 0 auto;
      background: #f11f55;
      color: #fff;
      font-size: 0.3rem;
      text-align: center;
    }
  }
}
</style>
