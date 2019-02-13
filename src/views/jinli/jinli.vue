<template>
  <div class="jinli" v-if="loadData">
    <Rule :options="ruleOptions" text="锦鲤规则"></Rule>
    <div class="mt">
      <h3 class="tit"><img src="//dl.gamdream.com/activity/galan/chunjie/img/jtit.png"/></h3>
      <div class="time">
        <Timedown @timeEnd="timeEnd" v-if="pageInfo.prize_time > 0" :endTime="pageInfo.prize_time" :type="'jinli'"></Timedown>
        <template v-if="pageInfo.prize_time <= 0">
          <span>00</span>小时<span>00</span>分<span>00</span>秒开奖
        </template>
      </div>
      <div class="num">已有<span>{{pageInfo.join_peoples}}人</span>参与</div>
    </div>
    <div class="mc">
      <div class="have" v-if="pageInfo.jl_num && pageInfo.jl_num.length">
        <div class="top"><span>已获得锦鲤码</span></div>
        <ul class="list">
          <li v-for="(item,index) in pageInfo.jl_num" :key="index">
            <p class="num">{{item}}</p>
          </li>
        </ul>
      </div>
      <div class="no" v-else>
        <img src="//dl.gamdream.com/activity/galan/chunjie/img/no_1.png" alt="">
        <p>亲，你还未获得锦鲤码~</p>
      </div>
    </div>

    <div class="prize_box">
      <h3 class="tit">活动奖品</h3>
      <div class="pic">
        <img :src="prizepic"/>
      </div>
    </div>

    <!--锦鲤码开奖-->
    <div class="pop code_result_pop" :class="showOver?'show':''" @click="showOver = false">
      <div class="pop_mc">
        <img class="overpic" :src="resultpic"/>
      </div>
    </div>

  </div>
</template>

<script>
import { $ajax, getQueryString, wxShare } from '@/utils'
import Timedown from '@/components/Timedown.vue' // 倒计时组件
import Rule from '@/components/Rule.vue' // 规则组件

const aid = getQueryString('aid')
const gid = getQueryString('gid')

export default {
  name: 'jinli',
  components: {
    Timedown,
    Rule
  },
  data() {
    return {
      loadData: false, // 加载数据状态
      ruleOptions: {
        picUrl: '' // 规则图片
      },
      pageInfo: {},
      code: '',
      showRule: false, // 显示规则
      showOver: false, // 显示锦鲤开奖结果
      resultpic: '', // 锦鲤开奖图片
      prizepic: '' // 锦鲤奖品
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      window._hmt.push(['_trackEvent', '获得抽奖码的人数', 'click', '新春免单活动', 1])
      let that = this
      const result = await $ajax('post', '/free-order/jin-li-info', {
        aid: aid
      })
      if (result.error_code === 0) {
        that.pageInfo = result.data
        that.ruleOptions.picUrl = result.data.jl_rule
        that.prizepic = result.data.reward_pic
        that.loadData = true

        if (result.data.jl_result) {
          that.resultpic = result.data.jl_result
          that.showOver = true
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
    // 倒计时结束
    timeEnd() {
      this.pageInfo.prize_time = 0
      location.reload()
    }
  }
}
</script>

<style  lang="less">
@url: '//dl.gamdream.com/activity/galan/chunjie/img/';
.jinli {
  position: relative;
  width: 7.5rem;
  background: #E82040 url('@{url}jin_bg.png') no-repeat;
  background-size: 100% auto;
  min-height: 12.1rem;
  padding-bottom: 0.3rem;
  box-sizing: border-box;
  .mt {
    text-align: center;
    padding-top: 0.9rem;
    .tit {
      margin-bottom: 0.3rem;
      img {
        width: 3.46rem;
      }
    }
    .time {
      margin-bottom: 0.3rem;
      font-size: 0.28rem;
      color: #FFEFC7;
      height: 0.46rem;
      span {
        color: #333;
        font-size: 0.28rem;
        display: inline-block;
        height: 0.44rem;
        min-width: 0.44rem;
        padding: 0 0.05rem;
        box-sizing: border-box;
        line-height: 0.44rem;
        text-align: center;
        background: #FFEFC7;
        margin: 0 0.05rem;
        border-radius: 0.1rem;
      }
    }
    .num {
      margin-bottom: 0.4rem;
      font-size: 0.3rem;
      color: #F3BEC7;
      span {
        color: #FFEFC7;
      }
    }
  }
  .mc {
    margin: 0 auto 0.2rem;
    width: 6.9rem;
    min-height: 6.3rem;
    background: #FCF7EB;
    border-radius: 0.2rem;
    .have {
      padding-top: 0.34rem;
      .top {
        line-height: .44rem;
        font-size: 0.3rem;
        color: #333;
        text-align: center;
        position: relative;
        margin: 0 0.35rem .35rem;
        span {
          position: relative;
          z-index: 3;
          background: #FCF7EB;
          padding: 0 0.28rem;
        }
        &::before {
          position: absolute;
          content: '';
          height: 0px;
          border-top: 1px solid #949494;
          width: 80%;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }
      .list {
        text-align: center;
        margin-bottom: 0.2rem;
        li {
          width: 2.98rem;
          height: 1.46rem;
          background: url('@{url}ico2.png') no-repeat;
          background-size: 100% auto;
          text-align: center;
          margin: 0 0.15rem 0.22rem;
          display: inline-block;
          font-size: 0;
          line-height: 0;
          .num {
            font-size: 0.48rem;
            color:#FFF5D1;
            line-height: 1.46rem;
          }
        }
      }
    }
    .no {
      text-align: center;
      color: #5A5A5A;
      font-size: 0.3rem;
      line-height: 1;
      img {
        width: 2.25rem;
        padding: 1.1rem 0 0.25rem;
      }
    }
  }
  .prize_box{
    .tit{
      width:6.6rem;
      height:1.39rem;
      margin: 0 auto;
      text-align: center;
      color: #FFEFC7;
      font-size:.48rem;
      line-height: .66rem;
      text-indent: -9999em;
      background: url('@{url}jin_tit.png') center no-repeat;
      background-size: 100% auto;
    }
    .pic{
      width:6.6rem;
      margin:0 auto;
      background: #FCF7EB;
      min-height:.8rem;
      border-radius:.2rem;
      padding:.15rem;
      img{
        width:100%;
      }
    }
  }
  //锦鲤码弹窗
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
    // 锦鲤码开奖
    &.code_result_pop {
      z-index: 110;
      .pop_mc {
        background: none;
        height: auto;
      }
      .overpic {
        width: 100%;
      }
    }
    .pop_mc {
      position: absolute;
      left: 50%;
      top: 50%;
      -webkit-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
      background: #fefaef;
      text-align: center;
      line-height: 1;
      font-size: 0.36rem;
      width: 5.8rem;
      height: 7.16rem;
      .close {
        position: absolute;
        right: 0.15rem;
        top: 0.15rem;
        width: 0.6rem;
        height: 0.6rem;
      }
    }
  }
}
</style>
