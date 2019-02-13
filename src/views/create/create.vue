<template>
  <div class="car" v-if="loadData">
    <Rule :options="ruleOptions"></Rule>
    <Users :list="winList"></Users>
    <div class="head">
      <div class="item active">活动首页</div>
      <div class="item" @click="goOn">红包进行中</div>
    </div> 
    <div class="sameHead" v-if="pageInfo.wxUserInfo">
      <div class="user">
        <img class="pic" :src="pageInfo.wxUserInfo.avatar_url"/>
        <div class="text">
          <span class="name">{{pageInfo.wxUserInfo.nick_name}}</span>
          <p>可免单红包: {{canUseMoney}}元</p>
        </div>
      </div>
    </div>

    <div class="mc">
      <div class="have">
        <div class="con">
          <div class="tit">
            <img class="pic" src="//dl.gamdream.com/activity/galan/chunjie/img/c_tit2.png"/>
            <img class="pic2" src="//dl.gamdream.com/activity/galan/chunjie/img/c_tit1.png"/>
            <p class="time">仅限{{time}}的订单</p>
          </div>
          <ul class="list" v-if="pageInfo.order_list && pageInfo.order_list.length">
            <li v-for="(item, index) in pageInfo.order_list" :key="item.order_id" :class="item.check?'check':''" @click="checkOrder(index)">
              <i></i>
              <img class="pic" src="//dl.gamdream.com/activity/galan/chunjie/img/gift.png"/>
              <div class="text">
                <p>订单时间：{{item.updated | timeFormat}}</p>
                <p>订单金额：<span class="red">{{item.pay_money}}元</span></p>
              </div>
              <div class="bg"></div>
            </li>
          </ul>
          <div class="noOrder" v-if="pageInfo.order_list && !pageInfo.order_list.length">
            <img class="pic" src="//dl.gamdream.com/activity/galan/chunjie/img/car_1.png"/>
            <h3>亲，你的订单是空空的…</h3>
            <p>仅限{{time}}的订单！</p>
            <a :href="pageInfo.shop_url" class="mall">逛一逛商城</a>
          </div>
        </div>
        <div class="foot" v-if="pageInfo.order_list && pageInfo.order_list.length">
          <h3 class="t">选择邀请人数</h3>
          <div class="swiper">
            <ul>
              <li 
                v-for="(item, index) in pageInfo.help_config" 
                :key="item.id"
                :class="switchStatus(item.user_status, index)"  
                @click="checkPeople(index)">
                  {{item.help_num}}人
              </li>
            </ul>
          </div>
          <div class="btns">
            <div class="all mbox" :class="checkkg?'check':''" @click="checkAll">
              <i></i>
              <div class="text">
                <h3>全选免单</h3>
                <p>可免单金额: <span>{{check_money}}</span>元</p>
              </div>
            </div>
            <div class="save" @click="sub">发起免单</div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import Rule from '@/components/Rule.vue'
import { $ajax, getQueryString, timeFormat, wxShare, toUrl } from '@/utils'
import Toast from '@/components/toast'
import Users from '@/components/Users.vue' // 滚动的获奖者组件

const aid = getQueryString('aid')
const gid = getQueryString('gid')

