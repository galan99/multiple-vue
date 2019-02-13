<template>
  <div id="content" :style="{minHeight:height+'px'}" :class="pageInfo.is_self == 0?'otherbody':''" v-if="loadData">
    <!--已参加活动-->
    <Users :list="winList"></Users>
    <div class="head" v-if="pageInfo.is_self == 1">
      <div class="item" @click="goCreate">活动首页</div>
      <div class="item active">红包进行中</div>
    </div>
    <div class="zhuli" :style="{minHeight:height+'px'}">
      <!--有免单的-->
      <div class="haveGoosd" v-if="!showNoGoods">
        <div class="main">
          <div class="otherList">
            <!--别人查看-->
            <div class="ouser" v-if="pageInfo.is_self == 0">
              <img class="pic" :src="pageInfo.share_user_info.avatar_url"/>
              <span class="name">{{pageInfo.share_user_info.nick_name}}</span>
            </div>
            <!--自己查看-->
            <div class="ouser" v-if="pageInfo.is_self == 1 && pageInfo.wxUserInfo.avatar_url">
              <img class="pic" :src="pageInfo.wxUserInfo.avatar_url"/>
              <span class="name">{{pageInfo.wxUserInfo.nick_name}}</span>
            </div>
            <p class="txt">“我在参与新春免单活动，快来帮帮我~”</p>
          </div>
          <div class="redbox">
            <div class="time">
              <Timedown @timeEnd="timeEnd" v-if="nowActivity.left_time > 0" :endTime="nowActivity.left_time" :type="'help'"></Timedown>
              <template v-if="nowActivity.left_time <= 0 && nowActivity.status == 1">
                <span>00</span>小时<span>00</span>分<span>00</span>秒免单成功
              </template>
              <template v-if="nowActivity.left_time <= 0 && nowActivity.status == -1">
                <span>00</span>小时<span>00</span>分<span>00</span>秒免单过期
              </template>
            </div>
            <div class="text">
              <em>{{nowActivity.money}}</em>元
            </div>
          </div>
          <div class="progress">
            <div class="p_text" :style="{left:nowActivity.scale< 20 ? nowActivity.scale/100 * 1.6 : nowActivity.scale/100 * 3.2 + 'rem'}" v-if="nowActivity.status == 0">还差{{nowActivity.need_people}}人即可免单</div>
            <div class="success" v-if="nowActivity.status == 1">已免单成功！</div>
            <div class="success" style="color:#999" v-if="nowActivity.status == -1">您来晚了，该订单已结束</div>
            <div class="bar"><span :style="{width:nowActivity.scale + '%'}"></span></div>
          </div>
          <div class="helplist">
            <div class="btns">
              <template v-if="pageInfo.is_self == 0">
                <template v-if="pageInfo.is_help == 0 && nowActivity.status == 0">
                  <a href="javascript:;" @click="help">帮他一下</a>
                </template>
                <template v-else>
                  <a href="javascript:;" @click="goIndex">我也要免单</a>
                </template>
              </template>
              <template v-if="pageInfo.is_self == 1">
                <a href="javascript:;" class="animationBtn" v-if="nowActivity.status == 0" @click="shareFn">邀请好友助力</a>
                <a href="javascript:;" v-if="nowActivity.status == -1" @click="goCreate">继续发起免单</a>
                <div class="success" v-if="nowActivity.status == 1">
                  <a href="javascript:;" class="on" @click="goCreate">继续免单</a>
                  <a href="javascript:;" class="share" @click="shareFn">炫耀一下</a>
                </div>
              </template>
            </div>
            <div class="tip" v-if="2==1">
              <span>邀请未参与活动的好友才算成功</span>
            </div>
            <div class="text">
              <span>助力记录</span>
              <span v-show="helpList.length >= 8" class="more" @click="showHistory = true">查看更多>></span>
            </div>
            <ul class="users">
              <li v-for="(item, index) in showhelpList" :key="index" v-if="index < 9" @click="shareFn">
                <img :src="item" v-if="item"/>
              </li>
            </ul>
          </div>
        </div>

        <div class="stitle" v-if="pageInfo.is_self == 1 && orderList.length"><img src="//dl.gamdream.com/activity/galan/chunjie/img/on.png"/></div>

        <!--免单列表-->
        <div class="foot" v-if="pageInfo.is_self == 1 && orderList.length">
          <ul class="onlist">
            <li v-for="(item,index) in orderList" :key="index" @click="lookMore(item)">
              <img src="//dl.gamdream.com/activity/galan/chunjie/img/red.png"/>
              <div class="midd">
                <p>免单金额：<span>{{item.money}}元</span></p>
                <div v-if="item.status == 0">还差<span>{{item | plus}}人</span>即可免单</div>
                <div v-if="item.status == -1">免单失败</div>
                <div v-if="item.status == 1"><span>免单成功</span></div>
              </div>
              <div class="time">
                <div class="time_box" v-if="item.status == 0" @click="lookMore(item)">
                  <a href="javascript:;">查看免单</a>
                  <Timedown v-if="item.left_time > 0" @timeEnd="itemtimeEnd(index)" :endTime="item.left_time"></Timedown>
                </div>
                <div class="time_box" v-if="item.status != 0" @click.stop="goCreate">
                  <a href="javascript:;">继续免单</a>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!--没有免单的-->
      <div class="noGoods" v-if="showNoGoods">
        <img class="pic" src="//dl.gamdream.com/activity/galan/chunjie/img/order_1.png"/>
        <h3>邀请3个好友就能获得免单红包</h3>
        <p>仅限{{gameTimeOptions.text}}的订单！</p>
        <a href="javascript:;" class="mall" title="创建免单" @click="goCreate">发起免单红包</a>
      </div>
    </div>

    <!--助力获取红包-->
    <div class="pops mall_pop" :class="show?'show':''" @click="show = false" v-if="followInfo.game">
      <div class="pop_mc">
        <div class="user">
          <img :src="authInfo.avatar_url" alt="">
          <p>谢谢你帮我助力</p>
          <span>{{followInfo.red_packet.money > 0 ? '送你一个新春红包' : ''}}</span>
        </div>
        <template v-if="followInfo.red_packet.money > 0">
          <p class="tit">恭喜发财，大吉大利</p>
          <a href="javascript:;" class="open_one" @click.stop="handleOpen"></a>
        </template>
        <template v-else>
          <p class="tit">来晚了，红包派完了！</p>
          <a href="javascript:;" class="look_one" @click.stop="show = false">确认</a>
        </template>
      </div>
    </div>

    <!--助力打开红包-->
    <div class="pops open_red" :class="openRed?'show':''" @click="openRed = false" v-if="followInfo.game">
      <div class="pop_mc">
        <div class="red_bg">
          <div class="user">
            <img :src="authInfo.avatar_url" alt="">
            <p>谢谢你帮我助力</p>
            <span>送你一个新春红包</span>
          </div>
          <p class="tit">￥<span>{{followInfo.red_packet.money}}</span></p>
          <a href="javascript:;" class="open_one" @click.stop="handleCode">关注公众号提现</a>
        </div>
      </div>
    </div>

    <!--关注游戏-->
    <div class="pops pop_game" :class="openCode?'show':''" @click="openCode = false" v-if="followInfo.game">
      <div class="pop_mc" @click.stop="openCode = true">
        <img :src="followInfo.game.qr_code_url" alt="">
      </div>
    </div>

    <!--助力者记录-->
    <div class="pops user_pop" :class="showHistory?'show':''" @click="showHistory = false">
      <div class="pop_mc" @click.stop="showHistory = true">
        <div class="smclose" @click.stop="showHistory = false"></div>
        <div class="tits">助力记录</div>
        <ul class="users">
          <li v-for="(item, index) in helpList" :key="index">
            <img :src="item" v-if="item"/>
          </li>
        </ul>
      </div>
    </div>
    <!--分享-->
    <div class="pops share_pop" :class="showShare?'show':''" @click="showShare = false">
      <img src="//dl.gamdream.com/activity/galan/chunjie/img/shareTop.png"/>
    </div>
    <!--获取锦鲤码-->
    <div class="pops jinli_pop" :class="showCode?'show':''" @click="showCode = false">
      <div class="pop_mc">
        <div class="code_mt">
          <img src="//dl.gamdream.com/activity/galan/chunjie/img/jtit2.png" alt="">
        </div>
        <div class="code_tit">获得1个锦鲤抽奖码</div>
        <div class="code_mc">
          <p v-if="nowActivity">{{nowActivity.jl_num}}</p>
        </div>
        <div class="code_bot">凭抽奖码参与抽奖哦~</div>
        <a class="code_btnsure" @click="popCloseFun()"></a>
        <div class="code_line"></div>
      </div>
    </div>
    <GameTime :gameTimeOps="gameTimeOptions"></GameTime>
  </div>
