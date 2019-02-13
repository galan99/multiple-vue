const ToastVue = Vue.extend(require('./toast.vue'))

let removeDom = event => {
  event.target.setAttribute('toast', event.target.getAttribute('toast') * 1 + 1)
  if (event.target.parentNode && event.target.getAttribute('toast') === 2) {
    event.target.parentNode.removeChild(event.target)
  }
}

let Toast = (text) => {
  if (!text) return
  let instance = new ToastVue({
    el: document.createElement('div')
  })
  instance.message = text
  instance.move = 0
  document.body.appendChild(instance.$el)
  instance.$el.setAttribute('toast', 0)
  Vue.nextTick(function () {
    instance.$el.addEventListener('webkitAnimationEnd', removeDom)
  })
}

export default Toast
