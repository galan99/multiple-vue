(function () {
  var LoadScript = {
    init: function () {
      if (this.getQueryString('vconsole') === 'true') {
        this.creatScript()
      }
    },
    getQueryString: function (name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
      var r = window.location.search.substr(1).match(reg)
      if (r != null) return unescape(r[2])
      return null
    },
    creatScript: function () {
      var s = document.createElement('script')
      s.type = 'text/javascript'
      s.src = '//dl.gamdream.com/activity/lib/vconsole.js'
      var t = document.getElementsByTagName('script')[0]
      t.parentNode.insertBefore(s, t)
    }
  }
  LoadScript.init()
})()