export default {
  name: 'create',
  components: {
    Rule,
    Users
  },
  data() {
    return {
      loadData: false, // 加载数据状态
      ruleOptions: {
        ruleStyle: {
          top: '1.55rem',
          right: '.3rem'
        },
        picUrl: '' // 规则图片
      },
      pageInfo: {}, // 页面信息
      time: '', // 活动时间
      check_money: '', // 选中的钱
      winList: [], // 最新提现者
      checkkg: false, // 选择所有
      btnList: {
        showHelp: true
      },
      canUseMoney: 0 // 可免单的金额
    }
  },
  created() {
    this.getData()
  },
  filters: {
    timeFormat: function(val) {
      return timeFormat(val, 'dian')
    }
  },
  methods: {
    switchStatus(type = type * 1) {
      let className = ''
      if (type === 1) {
        className = 'no'
      } else if (type === 0) {
        className = 'can'
      } else if (type === 2) {
        className = 'active'
      }
      return className
    },
    async getData() {
      let that = this
      const data = await $ajax('post', '/free-order/order-info', {
        aid: aid,
        gid: gid
      })
      console.log(data)
      if (data.error_code === 0) {
        let {
          start_time,
          end_time,
          shop_url,
          rule,
          order_list,
          help_config
        } = data.data
        that.pageInfo = data.data
        that.pageInfo.order_list.forEach((element, index) => {
          element.check = false
        })
        if (shop_url.indexOf('?') !== -1) {
          that.pageInfo.shop_url = shop_url + '&gid=' + gid
        } else {
          that.pageInfo.shop_url = shop_url + '?gid=' + gid
        }

        // 默认选中第一个
        if (order_list.length) {
          that.checkOrder(0)
        }
        if (help_config.length) {
          let help_index = -1
          for (var i = 0; i < help_config.length; i++) {
            if (help_config[i].user_status * 1 === 0 && help_index === -1) {
              help_index = i
            }
            if (help_config[i].user_status * 1 === 0) {
              this.canUseMoney += help_config[i].get_money * 1e4
            }
          }
          this.canUseMoney = this.canUseMoney / 1e4
          if (help_index !== -1) {
            that.checkPeople(help_index)
          }
        }

        that.ruleOptions.picUrl = rule

        that.time =
          timeFormat(start_time, 'month') + '-' + timeFormat(end_time, 'month')
        that.loadData = true
      }

      const winResult = await $ajax('post', '/free-order/withdraw-list', {
        aid: aid
      })
      if (winResult.error_code === 0) {
        that.winList = winResult.data
      }

      const wxRes = await $ajax('get', '/free-order/share-config', {
        key: 'free_order_common',
        cur_page_url: window.location.href,
        aid: aid,
        gid: gid
      })
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
    },
    // 去提现
    tiXian() {
      toUrl(`/money?aid=${aid}&gid=${gid}`, `/free-order/user-withdraw?aid=${aid}&gid=${gid}`)
    },
    // 进行中的页面
    goOn() {
      toUrl(`/on?aid=${aid}&gid=${gid}`, `/free-order/index?aid=${aid}&gid=${gid}`)
    },
    // 创建免单的钱
    chengeMoney() {
      let that = this
      let help_price = 0
      let order_prices = []

      that.pageInfo.help_config.forEach(el => {
        if (el.user_status * 1 === 2) {
          help_price = el.get_money * 1e3
        }
      })

      that.pageInfo.order_list.forEach(el => {
        if (el.check) {
          order_prices.push(el.pay_money * 1e3)
        }
      })

      let allMoney = 0
      order_prices.forEach(el => {
        allMoney += el
      })

      that.check_money = Math.min(allMoney / 1e3, help_price / 1e3)
    },
    // 选上某个订单
    checkOrder(index) {
      let that = this
      let kg = this.pageInfo.order_list[index].check
      this.pageInfo.order_list[index].check = !kg
      Vue.set(this.pageInfo.order_list, index, this.pageInfo.order_list[index])

      let leng = 0
      that.pageInfo.order_list.forEach(el => {
        if (el.check === true) {
          leng++
        }
      })

      if (leng === that.pageInfo.order_list.length) {
        that.checkkg = true
      } else {
        that.checkkg = false
      }

      this.chengeMoney()
    },
    // 选上人数
    checkPeople(index) {
      if (this.pageInfo.help_config[index].user_status * 1 === 0) {
        this.pageInfo.help_config.forEach(el => {
          if (el.user_status * 1 === 2) {
            el.user_status = 0
          }
        })
        this.pageInfo.help_config[index].user_status = 2
        this.chengeMoney()
      }
    },
    // 选上所有订单
    checkAll() {
      let that = this
      that.checkkg = !that.checkkg
      that.pageInfo.order_list.forEach(el => {
        if (that.checkkg) {
          el.check = true
        } else {
          el.check = false
        }
      })
      that.chengeMoney()
    },
    // 发起免单
    async sub() {
      window._hmt.push([
        '_trackEvent',
        '用户发起免单人数',
        'click',
        '新春免单活动',
        1
      ])
      let that = this
      let help_id = ''
      let order_ids = []
      that.pageInfo.help_config.forEach(el => {
        if (el.user_status * 1 === 2) {
          help_id = el.id
        }
      })

      that.pageInfo.order_list.forEach(el => {
        if (el.check) {
          order_ids.push(el.order_id)
        }
      })

      if (!help_id) {
        Toast('请选择人数')
        return false
      }

      if (!order_ids.length) {
        Toast('请至少选择一个订单')
        return false
      }

      const data = await $ajax('post', '/free-order/create-activity-for-ajax', {
        aid: aid,
        gid: gid,
        help_id: help_id,
        order_ids: JSON.stringify(order_ids)
      })
      console.log(data)
      if (data.error_code === 0) {
        window.location.href = data.data.shareUrl
      }
    }
  }
}
</script>

