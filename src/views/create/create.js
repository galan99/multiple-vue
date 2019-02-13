import '@/assets/css/reset.less'
import index from './create.vue'
import '@/assets/js/vconsole.js'

if (process.env.mock) {
  require('@/mock')
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(index)
})