</template>

<script>
import Users from '@/components/Users.vue' // 滚动的获奖者组件
import Timedown from '@/components/Timedown.vue' // 倒计时组件
import GameTime from '@/components/Gametime.vue' // 活动时间规则组件
import { $ajax, getQueryString, timeFormat, wxShare, toUrl } from '@/utils'

const aid = getQueryString('aid')
const gid = getQueryString('gid')

export default {
  name: 'help',
  components: {
    Users,
    Timedown,
    GameTime
  },
  data() {
    return {
      loadData: false, // 加载数据状态
      show: false, // 显示红包弹窗
      openRed: false, // 领取红包弹窗
      openCode: false, // 关注公众号弹窗
      showHistory: false, // 显示帮助者弹窗
      showShare: false, // 显示分享弹窗
      showCode: false, // 显示锦鲤码者弹窗
      height: document.documentElement.clientHeight,
      ruleOptions: {
        picUrl: '' // 规则图片
      },
      gameTimeOptions: {
        show: false, // 显示活动过期弹窗
        type: -1, // 1已结束 2未开始
        text: '' // 时间
      },
      wxAuthor: '', // 授权信息
      pageInfo: {}, // 页面信息
      mall: {}, // 优惠券信息
      winList: [], // 最新提现者
      helpList: [], // 帮助者列表
      showhelpList: ['', '', '', '', '', '', '', '', ''], // 显示的帮助者列表
      showNoGoods: false, // 显示没有活动
      nowActivity: {}, // 当前活动信息
      allActivity: [], // 所有活动信息
      orderList: [], // 订单里列表
      authInfo: {}, // 微信信息
      followInfo: {} // 助力后的信息
    }
  },
  created() {
    this.getData()
  },
  filters: {
    plus: function(item) {
      return item.total_people - item.help_people
    }
  },
  watch: {
    helpList: function(newVal) {
      let that = this
      that.helpList.forEach((el, i) => {
        if (el && i < 9) {
          that.showhelpList.splice(i, 1, el)
        }
      })
    }
  },
  methods: {
    shareFn() {
      window._hmt.push([
        '_trackEvent',
        '活动分享次数',
        'click',
        '新春免单活动',
        1
      ])
      this.showShare = true
    },
    popCloseFun() {
      this.showCode = false
    },
    async getData() {
      window._hmt.push([
        '_trackEvent',
        '页面的访问次数',
        'click',
        '新春免单活动',
        1
      ])
      let that = this
      let shareparams = {}
      if (getQueryString('share_union_id')) {
        shareparams.share_union_id = getQueryString('share_union_id')
        shareparams.user_activity_unique_id = getQueryString(
          'user_activity_unique_id'
        )
      }
      if (aid) {
        shareparams.aid = aid
        shareparams.gid = gid
      }
      const res = await $ajax(
        'get',
        '/free-order/query-authorization',
        shareparams
      )

      if (res.error_code === 0) {
        if (res.data.needAuthorize * 1 === 1) {
          that.wxAuthor = res.data.authorize_url
          window.location.href = res.data.authorize_url
          return false
        }
        this.authInfo = res.data.wxUserInfo
      }

      let params = {
        aid: aid,
        gid: gid
      }

      if (getQueryString('share_union_id')) {
        params.share_union_id = getQueryString('share_union_id')
        params.user_activity_unique_id = getQueryString(
          'user_activity_unique_id'
        )
      }
      if (getQueryString('unique_id')) {
        params.unique_id = getQueryString('unique_id')
      }
      const data = await $ajax('post', '/free-order/index-for-ajax', params)
      console.log(data)
      if (data.error_code === 0) {
        let {
          act_info,
          is_self,
          is_join,
          activity_list,
          help_log,
          current_time
        } = data.data

        that.pageInfo = data.data
        that.gameTimeOptions.text =
          timeFormat(act_info.start_time, 'month') +
          '-' +
          timeFormat(act_info.end_time, 'month')
        that.ruleOptions.picUrl = act_info.rule

        // 活动时间
        if (current_time < act_info.start_time) {
          that.gameTimeOptions.type = 2
          that.gameTimeOptions.show = true
        }
        if (current_time > act_info.end_time) {
          that.gameTimeOptions.type = 1
          that.gameTimeOptions.show = true
        }

        // 本人
        if (is_self * 1 === 1) {
          // 没参与过活动
          if (is_join * 1 === 0) {
            that.showNoGoods = true
          } else {
            if (activity_list) {
              that.allActivity = JSON.parse(JSON.stringify(activity_list))
              if (!activity_list.length) {
                that.showNoGoods = true
              } else {
                that.nowActivity = activity_list[0]
                that.orderList = JSON.parse(JSON.stringify(activity_list)).splice(1)
              }
            }
            // 缓存锦鲤码弹窗
            if (that.nowActivity) {
              if (that.nowActivity.jl_num && !localStorage.getItem(that.nowActivity.unique_id)) {
                that.showCode = true
                localStorage.setItem(that.nowActivity.unique_id, that.nowActivity.jl_num)
              }
              if (that.nowActivity.help_log) {
                that.helpList = that.nowActivity.help_log
              }
            }
          }
        } else {
          // 别人查看
          that.nowActivity = data.data.user_activity
          if (help_log) {
            that.helpList = help_log
          }
        }

        if (that.helpList) {
          if (that.nowActivity && that.nowActivity.total_people < 9) {
            that.showhelpList.splice(that.nowActivity.total_people * 1)
          }
          that.helpList.forEach((el, i) => {
            if (el && i < 9) {
              that.showhelpList.splice(i, 1, el)
            }
          })
        }

        if (that.nowActivity && that.nowActivity.unique_id) {
          // 差多少人
          that.nowActivity.need_people =
            that.nowActivity.total_people - that.nowActivity.help_people
          that.nowActivity.scale =
            that.nowActivity.help_people / that.nowActivity.total_people * 100
        }
        that.loadData = true
      }

      let shareParams = {
        key: 'free_order_index',
        cur_page_url: window.location.href,
        aid: aid,
        gid: gid
      }
      if (that.nowActivity && that.nowActivity.share_url) {
        shareParams.help_url = that.nowActivity.share_url
      }
      const wxRes = await $ajax('get', '/free-order/share-config', shareParams)
      if (wxRes.error_code === 0) {
        let shareConfig = wxRes.data.shareConfig
        let shareSignConfig = wxRes.data.shareSignConfig
        wxShare(
          shareSignConfig.appId,
          shareSignConfig.timestamp,
          shareSignConfig.nonceStr,
          shareSignConfig.signature,
          shareConfig
        )
      }

      const winResult = await $ajax('post', '/free-order/withdraw-list', {
        aid: aid
      })
      if (winResult.error_code === 0) {
        that.winList = winResult.data
      }
    },
    // 关闭锦鲤提示
    closeCode() {
      this.showCode = false
    },
    // 主活动倒计时结束
    timeEnd(msg) {
      this.nowActivity.left_time = 0
      this.nowActivity.status = -1
      location.reload()
    },
    // 列表倒计时结束
    itemtimeEnd(index) {
      this.orderList[index].status = -1
      this.orderList[index].left_time = 0
    },
    // 创建免单页面
    goCreate() {
      window._hmt.push([
        '_trackEvent',
        '用户发起抢免单',
        'click',
        '新春免单活动',
        1
      ])
      this.activityTime()
      toUrl(
        `/create?aid=${aid}&gid=${gid}`,
        `/free-order/create-activity?aid=${aid}&gid=${gid}`
      )
    },
    // 首页
    goIndex() {
      toUrl(
        `/page?aid=${aid}&gid=${gid}`,
        `/free-order/home?aid=${aid}&gid=${gid}`
      )
    },
    tiXian() {
      // 去提现
      this.activityTime()
      toUrl(
        `/money?aid=${aid}&gid=${gid}`,
        `/free-order/user-withdraw?aid=${aid}&gid=${gid}`
      )
    },
    // 去锦鲤页面
    goJinli() {
      this.activityTime()
      toUrl(
        `/jinli?aid=${aid}&gid=${gid}`,
        `/free-order/jin-li?aid=${aid}&gid=${gid}`
      )
    },
    // 切换详情
    lookMore(item) {
      toUrl(
        `/on?aid=${aid}&gid=${gid}`,
        `/free-order/index?aid=${aid}&gid=${gid}&unique_id=${item.unique_id}`
      )
    },
    // 活动过期时间
    activityTime() {
      let that = this
      let { current_time, act_info } = that.pageInfo
      if (current_time < act_info.start_time) {
        that.gameTimeOptions.type = 2
        that.gameTimeOptions.show = true
        return false
      }
      if (current_time > act_info.end_time) {
        that.gameTimeOptions.type = 1
        that.gameTimeOptions.show = true
        return false
      }
    },
    // 打开红包
    handleOpen() {
      this.show = false
      this.openRed = true
    },
    // 关注二维码
    handleCode() {
      this.openRed = false
      this.show = false
      this.openCode = true
    },
    // 帮助力
    async help() {
      let that = this
      // 活动时间
      window._hmt.push([
        '_trackEvent',
        '助力帮人的人数',
        'click',
        '新春免单活动',
        1
      ])
      that.activityTime()
      const data = await $ajax('post', '/free-order/help', {
        gid: gid,
        aid: aid,
        share_union_id: getQueryString('share_union_id'),
        user_activity_unique_id: getQueryString('user_activity_unique_id')
      })
      if (data.error_code === 0) {
        that.mall = data.data
        that.show = true
        that.nowActivity.need_people =
          that.nowActivity.total_people - data.data.total_help_nums
        that.nowActivity.scale =
          data.data.total_help_nums / that.nowActivity.total_people * 100
        that.pageInfo.is_help = 1
        if (that.nowActivity.scale * 1 === 100) {
          that.nowActivity.status = 1
        }
        that.helpList.push(data.data.helper_avatar_url)
        that.followInfo = data.data
      }
    }
  }
}
</script>

