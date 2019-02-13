<template>
  <div class="wx" v-if="loadData">
    <div class="head">
      <div class="top clearfix">
        <a href="javascript:;" class="back" @click="goBack"><i></i>返回首页</a>
        <a href="javascript:;" class="rule" @click="lookRule = true"><i></i>提现规则</a>
      </div>
      <div class="user">
        <img :src="user.avatar_url" alt="">
        <p>{{user.nick_name}}</p>
      </div>
      <div class="nums">
        <div class="item">
          <h3>红包个数(个)</h3>
          <p>{{user.red_packet_count}}</p>
        </div>
        <div class="item">
          <h3>累计红包金额(元）</h3>
          <p>{{user.total_money}}</p>
        </div>
      </div>
    </div>
    <p class="background" style="height:.2rem;"></p>
    <div class="title clearfix">
      <span>可提现红包<em>{{user.left_money}}元</em></span>
      <a href="javascript:;" class="btn" @click="showTixian">提现</a>
    </div>
    <p class="background"></p>
    <div class="mc_t"><i></i>红包记录</div>
    <ul class="list">
      <li class="mbox" v-for="(item, index) in list" :key="index">
        <div class="left">
          <p>{{item.type | status}}</p>
          <span>{{item.created | timeFormat}}</span>
        </div>
        <p class="price mflex" v-if="item.type != 101">+{{item.money}}元</p>
        <p class="price mflex jian" v-else>{{item.money}}元</p>
      </li>
    </ul>
    <!--规则弹窗-->
    <div class="rules" :class="lookRule ? 'show' : ''" @click="lookRule = false">
      <div class="con">
        <img :src="rulepic"/>
      </div>
    </div>
    <!--提现弹窗-->
    <div class="pop pop_money" :class="show ? 'show' : ''" @click="show = false" :style="{minHeight:height+'px'}">
      <div class="mask"></div>
      <div class="pop_mc" @click.stop="show = true">
        <div class="tit"><em>提现金额</em>(每天可提现5次)</div>
        <div class="ins">
          <span>￥</span><input type="number" v-model="price"/>
        </div>
        <p class="tip">账户余额{{user.left_money}}元可提现</p>
        <a class="save" href="javascript:;" @click.stop="sub()">提现</a>
        <p class="tip1">1-2个工作日到账微信零钱</p>
      </div>
    </div>
    <!--时间弹窗-->
    <div class="pop pop_time" :class="showTime ? 'show' : ''" @click="close">
      <div class="pop_mc" @click.stop="showTime = true">
        <span class="ico"></span>
        <div class="titles" v-if="timeInfo.type=='wait'">亲，提现还没有开启！</div>
        <div class="over" v-if="timeInfo.type=='over'">
          <p>亲，提现时间已过了！</p>
        </div>
        <span>提现时间:{{timeInfo.text}}</span>
        <div class="btn" @click.stop="close">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
import { $ajax, getQueryString, wxShare, timeFormat, toUrl } from '@/utils'
import Toast from '@/components/toast'

const aid = getQueryString('aid')
const gid = getQueryString('gid')

export default {
  name: 'wx',
  data() {
    return {
      loadData: false, // 加载数据状态
      show: false,
      lookRule: false,
      showTime: false,
      list: [],
      user: {},
      price: '',
      timeInfo: {
        type: '',
        text: ''
      },
      rulepic: '',
      height: document.documentElement.clientHeight,
      time: 0,
      canScroll: true,
      page: 1
    }
  },
  created() {
    // this.user.left_money = 2;
    this.getData()
  },
  mounted() {
    // 翻页
    // window.addEventListener('scroll', this.onScroll)
  },
  filters: {
    timeFormat: function(val) {
      return timeFormat(val, 'dian')
    },
    status: function(val) {
      let text = ''
      switch (val * 1) {
        case 1:
          text = '免单活动红包'
          break
        case 2:
          text = '天天签到红包'
          break
        default:
          text = '提现至微信零钱'
          break
      }
      return text
    }
  },
  methods: {
    close() {
      this.showTime = false
      WeixinJSBridge.call('closeWindow')
    },
    async getDataAgin(type) {
      const result = await $ajax('get', '/free-order/red-packet-list', {
        aid: aid,
        gid: gid
      })
      console.log(result)
      if (result.error_code === 0) {
        if (type) {
          this.list = this.list.concat(result.data.list)
        } else {
          this.list = result.data.list
        }
        if (result.data.list.length !== 10) {
          this.canScroll = false
        } else {
          this.canScroll = true
        }
        this.user = result.data.user
      }
    },
    async getData() {
      window._hmt.push([
        '_trackEvent',
        '提现的人数',
        'click',
        '新春免单活动',
        1
      ])
      let that = this
      const result = await $ajax('get', '/free-order/red-packet-list', {
        aid: aid,
        gid: gid
      })
      if (result.error_code === 0) {
        this.list = result.data.list
        this.user = result.data.user
        this.rulepic = result.data.withdraw_rule
        this.loadData = true

        let {
          current_time,
          withdraw_start_time,
          withdraw_end_time
        } = result.data
        that.timeInfo.text =
          timeFormat(withdraw_start_time, 'month') +
          '-' +
          timeFormat(withdraw_end_time, 'month')
        // 活动时间
        if (current_time < withdraw_start_time) {
          that.timeInfo.type = 'wait'
        }
        if (current_time > withdraw_end_time) {
          that.timeInfo.type = 'over'
        }
      }
      console.log(result)

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
    showTixian() {
      // 活动时间
      if (this.timeInfo.type) {
        this.showTime = true
        return false
      }
      if (this.user.left_money && this.user.left_money >= 0.1) {
        this.show = true
      } else {
        Toast('最低提现金额0.1元')
      }
    },
    goBack() {
      console.log('返回首页')
      toUrl(
        `/page?aid=${aid}&gid=${gid}`,
        `/free-order/home?aid=${aid}&gid=${gid}`
      )
    },
    // 提现
    async sub() {
      let reg = /^[0-9]+\.{0,1}[0-9]{0,2}$/
      let that = this
      if (!reg.test(that.price)) {
        Toast('请输入正确金额')
        return false
      }
      if (that.price < 0.1) {
        Toast('最低提现金额0.1元')
        return false
      }
      if (that.price > that.user.left_money) {
        Toast('账户可提现金额不够')
        return false
      }
      if (that.price > 200) {
        Toast('最大提现金额200元')
        return false
      }
      if (Date.now() - that.time < 2000) {
        return false
      }
      const result = await $ajax('post', '/free-order/transfer', {
        aid: aid,
        amount: that.price
      })
      that.time = Date.now()
      if (result.error_code === 0) {
        Toast('提现成功')
        that.page = 1
        that.getDataAgin()
        that.price = ''
        that.show = false
      }
      console.log(result)
    },
    // 上拉加载
    onScroll() {
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop
      let height = document.documentElement.clientHeight
      let scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight
      if (height + scrollTop > scrollHeight - 5 && this.canScroll) {
        this.canScroll = false
        this.page++
        this.getDataAgin('scroll')
      }
    }
  },
  destoryed() {
    window.removeEventListener('scroll', this.onScroll)
  }
}
</script>

<style scoped lang="less">
@url: '//dl.gamdream.com/activity/galan/chunjie/img/';
.wx {
  position: relative;
  width: 7.5rem;
  min-height: 12.1rem;
  .head {
    height: 3.65rem;
    background: #e82040;
    .top {
      padding: 0.3rem 0.3rem 0;
      margin-bottom: 0.17rem;
      .back {
        float: left;
        color: #ffc7d0;
        font-size: 0.28rem;
        i {
          display: inline-block;
          width: 0.24rem;
          height: 0.24rem;
          background: url('@{url}back.png') no-repeat;
          background-size: 100% auto;
          margin-right: 0rem;
          vertical-align: middle;
        }
      }
      .rule {
        color: #5a5a5a;
        float: right;
        font-size: 0.28rem;
        line-height: 0.4rem;
        color: #ffc7d0;
        i {
          display: inline-block;
          width: 0.24rem;
          height: 0.24rem;
          background: url('@{url}mao.png') no-repeat;
          background-size: 100% auto;
          margin-right: 0.1rem;
          vertical-align: middle;
        }
      }
    }
    .user {
      text-align: center;
      font-size: 0.24rem;
      color: #fff;
      margin-bottom: 0.15rem;
      img {
        width: 0.88rem;
        height: 0.88rem;
        border: 1px solid #fff;
        border-radius: 50%;
        margin-bottom: 0.08rem;
      }
      p {
        height: 0.24rem;
        line-height: 1;
      }
    }
    .nums {
      display: flex;
      position: relative;
      &::before {
        position: absolute;
        content: '';
        top: 50%;
        width: 1px;
        height: 0.32rem;
        background: #a21d33;
        left: 50%;
        margin-top: -0.16rem;
      }
      .item {
        flex: 1;
        text-align: center;
        font-size: 0.24rem;
        color: #ffc7d0;
        p {
          color: #fff2af;
          font-size: 0.56rem;
          height: 0.7rem;
          line-height: 0.7rem;
        }
      }
    }
  }
  .title {
    font-size: 0.3rem;
    color: #5a5a5a;
    padding: 0 0.2rem;
    background: #fff;
    line-height: 1.06rem;
    span {
      float: left;
      em {
        padding-left: 0.5rem;
        color: #fc1a7f;
      }
    }
    a {
      float: right;
      width: 1.6rem;
      height: 0.64rem;
      line-height: 0.64rem;
      text-align: center;
      color: #fff;
      background: #1aad18;
      border-radius: 0.1rem;
      margin-top: calc((1.06rem - 0.64rem) / 2);
    }
  }
  .background {
    height: 0.2rem;
    background: #f5f5f5;
  }
  .mc_t {
    color: #8d8d8d;
    line-height: 0.8rem;
    padding: 0 0.2rem;
    font-size: 0.3rem;
    background: #fff;
    i {
      display: inline-block;
      width: 0.3rem;
      height: 0.36rem;
      background: url('@{url}mao2.png') no-repeat;
      background-size: 100% auto;
      margin-right: 0.12rem;
      vertical-align: -0.06rem;
    }
  }
  .list {
    background: #fff;
    padding: 0 0.2rem;
    li {
      color: #5a5a5a;
      font-size: 0.28rem;
      height: 1.07rem;
      border-bottom: 1px solid #e9e9e9;
      -webkit-align-items: center;
      align-items: center;
      &:first-child {
        border-top: 1px solid #e9e9e9;
      }
      .left {
        span {
          color: #9a9a9a;
          font-size: 0.24rem;
        }
      }
      .price {
        text-align: right;
        color: #fc1a7f;
        font-size: 0.28rem;
        &.jian {
          color: #4cb95b;
        }
      }
    }
  }
  .rules {
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
    .con {
      width: 5.8rem;
      position: absolute;
      left: 50%;
      top: 50%;
      border-radius: 0.1rem;
      -webkit-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
      img {
        width: 100%;
      }
    }
  }
  .pop {
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
    //提现金额
    &.pop_money {
      position: absolute;
      background: none;
      .pop_mc {
        top: 2.8rem;
        -webkit-transform: translate(-50%, 0);
        transform: translate(-50%, -00);
      }
      &.show {
        background: rgba(0, 0, 0, 0);
      }
      .mask {
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        position: fixed;
        background: rgba(0, 0, 0, 0.8);
      }
    }
    //参与时间
    &.pop_time {
      .pop_mc {
        width: 5.4rem;
        height: 3.8rem;
        border-radius: 0.1rem;
        text-align: center;
        padding: 0.44rem 0 0;
        .ico {
          display: block;
          width: 1rem;
          height: 0.94rem;
          background: url('@{url}pop_monney.png') no-repeat;
          background-size: 100% auto;
          margin-left: 2.33rem;
        }
        .titles {
          font-size: 0.3rem;
          color: #3f3f40;
          padding: 0.25rem 0 0.1rem;
          line-height: 1;
        }
        span {
          color: #7a7a7a;
          font-size: 0.24rem;
          line-height: 1;
          display: inline-block;
          margin-bottom: 0.2rem;
        }
        .over {
          padding: 0.25rem 0 0.1rem;
          p {
            font-size: 0.3rem;
            color: #3f3f40;
          }
        }
        .btn {
          display: block;
          width: 2.35rem;
          line-height: 0.7rem;
          border-radius: 0.7rem;
          margin: 0 auto;
          background: #f11f55;
          color: #fff;
          font-size: 0.3rem;
          text-align: center;
        }
      }
    }
    .pop_mc {
      position: absolute;
      width: 5.8rem;
      height: 4.2rem;
      background: #fff;
      left: 50%;
      top: 50%;
      -webkit-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
      padding: 0.4rem 0.4rem 0;
      box-sizing: border-box;
      line-height: 1;
      border-radius: 0.1rem;
      .tit {
        font-size: 0.22rem;
        margin-bottom: 0.25rem;
        color: #5a5a5a;
        em {
          color: #000;
          font-size: 0.3rem;
          margin-right: 0.06rem;
        }
      }
      .ins {
        margin-bottom: 0.3rem;
        position: relative;
        span {
          position: absolute;
          font-size: 0.72rem;
          color: #000;
          left: 0;
          top: 50%;
          -webkit-transform: translateY(-50%);
          transform: translateY(-50%);
        }
        input {
          width: 100%;
          padding-left: 0.72rem;
          box-sizing: border-box;
          line-height: 0.7rem;
          border: none;
          outline: none;
          font-size: 0.5rem;
        }
      }
      .tip {
        color: #7a7a7a;
        font-size: 0.24rem;
        margin-bottom: 0.4rem;
      }
      .save {
        display: block;
        border-radius: 0.08rem;
        background: #1aad18;
        text-align: center;
        color: #fff;
        cursor: pointer;
        font-size: 0.36rem;
        margin-bottom: 0.15rem;
        line-height: 0.75rem;
      }
      .tip1 {
        text-align: center;
        font-size: 0.24rem;
        color: #5a5a5a;
      }
    }
  }
}
</style>

