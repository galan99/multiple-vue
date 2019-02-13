// 红包页面

// 红包列表
export const list = {
  "msg": "success",
  "error_code": 0,
  "data": {
    "list|3-10": [
      {
        "type|+1": [1, 2, 101], // 红包类型，1：助力成功获得，2：签到获得，101：提现扣除
        "money": "50.00", // 提现金额
        "created": "1547816829" // 提现时间
      }
    ],
    "user": {
      "total_money": "100.00", // 总免单金额
      "left_money": "0.8", // 剩余可提现金额
      "red_packet_count": 20, // 红包个数
      "avatar_url": '@image',
      "nick_name": '@cname'
    },
    "withdraw_rule": "@image", // 提现规则
    "current_time": 1547816529, // 服务器时间
    "withdraw_start_time": 1547816229, // 活动开始时间
    "withdraw_end_time": 1547816929 // 结束时间
  },
  "reqId": "5c0a0e53d6b84"
}

// 提现接口
export const getMoney = {
  "msg": "success",
  "error_code": 0,
  "reqId": "5bf6546a0d054"
}
