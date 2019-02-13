// 首页活动页面

// 本人
export const list = {
  "msg": "success",
  "error_code": 0,
  "data": {
    "is_self": 1, // 是不是本人
    "wxUserInfo": {
      "avatar_url": '@image',
      "nick_name": '@cname'
    }, // 用户微信信息
    "is_join": 0, // 是否参加过活动
    "act_info": { // 活动信息
      "rule": "", // 活动规则
      "jl_rule": "", // 锦鲤规则
      "withdraw_rule": "", // 提现规则
      "start_time": "15439270910", // 活动开始时间，时间戳
      "end_time": "15439270990" // 活动结束时间，时间戳
    },
    "activity_list": [ // 用户当前的活动信息
      {
        "unique_id": "fdfdaf", // 用户活动唯一标志
        "act_id": "1", // 活动id
        "help_id": "1", // 免单活动助力配置id
        "money": "10.00", // 活动金额
        "help_log": ['@image'], // 助力日志
        "jl_num": "2535345", // 锦鲤码
        "created": "15439270910", // 活动创建的时间
        "status": "0", // 0=进行中, 1=已完成, -1=过期
        "left_time": 654417, // 活动剩余时间(单位秒)，仅针对正在进行中的活动
        "total_people": "3", // 总需要人数
        "help_people": 1 // 当前人数
      },
      {
        "unique_id": "fdf2daf", // 用户活动唯一标志
        "act_id": "2", // 活动id
        "help_id": "3", // 免单活动助力配置id
        "money": "10.00", // 活动金额
        "help_log": [], // 助力日志
        "jl_num": "2535345", // 锦鲤码
        "created": "15439270910", // 活动创建的时间
        "status": "1", // 0=进行中, 1=已完成, -1=过期
        "left_time": 1544172517, // 活动剩余时间(单位秒)，仅针对正在进行中的活动
        "total_people": "3", // 总需要人数
        "help_people": 0 // 当前人数
      },
      {
        "unique_id": "fdf2daf2", // 用户活动唯一标志
        "act_id": "2", // 活动id
        "help_id": "3", // 免单活动助力配置id
        "money": "10.00", // 活动金额
        "help_log": [], // 助力日志
        "jl_num": "2535345", // 锦鲤码
        "created": "15439270", // 活动创建的时间
        "status": "0", // 0=进行中, 1=已完成, -1=过期
        "left_time": 154417, // 活动剩余时间(单位秒)，仅针对正在进行中的活动
        "total_people": "66", // 总需要人数
        "help_people": 0 // 当前人数
      }
    ],
    "order_money": 10, // 用户正在进行中的免单金额
    "total_money": 0, // 总免单金额
    "join_peoples": "9202", // 参与人数
    "current_time": "15439270950" // 服务器当前时间
  },
  "reqId": "5c076d42e72b4"
}

// 别人
export const other = {
  "msg": "success",
  "error_code": 0,
  "data": {
    "is_self": 0,
    "is_help": 0,
    "current_time": 15439270980, // 服务器当前时间
    "share_user_info": {
      "avatar_url": '@image',
      "nick_name": '@cname'
    }, // 分享者的用户信息
    "act_info": { // 活动信息
      "rule": '@image', // 活动规则
      "jl_rule": "", // 锦鲤规则
      "withdraw_rule": "", // 提现规则
      "start_time": "15439270910", // 活动开始时间，时间戳
      "end_time": "15439271910" // 活动结束时间，时间戳
    },
    "user_activity": {
      "unique_id": "fdfdaf", // 用户活动唯一标志
      "act_id": "1", // 活动id
      "help_id": "1", // 免单活动助力配置id
      "status": "0", // 0=进行中, 1=已完成, -1=过期
      "left_time": 154417, // 活动剩余时间(单位秒)，仅针对正在进行中的活动
      "money": "10.00", // 活动金额
      "created": "1543927091", // 活动创建的时间
      "total_people": "6", // 总需要人数
      "help_people": 2 // 当前人数
    },
    "left_time": 81000, // 剩余时间（单位秒）
    "help_log|2": ['@image'] // 助力日志，用户头像的json
  },
  "reqId": "5c076dc562874"
}

// 帮别人助力
export const help = {
  "msg": "success",
  "error_code": 0,
  "data": {
    "help_pic": "@image", // 助力后用户看到的图片
    "help_pic_jump_url": "fdafdaf", // 助力后用户看到的图片跳转地址
    "total_help_nums": "4", // 助力后的总人数
    "helper_avatar_url": "@image", //
    "money": '55.55', // 获得的红包
    "code": '@image', // 公众号二维码
    "red_packet": {  // 获得的红包
      "money": "0"
    },
    "game": {   // 游戏信息
      "gid": "2",
      "qr_code_url": "@image", // 二维码
      "name": "地铁跑酷", // 游戏名字
      "logo": "@image"
    }

  },
  "reqId": "5bf6546a0d054"
}

// 分享
export const share = {
  "msg": "分享测试",
  "error_code": 1,
  "data": {},
  "reqId": "5bf6546a0d054"
}