<style lang="less">
@url: '//dl.gamdream.com/activity/galan/chunjie/img/';
@keyframes btnScale {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.8);
  }
}
.animationBtn {
  animation: btnScale 1s infinite linear alternate;
}
#content {
  position: relative;
  width: 7.5rem;
  background: url('@{url}bg2.jpg') no-repeat;
  background-size: 100% auto;
  min-height: 12.1rem;
  padding-top: 0.88rem;
  box-sizing: border-box;
  &.otherbody {
    padding-top: 0.15rem;
  }
}
.head {
  background: url('@{url}tab_0.png') no-repeat;
  background-size: 100% auto;
  height: 0.97rem;
  display: flex;
  position: fixed;
  left: 50%;
  width: 7.5rem;
  transform: translateX(-50%);
  top: 0;
  z-index: 5;
  justify-content: center;
  .item {
    position: relative;
    text-align: center;
    width: 2.18rem;
    height: 0.64rem;
    background: url('@{url}tab_2.png') no-repeat;
    background-size: 100% auto;
    text-indent: -999em;
    margin: 0.14rem 0.4rem 0;
    &:first-child {
      background-image: url('@{url}tab_4.png');
      &.active {
        background-image: url('@{url}tab_3.png');
      }
    }
    &:last-child {
      background-image: url('@{url}tab_2.png');
      &.active {
        background-image: url('@{url}tab_1.png');
      }
    }
  }
}
.stitle {
  text-align: center;
  margin-bottom: 0.35rem;
  img {
    width: 4.9rem;
  }
}

