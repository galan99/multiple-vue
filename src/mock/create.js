// 创建免单页面

// 获取用户订单信息的接口
export const list = {
  "msg": "success",
  "error_code": 0,
  "data": {
    "wxUserInfo": {
      "avatar_url": '@image',
      "nick_name": '@cname'
    }, // 0 是别人看的
    "order_money": 10, // 用户正在进行中的免单金额
    "total_money": 0, // 总免单金额
    "help_config|0-8": [ // 配置信息
      {
        "id": "1",
        "act_id": "1",
        "help_num": "3",
        "get_money": "5.42",
        "expire_time": "2000",
        "user_status|0-1": 0 // 1代表已经发起过 0=未发起过

      }
    ],
    "order_list|0-5": [ // 订单列表
      {
        "pay_money": "21.88", // 订单金额
        "updated": "1543927091", // 订单时间，时间戳
        "order_id": "20181204112340227845820206272" // 订单id
      }
    ],
    "start_time": "1544028223",
    "end_time": "1544805839",
    "shop_url": "https://ledou.uu.cc/Mall/index?gid=12"

  },
  "reqId": "5c09e5760d2bb"
}

// 创建免单
export const create = {
  "msg": "success",
  "error_code": 0,
  "data": {
    "share_url": "/on" // 活动的分享地址
  },
  "reqId": "5bf6546a0d054"
}
