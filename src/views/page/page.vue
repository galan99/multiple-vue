<template>
  <div class="page" v-if="loadData">
    <Rule :options="ruleOptions"></Rule>
    <GameTime :gameTimeOps="gameTimeOptions"></GameTime>
    <div class="logo_box">
      <img src="//dl.gamdream.com/activity/galan/chunjie/img/logo.png" alt="">
    </div>

    <div class="swiper-inner" ref="swiper">
      <div class="swiper-wrapper" v-if="pageInfo.game_list && pageInfo.game_list.length">
        <div class="swiper-slide" v-for="(item, index) in pageInfo.game_list" :key="item.banner_url">
          <template v-if="index < 2">
            <img :src="item.banner_url" alt="">
          </template>
          <template v-else>
            <img :data-src="item.banner_url" class="swiper-lazy" alt="">
            <div class="swiper-lazy-preloader"></div>
          </template>
        </div>
      </div>
    </div>

    <div class="link_box">
      <a class="money" href="javascript:;" title="我的红包" @click="tiXian"></a>
      <a class="rule" href="javascript:;" title="活动规则"></a>
    </div>
    <div class="activity_box">
      <div class="item">
        <img src="//dl.gamdream.com/activity/galan/chunjie/img/li_1.png" alt="">
        <div class="text">
          <h3>天天签到抽红包</h3>
          <p>({{gameTimeOptions.text}})</p>
        </div>
        <div class="btn">
          <a class="over" v-if="pageInfo.sign_in_status == 1" href="javascript:;" title="已签到"></a>
          <a v-else href="javascript:;" @click="sign" title="签到"></a>
        </div>
      </div>
      <div class="item">
        <img src="//dl.gamdream.com/activity/galan/chunjie/img/li_2.png" alt="">
        <div class="text">
          <h3>敢买就敢免单</h3>
          <p>最高可免单100元</p>
        </div>
        <div class="btn" ><a href="javascript:;" @click="goCreate"></a></div>
      </div>
      <div class="item">
        <img src="//dl.gamdream.com/activity/galan/chunjie/img/li_3.png" alt="">
        <div class="text">
          <h3>新春锦鲤大礼</h3>
          <p>抽价值9888元礼包</p>
        </div>
        <div class="btn" ><a href="javascript:;" @click="goJinli"></a></div>
      </div>
    </div>
    <div class="winner_box">
      <div class="mt"><span>{{pageInfo.activity_data.participants}}</span>人正在抢红包</div>
      <div class="mc" id="winner_list">
        <ul :style="styleAnimation">
          <li v-for="(item, index) in winList" :key="index">
            <img :data-src="item.avatar_url" alt="" class="scroll-img">
            <p>{{item.nick_name}}</p>
            <span>在活动中抢了{{item.money}}元红包</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="share" @click="showShare = true"></div>

    <!--分享-->
    <div class="pops share_pop" :class="showShare?'show':''" @click="showShare = false">
      <img src="//dl.gamdream.com/activity/galan/chunjie/img/shareTop.png"/>
    </div>

    <!--获取红包-->
    <div class="pops mall_pop" :class="show?'show':''" @click="show = false" v-if="redInfo.game">
      <div class="pop_mc" @click.stop="show = true">
        <h3 class="type">天天签到领红包</h3>
        <div class="user">
          <img :src="redInfo.game.logo" alt="">
          <p>{{redInfo.game.name}}</p>
          <span>{{redInfo.red_packet.money > 0 ? '送你一个新春红包' : ''}}</span>
        </div>
        <template v-if="redInfo.red_packet.money > 0">
          <p class="tit">恭喜发财，大吉大利</p>
          <a href="javascript:;" class="open_one" @click.stop="handleOpen"></a>
        </template>
        <template v-else>
          <p class="tit">来晚了，红包派完了！</p>
          <a href="javascript:;" class="look_one" @click.stop="show = false">确认</a>
        </template>
      </div>
    </div>

    <!--打开红包-->
    <div class="pops open_red" :class="openRed?'show':''" @click="openRed = false" v-if="redInfo.game">
      <div class="pop_mc" @click.stop="openRed = true">
        <div class="red_bg">
          <div class="user">
            <img :src="redInfo.game.logo" alt="">
            <p>{{redInfo.game.name}}</p>
            <span>送你一个新春红包</span>
          </div>
          <p class="tit">￥<span>{{redInfo.red_packet.money}}</span></p>
          <a href="javascript:;" class="open_one" @click.stop="handleCode">关注公众号提现</a>
        </div>
      </div>
    </div>

    <!--关注游戏-->
    <div class="pops pop_game" :class="openCode?'show':''" @click="openCode = false" v-if="redInfo.game">
      <div class="pop_mc" @click.stop="openCode = true">
        <img :src="redInfo.game.qr_code_url" alt="">
      </div>
    </div>

    <!--锦鲤码开奖-->
    <div class="pops code_result_pop" :class="showOver?'show':''" @click="showOver = false">
      <div class="pop_mc">
        <img class="overpic" :src="resultpic"/>
      </div>
    </div>

    <!--游戏介绍-->
    <div class="pops open_game" :class="openGame?'show':''">
      <div class="pop_mc">
        <div class="close" @click="openGame = false"></div>
        <img class="bg" :src="gameInfo.background_url" alt="">
        <span class="play" v-if="gameInfo.video_url" @click.stop="showVideo('show')"></span>
        <div class="code">
          <img :src="gameInfo.qr_code_url" alt="">
          <div class="text">
            <h3>长按识别关注公众号</h3>
            <p>免费领取福利</p>
          </div>
        </div>
      </div>
    </div>

    <!--视频播放-->
    <div class="video-player" v-if="viedeoSrc">
      <div class="cl">
        <video class="video" webkit-playsinline="true" autoplay="" poster="" controls="" :src="viedeoSrc" @click.stop="showVideo('show')"></video>
        <div class="close" @click="showVideo('hide')"></div>
      </div>
    </div>

  </div>
