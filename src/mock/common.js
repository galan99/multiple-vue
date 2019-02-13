// 公共请求

// 获取最新提现信息的接口
export const winner = {
  "msg": "success",
  "error_code": 0,
  "data|7": [{
    "avatar_url": "@image",
    "money|1-100": 10,
    "nick_name|1-3": "这是名字"
  }],
  "reqId": "5c0a24bd3924d"
}

// 授权信息
export const auth = {
  "msg": "success",
  "error_code": 0,
  "data": {
    "needAuthorize": 0, // 1没授权 0已授权
    "wxUserInfo": {
      "id": "1",
      "app_id": "wxaace6fa4faf53af9",
      "open_id": "o24FxwH_aU6iAe0Zel4yZq5buboI",
      "union_id": "oOxGd0RDvymBIEgQ-i2vTpqNlCNE",
      "nick_name": "TomorrowBetter",
      "gender": "1",
      "country": "中国",
      "province": "广东",
      "city": "深圳",
      "avatar_url": "http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTK7wStABZ7iaCfDNiavLJxPW5T6VyQPk1yicsBia34QldkrGdZ8TWSYIia5XpMKG5FEW4ZGg7UcHbIadhQ/132",
      "phone": "",
      "created": "1540456171",
      "updated": "1540456171",
      "subscribe": "0"
    },
    "authorize_url": '//baidu.com' // 授权跳转地址
  }
}

// 微信分享
export const share = {
  "msg": "success",
  "error_code": 0,
  "data": {
    "shareSignConfig": {
      "appId": "wxaace6fa4faf53af9",
      "nonceStr": "201901251658035c4acf9ba1cb2720",
      "timestamp": 1548406683,
      "url": "//sandbox-twx3.gamdream.com/free-order/home?aid=2&gid=43",
      "signature": "16efda6ba6463c70b91bda293bfaf7af591de8b2",
      "rawString": "jsapi_ticket=kgt8ON7yVITDhtdwci0qeQZ91iKF2BMCtqiRH3iqfysW_Sr1LMzvNPcZYhvCS8M2aQq1v7N0-6q9dQe3RrTQgQ&noncestr=201901251658035c4acf9ba1cb2720&timestamp=1548406683&url=http://sandbox-twx3.gamdream.com/free-order/home?aid=2&gid=43"
    },
    "shareConfig": {
      "id": "25",
      "key": "free_order_common",
      "key_desc": "真朋友两肋插刀，麻烦你帮我助力一下~",
      "icon": "//dl.gamdream.com/weplaykit/0/image/8e3/8e2/637/8e388e28637c827a72bc4f11ddfd0959.png",
      "title": "双12免单来了，邀请3位好友即可免单，还有机会抽9888元的锦鲤",
      "content": "双12免单来了，邀请3位好友即可免单，还有机会抽9888元的锦鲤",
      "share_url": "//sandbox-twx3.gamdream.com/free-order/home?aid=2&gid=43",
      "created": "1544331842",
      "updated": "1544349627"
    }
  },
  "reqId": "5c4acf9ba1d1b",
  "ts": 1548406683
}
