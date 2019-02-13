<template>
  <div class="cmTips">
    <p>{{message}}</p>
  </div>
</template>

<script>
export default {
  name: 'toast',
  data() {
    return {
      message: ''
    }
  }
}
</script>
<style scoped lang="less">
.cmTips {
  position: fixed;
  left: 0;
  right: 0;
  top: 10px;
  z-index: 99;
  padding: 20px 20px 5px;
  text-align: center;
  z-index: 99999;
  color: #fff;
  overflow: hidden;
  display: -webkit-box;
  display: box;
  -webkit-transform: translateY(-100%);
  transform: translateY(-100%);
  -webkit-transition-delay: 1s;
  transition-delay: 1s;
  -webkit-transition-duration: 0.5s;
  transition-duration: 0.5s;
  -webkit-transition-duration: 500ms;
  transition-duration: 500ms;
  -webkit-animation: tips 0.5s linear both, tipsHide 0.5s 3s linear forwards;
  animation: tips 0.5s linear both, tipsHide 0.5s 3s linear forwards;
}
.cmTips p {
  min-width: 150px;
  padding: 5px 20px;
  margin: 0 auto;
  border-radius: 5px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  background: rgba(0, 0, 0, 0.8);
  font-size: 14px;
  line-height: 30px;
}
@-webkit-keyframes tips {
  from {
    -webkit-transform: translateY(-100%);
    opacity: 0;
  }
  to {
    -webkit-transform: translateY(0%);
    opacity: 1;
  }
}
@keyframes tips {
  from {
    -webkit-transform: translateY(-100%);
    opacity: 0;
  }
  to {
    -webkit-transform: translateY(0%);
    opacity: 1;
  }
}
@-webkit-keyframes tipsHide {
  from {
    -webkit-transform: translateY(0%);
    opacity: 1;
  }
  to {
    -webkit-transform: translateY(-100%);
    opacity: 0;
  }
}
@keyframes tipsHide {
  from {
    -webkit-transform: translateY(0%);
    opacity: 1;
  }
  to {
    -webkit-transform: translateY(-100%);
    opacity: 0;
  }
}
</style>