const LoadingVue = Vue.extend(require('./Loading.vue'))

let instance

export default {
  open() {
    if (!instance) {
      instance = new LoadingVue({
        el: document.createElement('div')
      })
    }
    if (instance.show) return
    document.body.appendChild(instance.$el)
    Vue.nextTick(() => {
      instance.show = true
    })
  },
  close() {
    if (instance) {
      instance.show = false
    }
  }
}
