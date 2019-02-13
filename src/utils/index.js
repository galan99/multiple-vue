import Loading from '@/components/loading'
import Toast from '@/components/toast'

// ajax封装
export const $ajax = (...rest) => {
  function checkStatus(response) {
    if (response.error_code !== 0 && response.msg) {
      if (response.error_code === -2000) {
        // 未登陆或登陆已失效
        Toast('您还未登录！')
      } else {
        Toast(response.msg)
      }
    }
    Loading.close()
    return response
  }

  function checkCode(err) {
    console.error('Cought Error: ', err)
    Toast('请求出错，请稍后再试！')
    Loading.close()
    return err
  }

  return new Promise(function (resolve, reject) {
    Loading.open()
    $.ajax({
      type: rest[0],
      url: rest[1],
      dataType: 'json',
      data: rest[2],
      async: true,
      success: function (data) {
        resolve(checkStatus(data))
      },
      error: function (err) {
        reject(checkCode(err))
      }
    })
  })
}

// 获取url参数
export function getQueryString(name) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  let r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}

// url 跳转
export function toUrl(url, online) {
  if (location.href.indexOf('localhost') !== -1 || location.href.indexOf('192.168') !== -1) {
    location.href = url
  } else {
    location.href = online
  }
}

// 时间戳格式化
export function timeFormat(val, type) {
  let time = ''
  if (val) {
    let date = new Date(val * 1000)
    let year = date.getFullYear()
    let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    // let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()

    if (type === 'dian') {
      // 2018.11.12 00:00
      time = `${year}.${month}.${day} ${h}:${m}`
    } else if (type === 'zhong') {
      // 12月11日00:00
      time = `${month}月${day}日${h}:${m}`
    } else if (type === 'month') {
      // 12月11日
      time = `${month}月${day}日`
    }
  }
  return time
}

// 分享
export function wxShare(gappid, gtimestamp, gnonceStr, gsignature, gshareConfig) {
  wx.config({
    debug: false,
    appId: gappid,
    timestamp: gtimestamp,
    nonceStr: gnonceStr,
    signature: gsignature,
    jsApiList: [
      'checkJsApi',
      'chooseImage',
      'previewImage',
      'uploadImage',
      'downloadImage',
      'onMenuShareTimeline',
      'onMenuShareAppMessage',
      'onMenuShareQQ',
      'onMenuShareWeibo'
    ]
  })
  window.shareData = {
    'imgUrl': gshareConfig.icon || '',
    'timeLineLink': gshareConfig.share_url,
    'sendFriendLink': gshareConfig.share_url,
    'weiboLink': gshareConfig.share_url,
    'tTitle': gshareConfig.title || '',
    'tContent': gshareConfig.content || '',
    'fTitle': gshareConfig.title || '',
    'fContent': gshareConfig.content || '',
    'wTitle': gshareConfig.title || '',
    'wContent': gshareConfig.content || ''
  }
  wx.ready(function () {
    var shareDataLine = {
      title: window.shareData.tTitle,
      link: window.shareData.timeLineLink,
      imgUrl: window.shareData.imgUrl,
      success: function (res) {}
    }
    var shareData = {
      title: window.shareData.fTitle,
      desc: window.shareData.fContent,
      link: window.shareData.sendFriendLink,
      imgUrl: window.shareData.imgUrl,
      success: function (res) {}
    }
    wx.onMenuShareAppMessage(shareData)
    wx.onMenuShareTimeline(shareDataLine)
    wx.onMenuShareQQ(shareData)
    wx.onMenuShareWeibo(shareData)
  })
}
