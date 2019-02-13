// 页面数据
export const list = {
  "msg": "success",
  "error_code": 0,
  "data": {
    "activity_data": { // 活动信息
      "activity_rule": '@image', // 新的规则图片
      "rule": '@image', // 活动规则
      "jl_result": '@image', // 锦鲤开奖结果
      "jl_rule": "@image", // 锦鲤规则
      "withdraw_rule": "", // 提现规则
      "start_time": "15439270910", // 活动开始时间，时间戳
      "end_time": "15439870990", // 活动结束时间，时间戳
      "participants": 555 // 参与人数
    },
    "game_list|6": [{ // 游戏信息轮播图
      "video_url": 'http://dl.uu.cc/static/download1/mhhy/1280x720_xiaomi_1.mp4', // 游戏视频
      "qr_code_url": '@image', // 游戏公众号二维码
      "banner_url": '//dl.gamdream.com/activity/galan/chunjie/img/index.jpg', // 游戏介绍图片
      "background_url": '@image', // 游戏详情图片
      "gid": 5
    }],
    "loop_barrage_list|15": [{ // 最新提现用户的信息
      "avatar_url|+1": [
        'https://gimg.gamdream.com/weplaykit/0/image/502/420/052/50224201052e828d3435a2af1e27c9ef.png',
        'https://dl.gamdream.com/sandbox/image/201901/5c4ac21366bee.png?width=132&height=132',
        'https://dl.gamdream.com/sandbox/image/201901/5c4aaba36cc9d.png?width=132&height=132',
        'https://gimg.gamdream.com/weplaykit/0/image/157/956/cc0/157f9566cc0a37245c7eb483a241aef7.png'
      ],
      "nick_name": "@cname",
      "money|+1": [0.61, 1, 1.55, 4.65]
    }],
    "sign_in_status": 0, // 0：未签到，1：已签到
    "people": 45523456
  },
  "ts": 15439870920, // 服务器时间
  "reqId": "5c0a0f37976b6"
}

// 签到
export const sign = {
  "msg": "success",
  "error_code": 0,
  "data": {
    "red_packet": {
      "money": "0"
    },
    "game": {
      "gid": "2",
      "qr_code_url": "@image",
      "name": "地铁跑酷",
      "logo": "@image"
    }
  },
  "reqId": "5c0a0f37976b6"
}