.pops {
  -webkit-transform: scale(0);
  transform: scale(0);
  transition: all 0.3s ease-in;
  background: rgba(0, 0, 0, 0);
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 100;
  &.show {
    -webkit-transform: scale(1);
    transform: scale(1);
    background: rgba(0, 0, 0, 0.8);
  }
  .smclose {
    position: absolute;
    width: 0.8rem;
    height: 0.8rem;
    right: 0;
    top: 0;
    z-index: 1;
    &::before {
      position: absolute;
      content: '';
      width: 0.16rem;
      height: 0.16rem;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background: url('@{url}close.png') no-repeat;
      background-size: 100% auto;
    }
  }
  //获取红包
  &.mall_pop,
  &.open_red {
    .pop_mc {
      width: 5.6rem;
      height: 7.3rem;
      background: #e82040 url('@{url}pop_4.png') center bottom no-repeat;
      background-size: 100% auto;
      text-align: center;
      .user {
        padding-top: 0.55rem;
        margin-bottom: 0.6rem;
        font-size: 0.36rem;
        color: #ffd684;
        line-height: 0.4rem;
        img {
          width: 1.08rem;
          height: 1.08rem;
          border-radius: 50%;
          border: 0.03rem solid #fffbbf;
          margin-bottom: 0.14rem;
        }
        p {
          font-size: 0.28rem;
          margin-bottom: 0.1rem;
        }
      }
      .tit {
        font-size: 0.42rem;
        color: #ffefcf;
        padding: 0;
        margin: 0 0 0.6rem;
      }
      .open_one {
        display: inline-block;
        width: 1.48rem;
        height: 1.48rem;
        background: url('@{url}pop_2.png') no-repeat;
        background-size: 100% auto;
      }
      .look_one {
        margin-top: 0.5rem;
        display: inline-block;
        width: 3.6rem;
        height: 0.88rem;
        line-height: 0.88rem;
        text-align: center;
        color: #a6152c;
        font-size: 0.3rem;
        background: #ffd683;
        border-radius: 0.1rem;
      }
    }
  }
  // 领取红包
  &.open_red {
    .pop_mc {
      width: 5.6rem;
      height: 6.53rem;
      background: url('@{url}pop_3.png') center top no-repeat;
      background-size: 100% auto;
      text-align: center;
      &::before {
        position: absolute;
        content: '';
        left: 0;
        bottom: 0;
        width: 100%;
        height: 2.79rem;
        background: url('@{url}pop_1.png') no-repeat;
        background-size: 100% auto;
      }
      .red_bg {
        position: relative;
        z-index: 3;
      }
      .user {
        margin-top: -1.1rem;
        color: #e82040;
        img {
          vertical-align: top;
        }
      }
      .tit {
        font-size: 0.48rem;
        color: #a6152c;
        line-height: 1.2rem;
        span {
          font-size: 0.88rem;
        }
        margin-bottom: 1.25rem;
      }
      .open_one {
        width: 3.6rem;
        height: 0.88rem;
        line-height: 0.88rem;
        text-align: center;
        color: #a6152c;
        font-size: 0.3rem;
        background: #ffd683;
        border-radius: 0.1rem;
      }
    }
  }
  // 关注二维码
  &.pop_game {
    .pop_mc {
      width: 5.6rem;
      height: 7.88rem;
      background: url('@{url}pop_5.png') no-repeat;
      background-size: 100% auto;
    }
    img {
      padding: 0.1rem;
      background: #fff;
      width: 2.85rem;
      height: 2.85rem;
      position: absolute;
      left: 0.67rem;
      top: 2.22rem;
    }
  }
  //获取锦鲤码
  &.jinli_pop {
    .pop_mc {
      width: 5.8rem;
      background: #fcf7eb;
      border-radius: 0.2rem;
      height: auto;
      .code_mt {
        height: 1.9rem;
        line-height: 1.9rem;
        text-align: center;
        background: #e82040;
        border-radius: 0.2rem 0.2rem 0 0;
        img {
          width: 2.65rem;
          vertical-align: middle;
        }
      }
      .code_tit{
        color: #E82040;
        font-size: .36rem;
        margin-top: .46rem;
        font-weight: bold;
      }
      .code_bot{
        color: #9A9A9A;
        font-size: .24rem;
        margin-top: .2rem;
      }
      .code_mc {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 1.5rem;
        margin-top: .32rem;
        p {
          width: 2.98rem;
          height: 1.46rem;
          line-height: 1.46rem;
          text-align: center;
          font-size: 0.48rem;
          color: #fff5d1;
          background: url('@{url}ico2.png') no-repeat;
          background-size: 100% auto;
        }
      }
      .code_btnsure{
        width: 2.86rem;
        height: .8rem;
        background: url("//dl.gamdream.com/activity/galan/chunjie/img/code_btnsure.png");
        background-size: 100% 100%;
        display: block;
        margin: .26rem auto 0;
      }
      .code_line{
        height: .7rem;
      }
    }
  }
  //引导分享
  &.share_pop {
    img {
      width: 7.5rem;
    }
  }
  //记录列表
  &.user_pop {
    .pop_mc {
      background: #fff;
      width: 5.6rem;
      height: 7rem;
      overflow: scroll;
      -webkit-overflow-scrolling: touch;
      .tits {
        font-size: 0.36rem;
        color: #4a4a4a;
        text-align: center;
        line-height: 1;
        padding: 0.4rem 0;
      }
      .users {
        margin: 0 0rem 0 0.28rem;
        overflow: hidden;
        height: auto;
        li {
          float: left;
          width: 0.54rem;
          height: 0.54rem;
          border-radius: 50%;
          background: #e9e9e9;
          position: relative;
          margin: 0 0.09rem 0.2rem;
          &::before {
            position: absolute;
            content: '';
            width: 0.24rem;
            height: 0.24rem;
            left: 50%;
            top: 50%;
            margin: -0.12rem 0 0 -0.12rem;
            background: url('@{url}add.png') no-repeat;
            background-size: 100% auto;
          }
          img {
            position: relative;
            z-index: 2;
            width: 0.54rem;
            height: 0.54rem;
            border-radius: 50%;
          }
        }
      }
    }
  }
  .pop_mc {
    position: absolute;
    width: 5.8rem;
    height: 5.7rem;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    background: #fefaef;
    border-radius: 0.2rem;
    text-align: center;
    line-height: 1;
    font-size: 0.36rem;
    .pic {
      width: 1.3rem;
      height: 1.3rem;
      border-radius: 50%;
      position: absolute;
      left: 50%;
      top: -0.59rem;
      margin-left: -0.59rem;
      border: 0.06rem solid #fefaef;
    }
    .tit {
      padding-top: 1rem;
      color: #3a3a3a;
      margin-bottom: 0.15rem;
    }
    .text {
      color: #3a3a3a;
      margin-bottom: 0.4rem;
    }
  }
}
//助力界面
.zhuli {
  box-sizing: border-box;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  padding-top: 0.55rem;
  .users {
    margin: 0 0rem 0 0.28rem;
    height: 0.6rem;
    overflow: hidden;
    li {
      float: left;
      width: 0.54rem;
      height: 0.54rem;
      border-radius: 50%;
      border: 0.03rem solid #fff;
      background: #e9e9e9;
      position: relative;
      margin-right: 0.22rem;
      &::before {
        position: absolute;
        content: '';
        width: 0.24rem;
        height: 0.24rem;
        left: 50%;
        top: 50%;
        margin: -0.12rem 0 0 -0.12rem;
        background: url('@{url}add.png') no-repeat;
        background-size: 100% auto;
      }
      img {
        position: relative;
        z-index: 2;
        width: 0.54rem;
        height: 0.54rem;
        border-radius: 50%;
      }
    }
  }
  .main {
    width: 6.9rem;
    min-height: 7.5rem;
    background: #fff3e7;
    border-radius: 0.2rem;
    margin: 0 auto 0.34rem;
    padding: 0.4rem 0 0.3rem;
    box-sizing: border-box;
    .otherList {
      .ouser {
        padding-left: 0.35rem;
        color: #3a3a3a;
        font-size: 0.32rem;
        line-height: 0.82rem;
        img {
          width: 0.82rem;
          height: 0.82rem;
          border-radius: 50%;
          vertical-align: middle;
          margin-right: 0.12rem;
          border: 1px solid #fffbbf;
        }
      }
      .txt {
        text-align: center;
        font-size: 0.36rem;
        color: #1a1a1a;
        line-height: 1rem;
      }
    }
    .redbox {
      width: 5.8rem;
      height: 2.58rem;
      background: url('@{url}ico1.png') no-repeat;
      background-size: 100% auto;
      margin: 0 auto 0.8rem;
      .time {
        margin-bottom: 0.65rem;
        font-size: 0.24rem;
        color: #fff;
        padding-top: 0.35rem;
        text-align: center;
        height: 0.46rem;
        span {
          color: #1a1a1a;
          font-size: 0.3rem;
          display: inline-block;
          min-width: 0.46rem;
          padding: 0 0.05rem;
          box-sizing: border-box;
          height: 0.46rem;
          line-height: 0.46rem;
          text-align: center;
          background: #f5f5f5;
          margin: 0 0.05rem;
          border-radius: 0.08rem;
        }
      }
      .text {
        color: #fff2af;
        font-size: 0.4rem;
        line-height: 1;
        text-align: center;
        vertical-align: middle;
        em {
          font-size: 0.78rem;
          margin-right: 0.05rem;
        }
      }
    }
    .progress {
      width: 5.8rem;
      margin: 0 auto 0.4rem;
      position: relative;
      .bar {
        width: 5.8rem;
        height: 0.24rem;
        border-radius: 0.24rem;
        overflow: hidden;
        background: #fbdec2;
        span {
          display: block;
          height: 100%;
          width: 0%;
          border-radius: 0.24rem;
          background: linear-gradient(left, #ff1b57, #d21546);
        }
      }
      .success {
        position: absolute;
        color: #ff3c3c;
        font-size: 0.32rem;
        text-align: center;
        width: 100%;
        top: -0.6rem;
        left: 0;
      }
      .p_text {
        position: absolute;
        left: 0;
        top: -0.48rem;
        line-height: 0.34rem;
        border-radius: 0.34rem;
        background: #ec184f;
        color: #fff;
        font-size: 0.2rem;
        padding: 0 0.12rem;
        &::before {
          position: absolute;
          content: '';
          left: 0.26rem;
          bottom: -0.09rem;
          width: 0;
          height: 0;
          border-right: 0.1rem solid transparent;
          border-left: 0.1rem solid transparent;
          border-top: 0.1rem solid #ec184f;
        }
      }
    }
    .helplist {
      .btns {
        height: 0.88rem;
        text-align: center;
        margin-bottom: 0.25rem;
        .success {
          padding: 0 0.55rem;
          overflow: hidden;
          a {
            float: left;
            width: 2.68rem;
            background: url('@{url}same_2.png') no-repeat;
            background-size: 100% auto;
            &.on {
              background: none;
              color: #e82040;
              border: 0.04rem solid rgba(232, 37, 68, 1);
              border-radius: 0.4rem;
              height: 0.76rem;
              line-height: 0.7rem;
              box-sizing: border-box;
            }
            &.share {
              float: right;
            }
          }
        }
        a {
          display: inline-block;
          width: 3.8rem;
          height: 0.8rem;
          line-height: 0.8rem;
          text-align: center;
          font-size: 0.34rem;
          color: #fff;
          background: url('@{url}same.png') no-repeat;
          background-size: 100% auto;
        }
      }
      .tip {
        color: #9a9a9a;
        font-size: 0.24rem;
        height: 0.24rem;
        text-align: center;
        line-height: 1;
      }
      .text {
        color: #3a3a3a;
        font-size: 0.24rem;
        overflow: hidden;
        margin: 0 0.35rem;
        line-height: 0.65rem;
        .more {
          float: right;
          color: #999;
        }
      }
    }
  }
  .foot {
    .onlist {
      li {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 6.9rem;
        height: 1.46rem;
        background: #fff3e7;
        border-radius: 0.84rem;
        margin: 0 auto;
        margin-bottom: 0.3rem;
        img {
          width: 1.08rem;
          height: 1.08rem;
          margin: 0 0.2rem;
        }
        .midd {
          color: #5a5a5a;
          font-size: 0.24rem;
          flex: 1;
          p {
            span {
              color: #ff225b;
            }
          }
          margin-bottom: 0.08rem;
          div {
            font-size: 0.3rem;
            color: #5a5a5a;
            span {
              color: #ff225b;
            }
          }
        }
        .time {
          color: #fff;
          font-size: 0.28rem;
          width: 2.15rem;
          height: 0.98rem;
          text-align: center;
          margin: 0 0.2rem;
          display: table;
          background: url('@{url}on_1.png') no-repeat;
          background-size: 100% auto;
          .time_box {
            display: table-cell;
            vertical-align: middle;
          }
          p {
            line-height: 1;
            margin-bottom: 0.08rem;
            font-size: 0.2rem;
            margin-top: 0.06rem;
          }
          a {
            color: #fff;
            display: block;
          }
        }
      }
    }
  }
  //没有免单的首页
  .noGoods {
    background: #fff3e7;
    text-align: center;
    line-height: 1;
    color: #7a7a7a;
    font-size: 0.24rem;
    background: #fffaf0;
    border-radius: 0.2rem;
    width: 6.9rem;
    margin: 0 auto;
    height: 7rem;
    h3 {
      color: #3a3a3a;
      font-size: 0.3rem;
      margin-bottom: 0.1rem;
    }
    img {
      width: 1.43rem;
      padding: 2.5rem 0 0.2rem;
    }
    p {
      margin-bottom: 0.2rem;
    }
    .mall {
      display: block;
      margin: 0 auto;
      width: 3.8rem;
      height: 0.8rem;
      line-height: 0.8rem;
      text-align: center;
      font-size: 0.34rem;
      color: #fff;
      background: url('@{url}same.png') no-repeat;
      background-size: 100% auto;
    }
  }
}
</style>
