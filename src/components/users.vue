<template>
    <div class="list" id="users" v-if="show" v-cloak>
        <div class="item" v-for="(item,index) in list" :key="index" v-if="index < 15">
            <img class="pic" :src="item.avatar_url"/>
            <div class="text">
                <h3>{{item.nick_name}}</h3>
                <p>提现<span>{{item.money}}</span>元</p>
            </div>
        </div>
    </div>
</template>

<script>
var pageTimer = {}
export default {
  name: 'users',
  props: ['list'],
  data() {
    return {
      show: true
    }
  },
  mounted() {
    let _this = this
    setTimeout(() => {
      _this.timeMove()
    }, 1500)
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
        _this.show = false
        $('#users .item').removeClass('move')
        for (var key in pageTimer) {
          clearTimeout(pageTimer[key])
        }
      } else {
        _this.show = true
        setTimeout(() => {
          _this.timeMove()
        }, 1000)
      }
    })
  },
  methods: {
    timeMove() {
      $('#users .item').each(function(i) {
        var that = $(this)
        pageTimer[new Date().getTime()] = setTimeout(() => {
          $('.item')
            .eq(i)
            .addClass('move')
        }, 4000 * i)
        $(this)
          .get(0)
          .addEventListener('webkitAnimationEnd', function() {
            that.removeClass('move')
            pageTimer[new Date().getTime()] = setTimeout(() => {
              $('.item')
                .eq(i)
                .addClass('move')
            }, 4000 * $('#users .item').length - 7500)
          })
      })
    }
  }
}
</script>
<style  lang="less" scoped>
@-webkit-keyframes move {
  0% {
    left: -2.7rem;
    bottom: 0;
  }
  6.66%,
  46.66% {
    left: 0;
    bottom: 0;
  }
  53.33%,
  93.33% {
    left: 0;
    bottom: .84rem;
  }
  100% {
    left: 0;
    bottom: 1.48rem;
  }
}
@keyframes move {
  0% {
    left: -2.7rem;
    bottom: 0;
  }
  6.66%,
  46.66% {
    left: 0;
    bottom: 0;
  }
  53.33%,
  93.33% {
    left: 0;
    bottom: .84rem;
  }
  100% {
    left: 0;
    bottom: 1.48rem;
  }
}

.move {
  -webkit-animation: move 7.5s linear forwards;
  animation: move 7.5s linear forwards;
}

.list {
  position: fixed;
  top: 2.85rem;
  left: 0.25rem;
  width: 1.96rem;
  z-index: 10;
  height: 1.48rem;
  overflow: hidden;
  background: none;
  .item {
    background:rgba(17,158,111,0.9);
    height: 0.64rem;
    border-radius: 0.64rem;
    width: 1.96rem;
    display: -webkit-flex;
    display: flex;
    color: #fff;
    font-size: 0.2rem;
    -webkit-align-items: center;
    align-items: center;
    position: absolute;
    bottom: 0;
    left: -2.8rem;
    will-change: transform;
    span {
      color: #ffd777;
    }
    .pic {
      width: 0.42rem;
      height: 0.42rem;
      border-radius: 50%;
      margin: 0 0.12rem;
    }
    .text {
      width: 1.6rem;
      overflow: hidden;
    }
    h3,
    p {
      font-size: 0.2rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>