</template>

<script>
import Rule from '@/components/Rule.vue' // 规则
import GameTime from '@/components/Gametime.vue' // 活动时间规则组件
import { $ajax, getQueryString, timeFormat, wxShare, toUrl } from '@/utils'
// import Loading from '@/components/loading'
// import Toast from '@/components/toast'

const aid = getQueryString('aid')
const gid = getQueryString('gid')

export default {
  name: 'help',
  components: {
    Rule,
    GameTime
  },
  data() {
    return {
      loadData: false, // 加载数据状态
      ruleOptions: {
        ruleStyle: {
          top: '5.95rem',
          width: '0.78rem',
          height: '1.57rem',
          background: `url(//dl.gamdream.com/activity/galan/chunjie/img/index_4.png) no-repeat`,
          backgroundSize: '100% auto',
          right: 0,
          border: 'none',
          textIndent: '-999em'
        },
        picUrl: '' // 规则图片
      },
      gameTimeOptions: {
        show: false, // 显示活动过期弹窗
        type: -1, // 1已结束 2未开始
        text: '' // 时间
      },
      winList: [], // 获奖者
      activeIndex: 0,
      timer: null,
      showShare: false, // 分享弹窗
      show: false, // 获取红包弹窗
      openRed: false, // 打开红包弹窗
      openGame: false, // 游戏介绍弹窗
      openCode: false, // 关注二维码弹窗
      gameInfo: {}, // 游戏信息
      viedeoSrc: '', // 视频地址
      pageInfo: {}, // 页面信息
      authInfo: {}, // 微信信息
      redInfo: {}, // 红包信息
      showOver: false, // 显示锦鲤开奖结果
      resultpic: '', // 锦鲤开奖图片
      swiperCompnent: null, // swiper三方插件
      canScroll: true,
      styleAnimation: {} // 动态滚动获奖者的样式
    }
  },
  created() {
    window._hmt.push([
      '_trackEvent',
      '新首页的访问人数',
      'click',
      '新春免单活动',
      1
    ])
    this.getData()
  },
  computed: {
    top() {
      return 'translateY(' + -this.activeIndex + 'px)'
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('scroll', this.lazyImg, false)
    })
  },
  methods: {
    lazyImg() {
      let that = this
      let maxHeight = document.querySelector('#winner_list').offsetTop
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      if (that.canScroll) {
        if (
          (window.innerHeight + scrollTop) > maxHeight ||
          maxHeight < window.innerHeight
        ) {
          that.canScroll = false
          document.querySelectorAll('.scroll-img').forEach(key => {
            key.src = key.dataset.src
            if (key.src) {
              key.removeAttribute('data-src')
            }
          })
        }
      }
    },
    async getData() {
      let that = this

      // 获取微信授权信息
      const auth = await $ajax('get', '/free-order/query-authorization', {
        aid: aid,
        gid: gid
      })

      if (auth.error_code === 0) {
        if (auth.data.needAuthorize * 1 === 1) {
          window.location.href = auth.data.authorize_url
          return false
        }
        this.authInfo = auth.data.wxUserInfo
      }
      console.log(auth)

      const result = await $ajax('get', '/free-order/home-for-ajax', {
        aid: aid,
        gid: gid
      })
      if (result.error_code === 0) {
        let {
          current_time,
          activity_data: { activity_rule, start_time, end_time, jl_result },
          loop_barrage_list
        } = result.data
        this.gameTimeOptions.text =
          timeFormat(start_time, 'month') + '-' + timeFormat(end_time, 'month')
        this.ruleOptions.picUrl = activity_rule
        this.pageInfo = result.data
        this.loadData = true

        if (jl_result && !localStorage.getItem('index_jl_result')) {
          localStorage.setItem('index_jl_result', jl_result)
          that.resultpic = jl_result
          that.showOver = true
        }

        // 活动时间
        if (current_time < start_time) {
          that.gameTimeOptions.type = 2
          that.gameTimeOptions.show = true
        }
        if (current_time > end_time) {
          that.gameTimeOptions.type = 1
          that.gameTimeOptions.show = true
        }

        this.$nextTick(() => {
          const container = this.$refs.swiper
          /* eslint-disable no-new */
          this.swiperCompnent = new Swiper(container, {
            // autoplay: 3000,
            lazyLoading: true,
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            loop: true,
            preventLinksPropagation: false,
            coverflow: {
              rotate: 25,
              stretch: -40,
              depth: 200,
              modifier: 1,
              slideShadows: false
            },
            onTap: function(swiper) {
              that.goPlay(swiper.realIndex)
            }
          })

          that.winList = loop_barrage_list.splice(0, 20)
          if (that.winList.length >= 4) {
            that.winList = that.winList.concat(that.winList)
            that.styleAnimation = {
              'animation-duration': parseInt(that.winList.length / 2.2) + 's',
              'webkit-animation-duration': parseInt(that.winList.length / 2.2) + 's'
            }
          } else {
            that.styleAnimation = {
              'animation': 'none',
              'webkit-animation-duration': 'none'
            }
          }
        })
      }
      console.log(result)

      // 分享
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
    // 无缝滚动
    scrollNews() {
      let maxHeight = document.documentElement.clientWidth / 750 * 53 * this.winList.length / 2
      let steps = () => {
        if (this.activeIndex < maxHeight) {
          this.activeIndex = this.activeIndex + 1
        } else {
          this.activeIndex = 0
        }
        requestAnimationFrame(steps)
      }
      steps()
    },
    // 签到
    async sign() {
      window._hmt.push([
        '_trackEvent',
        '签到按钮点击',
        'click',
        '新春免单活动',
        1
      ])
      const result = await $ajax('get', '/free-order/sign-in', {
        aid: aid,
        gid: gid
      })
      if (result.error_code === 0) {
        this.redInfo = result.data
        this.pageInfo.sign_in_status = 1
        this.show = true
      }
    },
    // 打开红包
    handleOpen() {
      this.show = false
      this.openRed = true
    },
    // 关注二维码
    handleCode() {
      this.show = false
      this.openRed = false
      this.openCode = true
    },
    // 创建免单
    goCreate() {
      window._hmt.push([
        '_trackEvent',
        '新首页发起抢免单',
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
    // 去提现
    tiXian() {
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
    // 查看游戏介绍详情
    goPlay(index) {
      this.pageInfo.game_list.forEach((el, idx) => {
        if (index === idx) {
          this.openGame = true
          this.gameInfo = el
        }
      })
      console.log(index)
    },
    // 游戏视频播放
    showVideo(type) {
      this.openGame = false
      if (type === 'show') {
        this.viedeoSrc = this.gameInfo.video_url
      } else {
        this.viedeoSrc = ''
      }
    },
    // 活动过期时间
    activityTime() {
      let that = this
      let { ts, activity_data } = that.pageInfo
      if (ts < activity_data.start_time) {
        that.gameTimeOptions.type = 2
        that.gameTimeOptions.show = true
        return false
      }
      if (ts > activity_data.end_time) {
        that.gameTimeOptions.type = 1
        that.gameTimeOptions.show = true
        return false
      }
    }
  },
  beforeDestroy: function() {
    this.swiperCompnent.destroy()
    window.removeEventListener('scroll', this.lazyImg, false)
  }
}
</script>

<style lang="less">
@url: '//dl.gamdream.com/activity/galan/chunjie/img/';
.page {
  position: relative;
  width: 7.5rem;
  overflow-x: hidden;
  background: url('@{url}index.jpg') no-repeat;
  background-size: 100% auto;
  height: 19.29rem;
  .logo_box {
    text-align: center;
    padding-top: 0.35rem;
    margin-bottom: 0.35rem;
    img {
      width: 5.56rem;
    }
  }
  .link_box a {
    position: absolute;
    top: 5.95rem;
    width: 0.78rem;
    height: 1.57rem;
    background: url('@{url}index_3.png') no-repeat;
    background-size: 100% auto;
    &.money {
      left: 0;
    }
    &.rule {
      right: 0;
      background-image: url('@{url}index_4.png');
      display: none;
    }
  }
  .activity_box {
    margin-bottom: 0.3rem;
    .item {
      background: url('@{url}index_1.png') no-repeat;
      background-size: 100% auto;
      width: 6.35rem;
      height: 2.27rem;
      margin: 0 auto;
      display: flex;
      align-items: center;
      img {
        width: 1.1rem;
        margin-left: 0.47rem;
      }
      .text {
        font-size: 0.24rem;
        color: #aa7944;
        h3 {
          color: #e62544;
          font-size: 0.36rem;
        }
        p {
          padding-left: 0.1rem;
        }
      }
      .btn {
        text-align: right;
        padding-right: 0.6rem;
        flex: 1;
        a {
          display: inline-block;
          width: 1.34rem;
          height: 0.83rem;
          background: url('@{url}ibtn_2.png') no-repeat;
          background-size: 100% auto;
        }
      }
      &:nth-of-type(1) {
        .btn a {
          &.over {
            background-image: url('@{url}ibtn_1.png');
          }
          background-image: url('@{url}sign.png');
        }
      }
      &:nth-of-type(2) {
        img {
          width: 1.46rem;
          margin-left: 0.36rem;
        }
      }
      &:nth-of-type(3) {
        img {
          width: 1.52rem;
          margin-left: 0.34rem;
        }
      }
    }
  }
  .winner_box {
    background: url('@{url}index_2.png') no-repeat;
    background-size: 100% auto;
    width: 6.35rem;
    height: 3.61rem;
    margin: 0 auto 0.2rem;
    .mt {
      font-size: 0.28rem;
      color: #fb203b;
      text-align: center;
      line-height: 0.88rem;
      margin-bottom: 0.3rem;
      span {
        font-size: 0.36rem;
        margin-right: 0.04rem;
      }
    }
    .mc {
      height: 2.06rem;
      overflow: hidden;
      @-webkit-keyframes scroll {
        0% {
          -webkit-transform: translateY(0);
          transform: translateY(0);
        }
        100% {
          -webkit-transform: translateY(-50%);
          transform: translateY(-50%);
        }
      }
      @keyframes scroll {
        0% {
          transform: translateY(0);
          transform: translateY(0);
        }
        100% {
          transform: translateY(-50%);
          transform: translateY(-50%);
        }
      }
      ul {
        -webkit-animation: scroll 5s linear 1.5s infinite forwards;
        animation: scroll 5s linear 1.5s infinite forwards;
      }
      li {
        display: flex;
        color: #734a1e;
        font-size: 0.2rem;
        align-items: center;
        padding-bottom: 0.13rem;
        padding-left: 1.3rem;
      }
      p {
        width: 1.1rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #aa7944;
        margin-right: 0.08rem;
      }
      img {
        width: 0.36rem;
        height: 0.36rem;
        border: 0.02rem solid #fff;
        border-radius: 50%;
        margin-right: 0.1rem;
      }
    }
  }
  .share {
    cursor: pointer;
    width: 3.91rem;
    height: 0.97rem;
    background: url('@{url}share.png') no-repeat;
    background-size: 100% auto;
    margin: 0 auto;
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
    background: rgba(0, 0, 0, 0.7);
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
      height: 8.5rem;
      background: #e82040 url('@{url}pop_4.png') center bottom no-repeat;
      background-size: 100% auto;
      text-align: center;
      .type {
        color: #fff5d1;
        font-size: 0.48rem;
        line-height: 0.6rem;
        padding: 0.46rem 0 0;
      }
      .user {
        padding-top: 0.55rem;
        margin-bottom: 0.6rem;
        font-size: 0.28rem;
        color: #ffd684;
        line-height: 0.4rem;
        img {
          width: 1.28rem;
          height: 1.28rem;
          border-radius: 50%;
          border: 0.04rem solid #fffbbf;
          margin-bottom: 0.14rem;
        }
        p {
          font-size: 0.36rem;
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
        margin-top: 0.4rem;
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
  // 开奖
  &.code_result_pop {
    .pop_mc {
      background: none;
      height: auto;
    }
    img {
      width: 100%;
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
        margin-bottom: 1.1rem;
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
  //引导分享
  &.share_pop {
    img {
      width: 7.5rem;
    }
  }
  // 游戏介绍
  &.open_game {
    .pop_mc {
      width: 6.4rem;
      height: 9.8rem;
      background: #000;
      border-radius: 0;
      overflow: hidden;
      position: relative;
      .close {
        position: absolute;
        width: 0.56rem;
        height: 0.56rem;
        top: 0;
        right: 0;
        background: url('@{url}vclose.png') rgba(0, 0, 0, 0.6) center no-repeat;
        background-size: 0.34rem auto;
      }
      .bg {
        width: 100%;
      }
      .play {
        width: 1.56rem;
        height: 0.6rem;
        position: absolute;
        left: 50%;
        bottom: 2.95rem;
        transform: translateX(-50%);
        background: url('@{url}play.png') no-repeat;
        background-size: 100% auto;
      }
      .code {
        position: absolute;
        width: 100%;
        bottom: 0.4rem;
        left: 0;
        display: flex;
        align-items: center;
        line-height: 0.5rem;
        img {
          width: 2.2rem;
          height: 2.2rem;
          margin: 0 0.38rem 0 0.9rem;
        }
        .text {
          font-size: 0.4rem;
          color: #fffdf6;
          h3 {
            font-size: 0.28rem;
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
  }
}
.video-player {
  position: fixed;
  left: 50%;
  top: 0;
  z-index: 999;
  width: 7.5rem;
  height: 100%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.5);
  .cl {
    position: absolute;
    width: 7.5rem;
    height: 5rem;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  video {
    width: 7.5rem;
    height: 5rem;
    background: #000;
  }
  .close {
    position: absolute;
    left: 50%;
    width: 0.8rem;
    height: 0.8rem;
    bottom: -1.5rem;
    transform: translateX(-50%);
    background: url('@{url}vclose.png') rgba(0, 0, 0, 0.6) center no-repeat;
    background-size: 0.4rem auto;
    border-radius: 100%;
  }
}
</style>
<style lang="less">
.swiper-inner {
  width: 100%;
  margin: 0 auto 1.1rem;
}
.swiper-slide {
  width: 5.4rem;
  height: 3.22rem;
  img {
    width: 5.4rem;
    height: 3.22rem;
    border-radius: 0.25rem;
  }
  img[src=''],
  img:not([src]) {
    opacity: 0;
    border: none;
    visibility: hidden;
    max-width: none;
  }
}
</style>



