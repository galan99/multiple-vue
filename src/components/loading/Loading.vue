<template>
  <div class="loading-wrap" v-if="show">
      <svg class="loading" width="80px" height="80px" viewBox="0 0 44 44">
          <circle class="path" fill="none" stroke-width="4" stroke-linecap="round" cx="22" cy="22" r="20"></circle>
      </svg>
  </div>
</template>

<script>
export default {
  name: 'loading',
  data() {
    return {
      show: false
    }
  }
}
</script>
<style scoped>
.loading-wrap {
  text-align: center;
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 77;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  align-items: center;
}
.loading {
  animation: rotator 1.4s linear infinite;
}
@keyframes rotator {
  0% {
    transform: scale(0.5) rotate(0deg);
  }
  100% {
    transform: scale(0.5) rotate(270deg);
  }
}
.loading .path {
  stroke: #fff;
  stroke-dasharray: 126;
  stroke-dashoffset: 0;
  transform-origin: center;
  animation: dash 1.4s ease-in-out infinite;
}
@keyframes dash {
  0% {
    stroke-dashoffset: 126;
  }
  50% {
    stroke-dashoffset: 63;
    transform: rotate(135deg);
  }
  100% {
    stroke-dashoffset: 126;
    transform: rotate(450deg);
  }
}
</style>