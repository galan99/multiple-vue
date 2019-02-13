import Mock from 'mockjs'
import * as common from './common'
import * as create from './create'
import * as on from './on'
import * as money from './money'
import * as jinli from './jinli'
import * as page from './page'

// 公共接口
Mock.mock(/\/free-order\/share-config/, 'get', common.share) // 授权信息
Mock.mock(/\/free-order\/withdraw-list/, 'post', common.winner) // 最新提现信息
Mock.mock(/\/free-order\/query-authorization/, 'get', common.auth) // 授权信息

// 首页
Mock.mock(/\/free-order\/home-for-ajax/, 'get', page.list) // 页面数据
Mock.mock(/\/free-order\/sign-in/, 'get', page.sign) // 签到

// 创建免单页面
Mock.mock(/\/free-order\/order-info/, 'post', create.list) // 页面数据
Mock.mock(/\/free-order\/create-activity-for-ajax/, 'post', create.create) // 创建免单

// 活动进行中页面
Mock.mock(/\/free-order\/index-for-ajax/, 'post', on.list) // 页面数据 on.list：自己  on.other：别人
Mock.mock(/\/free-order\/help/, 'post', on.help) // 去助力
Mock.mock(/\/free-order\/share-config/, 'post', on.share) // 活动分享

// 红包页面
Mock.mock(/\/free-order\/red-packet-list/, 'get', money.list) // 页面数据
Mock.mock(/\/free-order\/transfer/, 'post', money.getMoney) // 提现

// 锦鲤页面
Mock.mock(/\/free-order\/jin-li-info/, 'post', jinli.list) // 页面数据

export default Mock