<style  scoped lang="less">
@url: '//dl.gamdream.com/activity/galan/chunjie/img/';
.car {
  position: relative;
  width: 7.5rem;
  min-height: 12.1rem;
  padding-top: 0.88rem;
  padding-bottom: 2.6rem;
  box-sizing: border-box;
  background: url('@{url}bg2.jpg') no-repeat;
  background-size: 100% auto;
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
  .sameHead {
    position: relative;
    padding: 0.58rem 0.3rem 0.45rem;
    .user {
      color: #fff;
      font-size: 0.3rem;
      display: flex;
      -webkit-box-align: center;
      -webkit-align-items: center;
      align-items: center;
      .pic {
        width: 0.88rem;
        height: 0.88rem;
        border-radius: 50%;
        border: 1px solid #fff;
        margin-right: 0.18rem;
      }
      .text {
        flex: 1;
        span{
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: block;
          width:4rem;
        }
        p {
          font-size: 0.24rem;
          color: #feefbd;
        }
      }
    }
  }
  .mc {
    margin: 0 0.3rem;
    position: relative;
    .have {
      .tit {
        text-align: center;
        img {
          width: 6.8rem;
          vertical-align: top;
        }
        .pic {
          margin-bottom: 0.13rem;
        }
        .time{
          position: absolute;
          width:100%;
          left:0;
          top: .51rem;
          text-align: center;
          font-size:.2rem;
          color: #FBC9D1;
        }
      }
      .list {
        padding-bottom: 0.2rem;
        margin: 0 auto 0.12rem;
        width: 6.4rem;
        li {
          cursor: pointer;
          height: 0.88rem;
          background: #fff3e7;
          color: #5a5a5a;
          font-size: 0.26rem;
          display: -webkit-box;
          display: -webkit-flex;
          display: flex;
          -webkit-box-align: center;
          -webkit-align-items: center;
          align-items: center;
          padding: 0.2rem 0 0.54rem;
          overflow: hidden;
          position: relative;
          &.check {
            i {
              border-color: #fc1a7f;
              background: url('@{url}check.png') no-repeat;
              background-size: 100% auto;
              border: none;
            }
          }
          i {
            display: block;
            width: 0.42rem;
            height: 0.42rem;
            border: 1px solid #c9c9c9;
            box-sizing: border-box;
            border-radius: 50%;
            margin: 0 0.25rem;
          }
          .pic {
            width: 0.88rem;
            height: 0.88rem;
            border-radius: 0.08rem;
            margin-right: 0.28rem;
          }
          .text {
            .red {
              color: #e82040;
            }
          }
          &:last-of-type {
            padding-bottom: 0.3rem;
            .bg {
              display: none;
            }
          }
          .bg {
            position: absolute;
            width: 6.72rem;
            height: 0.34rem;
            background: url('@{url}c_tit3.png') no-repeat;
            background-size: 100% auto;
            left: -0.16rem;
            bottom: 0;
          }
        }
      }
    }
    .noOrder {
      text-align: center;
      line-height: 1;
      color: #7a7a7a;
      font-size: 0.24rem;
      width: 6.4rem;
      margin: 0 auto;
      background: #fff3e7;
      height: 6rem;
      border-radius: 0px 0px 0.12rem 0.12rem;
      h3 {
        color: #3a3a3a;
        font-size: 0.3rem;
        margin-bottom: 0.1rem;
      }
      img {
        width: 1.43rem;
        padding: 1.3rem 0 0.2rem;
      }
      p {
        margin-bottom: 0.2rem;
      }
      .mall {
        display: block;
        margin: 0 auto;
        width: 3.8rem;
        height: 0.8rem;
        line-height: .8rem;
        text-align: center;
        font-size:.34rem;
        color:#fff;
        background: url('@{url}same.png') no-repeat;
        background-size: 100% auto;
      }
    }
  }
  .foot {
    position: fixed;
    width: 7.5rem;
    left: 50%;
    margin-left: -3.75rem;
    bottom: 0;
    z-index: 5;
    background: #fff;
    .t {
      color: #1a1a1a;
      font-size: 0.24rem;
      padding: 0 0.2rem;
      line-height: 0.6rem;
    }
    .swiper {
      height: 0.54rem;
      margin-bottom: 0.3rem;
      ul {
        overflow: hidden;
        overflow-x: scroll;
        -webkit-overflow-scrolling: touch;
        white-space: nowrap;
        &::-webkit-scrollbar {
          display: none;
        }
      }
      li {
        width: 1.2rem;
        border-radius: 0.54rem;
        font-size: 0.28rem;
        text-align: center;
        line-height: 0.54rem;
        display: inline-block;
        margin-right: 0.28rem;
        &:first-child {
          margin-left: 0.2rem;
        }
        &.no {
          color: #9a9a9a;
          background: #e9e9e9;
        }
        &.can {
          background: #fff0c8;
          color: #1a1a1a;
        }
        &.active {
          background: #e82040;
          color: #fff;
        }
      }
    }
    .btns {
      border-top: 1px solid #efefef;
      overflow: hidden;
      .save {
        background: #e82040;
        color: #fff;
        font-size: 0.3rem;
        width: 3.15rem;
        float: right;
        line-height: 1.07rem;
        text-align: center;
      }
      .all {
        float: left;
        height: 1.07rem;
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
        &.check {
          i {
            border-color: #fc1a7f;
            background: url('@{url}check.png') no-repeat;
            background-size: 100% auto;
            border: none;
          }
        }
        i {
          display: block;
          width: 0.42rem;
          height: 0.42rem;
          border: 1px solid #c9c9c9;
          box-sizing: border-box;
          border-radius: 50%;
          margin: 0 0.22rem 0 0.35rem;
        }
        .text {
          font-size: 0.24rem;
          color: #7a7a7a;
          h3 {
            color: #3a3a3a;
          }
          span {
            color: #fc1a7f;
          }
        }
      }
    }
  }
}
</style>
<style lang="less">
#users {
  top: 2.6rem;
}
</style>

