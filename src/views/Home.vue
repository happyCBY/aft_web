<template>
  <div class="home">
    <div class="aft-home-header">
      <div class="aft-home-header-container">
        <div class="aft-home-header-left">
          <div class="aft-home-header-title">
            <div v-if="infoObj.issue">第 {{infoObj.issue}} 期正在销售，距本次销售结束倒计时</div>
            <div v-else>抢购暂未开始</div>
            <div class="aft-home-header-data aft-margin-top-large">
              <data-animation :initialVal="time[0]"
                              :needHide="false"
                              :numberNum="hours">
              </data-animation>
              :
              <data-animation :initialVal="time[1]"
                              :needHide="false"
                              :numberNum="2">
              </data-animation>
              :
              <data-animation :initialVal="time[2]"
                              :needHide="false"
                              :numberNum="2">
              </data-animation>
            </div>
          </div>
          <div>
            <el-progress :percentage="percentage" :stroke-width="10" :show-text="false"></el-progress>
            <div class="aft-home-header-progress aft-margin-top-middle">
              <div><span>本期限购数量：</span>{{infoObj.aft_raise|noDataFormat}} AFT</div>
              <div><span>本期可购数量：</span>{{infoObj.aft_left|noDataFormat}} AFT</div>
            </div>
          </div>
          <div class="aft-home-header-buy">
            <div style="flex: 1;margin-right: 40px;">
              <el-input
                class="aft-input"
                placeholder="请输入购买数量"
                maxlength="20"
                type="number"
                v-model="buyNum">
                <span slot="suffix" class="el-input__icon">AFT&nbsp;</span>
              </el-input>
              <div class="aft-home-header-progress aft-margin-top-middle">
                <div><span>需支付：</span>{{countPrice|noDataFormat}} USDT</div>
                <div><span>当前交易价：</span>1 AFT= {{infoObj.unit_price|noDataFormat}} USDT</div>
              </div>
            </div>
            <span class="aft-buy-btn" @click="goToBuy" v-if="infoObj.issue">立即抢购</span>
            <span class="aft-buy-btn aft-buy-disabled-btn" v-else>立即抢购</span>
          </div>
        </div>
        <img src="~$images/pic_banner_equipment.png" style="position: absolute;right: -10%">
      </div>
    </div>
    <div class="aft-home-buy-container">
      <div class="aft-home-buy-inside-container">
        <div class="aft-home-buy-box">
          <img src="~$images/ic_amount_limit.png" class="aft-home-buy-container-img">
          <div>
            <div class="aft-home-buy-title">本期限购数量</div>
            <div>{{infoObj.aft_raise|noDataFormat}} AFT</div>
          </div>
        </div>
        <div class="aft-home-buy-container-segmentation"></div>
        <div class="aft-home-buy-box">
          <img src="~$images/ic_amount_buy.png" class="aft-home-buy-container-img">
          <div>
            <div class="aft-home-buy-title">本期可购数量</div>
            <div>{{infoObj.aft_left|noDataFormat}} AFT</div>
          </div>
        </div>
        <div class="aft-home-buy-container-segmentation"></div>
        <div class="aft-home-buy-box">
          <img src="~$images/ic_amount_total.png" class="aft-home-buy-container-img">
          <div>
            <div class="aft-home-buy-title">每人累计限购数量</div>
            <div>{{infoObj.limit_purchase|noDataFormat}} AFT</div>
          </div>
        </div>
      </div>

    </div>
    <div class="aft-home-reward-container">
      <div  class="aft-home-reward-box">
        节点限时限量销售中
        <div class="aft-buy-btn" style="margin-top: 35px" @click="goToReward">邀请奖励</div>
      </div>
      <el-tabs v-model="activeName" @tab-click="changeType" class="aft-margin-top-large">
        <el-tab-pane label="抢购记录" name="purchase">
          <el-table
            v-loading="loading"
            element-loading-background="#424C6D"
            height="450"
            :data="purchaseData">
            <el-table-column width="70"></el-table-column>
            <el-table-column
              prop="issue"
              label="期数">
              <template slot-scope="scope">
                第{{scope.row.issue}}期
              </template>
            </el-table-column>
            <el-table-column
              prop="create_time"
              align="center"
              label="时间">
            </el-table-column>
            <el-table-column
              prop="unit_price"
              align="right"
              label="价格/USDT">
            </el-table-column>
            <el-table-column
              prop="buy_aft"
              align="right"
              label="数量/AFT">
            </el-table-column>
            <el-table-column
              prop="pay_usdt"
              align="right"
              label="金额/USDT">
            </el-table-column>
            <el-table-column
              width="80">
            </el-table-column>
            <div slot="append" class="aft-more-btn" @click="getMore" v-if="isShowMore">加载更多</div>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="解锁记录" name="unlock">
          <el-table
            v-loading="loading"
            :cell-style="cellStyle"
            element-loading-background="#424C6D"
            height="450"
            :data="unlockData"
            style="width: 100%">
            <el-table-column width="70"></el-table-column>
            <el-table-column
              prop="issue"
              label="期数">
              <template slot-scope="scope">
                第{{scope.row.issue}}期
              </template>
            </el-table-column>
            <el-table-column
              prop="create_time"
              align="center"
              label="时间">
            </el-table-column>
            <el-table-column
              prop="name"
              align="center"
              label="币种">
              AFT
            </el-table-column>
            <el-table-column
              prop="unlock_aft"
              align="right"
              label="解锁数量/AFT">
            </el-table-column>
            <el-table-column
              prop="sum_unlocked_aft"
              align="right"
              label="累计解锁/AFT">
            </el-table-column>
            <el-table-column
              prop="total_locked"
              align="right"
              label="总锁仓/AFT">
            </el-table-column>
            <el-table-column
              width="80">
            </el-table-column>
            <div slot="append" class="aft-more-btn" @click="getMore" v-if="isShowMore">加载更多</div>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div class="aft-home-rules-box" style="margin-bottom: 90px">
        <div class="aft-home-rules-title">抢购规则</div>
        <div v-html="roles"></div>
      </div>
    </div>
    <el-dialog
      title="需要支付"
      :visible.sync="centerDialogVisible"
      width="450px"
      center>
      <div class="dialog-content">{{countPrice}} <span>USDT</span></div>
      <span slot="footer" class="dialog-footer">
        <div class="aft-buy-btn" style="width: 300px;margin: 0 auto" @click="sureToBuy">立即抢购</div>
  </span>
    </el-dialog>
  </div>
</template>

<script>
// // @ is an alias to /src
import dataAnimation from '@/components/dataAnimation/dataAnimation'

export default {
  name: 'home',
  components: {
    dataAnimation
  },
  data () {
    return {
      time: [0, 0, 0],
      hours: 2,
      buyNum: '1',
      activeName: 'purchase',
      purchaseData: [],
      unlockData: [],
      roles: '',
      centerDialogVisible: false,
      path: {},
      loading: false,
      pageIndex: 1,
      pageSize: 10,
      // 在售情况
      infoObj: {},
      percentage: 0,
      isShowMore: true,
      timer: null
    }
  },
  created () {
    this.getOnSaleInfo()
    this.getBuyRecordList()
    this.getRaiseRule()
    this.timer = setInterval(() => {
      this.getOnSaleInfo()
    }, 1000)
  },
  mounted () {
    this.setTabTransform()
  },
  computed: {
    countPrice () {
      return parseFloat(this.buyNum * this.infoObj.unit_price).toFixed(4)
    }
  },
  methods: {
    setTabTransform () {
      var root = document.getElementsByClassName('el-tabs__active-bar')[0]
      root.style.transform = 'translateX(20px)'
    },
    //  抢购规则
    getRaiseRule () {
      window.$common.post('/api/common/raise-rule', {}, res => {
        if (res.retcode === 1) {
          this.roles = res.obj.raise_rule
        }
      })
    },
    //  在售情况
    getOnSaleInfo () {
      window.$common.post('/api/common/on-sale-info', {}, res => {
        if (res.retcode === 1) {
          this.infoObj = res.obj
          // 已售百分比计算
          this.percentage = 100 - (this.infoObj.aft_left / this.infoObj.aft_raise) * 100
          this.timeDown(this.infoObj.countdown_time)//  倒计时
        }
      })
    },
    //  加载更多
    getMore () {
      this.pageIndex++
      if (this.activeName === 'purchase') {
        this.getBuyRecordList()
      } else {
        this.getUnlockRecordList()
      }
    },
    // 获取抢购记录
    getBuyRecordList () {
      this.loading = true
      let args = {
        user_id: this.$route.query.user_id || '',
        user_name: this.$route.query.user_name || '',
        page_size: this.pageSize,
        page_index: this.pageIndex
      }
      window.$common.post('/api/user/buy-record', args, res => {
        this.loading = false
        if (res.retcode === 1) {
          if (res.obj.record_list.length < this.pageSize) {
            this.isShowMore = false
          } else {
            this.isShowMore = true
          }
          this.purchaseData = this.purchaseData.concat(res.obj.record_list)
        } else {
          this.$message.error(res.msg.prompt)
        }
      })
    },
    // 获取解锁记录
    getUnlockRecordList () {
      this.loading = true
      let args = {
        user_id: this.$route.query.user_id,
        user_name: this.$route.query.user_name || '',
        page_size: this.pageSize,
        page_index: this.pageIndex
      }
      window.$common.post('/api/user/unlock-record', args, res => {
        this.loading = false
        if (res.retcode === 1) {
          if (res.obj.record_list.length < this.pageSize) {
            this.isShowMore = false
          } else {
            this.isShowMore = true
          }
          this.unlockData = this.unlockData.concat(res.obj.record_list)
        } else {
          this.$message.error(res.msg.prompt)
        }
      })
    },
    cellStyle ({ columnIndex }) {
      if (columnIndex === 5) {
        return 'color:#4FC870'
      }
    },
    timeDown (endDateStr) {
      //  结束时间
      var endDate = new Date(endDateStr)
      //  当前时间
      var nowDate = new Date()
      //  相差的总秒数
      var totalSeconds = parseInt((endDate - nowDate) / 1000)
      var modulo = totalSeconds / (60 * 60)
      //  小时数
      var hours = Math.floor(modulo)
      this.hours = hours.toString().length > 2 ? hours.toString().length : 2
      modulo = totalSeconds % (60 * 60)
      //  分钟
      var minutes = Math.floor(modulo / 60)
      //  秒
      var seconds = modulo % 60
      this.time = [hours, minutes, seconds]
    },
    //  切换tab类型
    changeType () {
      this.pageIndex = 1
      if (this.activeName === 'purchase') {
        this.purchaseData = []// 切换tab清空数据
        this.getBuyRecordList()
        this.$nextTick(() => {
          this.setTabTransform()
        })
      } else {
        this.unlockData = []// 切换tab清空数据
        this.getUnlockRecordList()
      }
    },
    goToBuy () {
      if (!this.buyNum) {
        this.$message.warning('请输入购买数量')
        return
      }
      if (/^([1-9]\d*)?$/.test(this.buyNum) === false) {
        this.$message.warning('请输入购买数量为正整数的数量')
        return
      }
      this.centerDialogVisible = true
    },
    // 跳转到邀请奖励页
    goToReward () {
      this.$router.push({ path: '/reward', query: { user_id: this.$route.query.user_id, user_name: this.$route.query.user_name } })
    },
    //  确认购买
    sureToBuy () {
      let args = {
        aft: this.buyNum,
        usdt: this.countPrice,
        user_id: this.$route.query.user_id || '',
        user_name: this.$route.query.user_name || '',
        issue: this.infoObj.issue
      }
      window.$common.post('/api/user/buy-aft', args, res => {
        if (res.retcode === 1) {
          this.$message({
            message: '抢购成功',
            type: 'success'
          })
          this.centerDialogVisible = false
          this.changeType()// 触发切换tab事件 更新数据
        } else {
          this.$message.error(res.msg.prompt)
        }
      })
    }
  },
  destroyed () {
    if (this.timer) { //  如果定时器在运行则关闭
      clearInterval(this.timer)
    }
  }
}
</script>

<style lang="less" scoped>
  a{
    text-decoration: none;
  }
  .aft-input{
    /deep/input{
      color: white;
      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
      }
      &[type="number"]{
        -moz-appearance: textfield;
      }
    }
    /deep/.el-input__inner{
      background: rgba(255,255,255,0.05);
      border: 1px solid #BDBEC1;
      border-radius: 4px;
    }
  }
  .aft-buy-btn{
    background-image: linear-gradient(43deg, #00A3A9 0%, #005BEA 100%);
    border-radius: 22.5px;
    font-size: 18px;
    color: #FFFFFF;
    text-align: center;
    width: 250px;
    height: 40px;
    line-height: 40px;
    cursor: pointer;
  }
  .aft-buy-disabled-btn{
    background-image: none;
    background: #c3c3c3;
  }
  .aft-home-header{
    width: 100%;
    height: 530px;
    background:url("../assets/img/pic_banner_bg.jpg") no-repeat;
    background-size: cover;
    background-position: center center;
  }
  .aft-home-header-container{
    width: 1200px;
    margin: 0 auto;
    height: 100%;
    font-size: 15px;
    color: #FFFFFF;
    position: relative;
    .aft-flex-box(row,null,center)
  }
  .aft-home-header-left{
    width: 65%;
    height: 80%;
    .aft-flex-box(column,space-between,null);
    .aft-home-header-title{
      font-weight: bold;
      font-size: 30px;
    }
  }
  .aft-home-header-data{
    .aft-flex-box(row,null,center);
  }
  .aft-home-header-progress{
    .aft-flex-box(row,space-between,center);
    span{
      color: rgba(255,255,255,0.5);
    }
  }
  .aft-home-header-buy{
    .aft-flex-box(row,space-between,flex-start);
  }
  /deep/.el-progress-bar__outer{
    background-color: rgba(0,0,0,0.2);
  }
  /deep/.el-progress-bar__inner{
    background: linear-gradient(-90deg, #0E97C5 4%, #06AF7F 98%);;
  }
  .aft-home-buy-container{
    background: #191F32;
    padding: 28px 0;
    font-size: 20px;
    color: #FFFFFF;
    .aft-home-buy-inside-container{
      width: 1200px;
      margin: 0 auto;
      .aft-flex-box(row,space-between,center);
      .aft-home-buy-container-segmentation{
        width: 1px;
        height: 35px;
        background: #424C6D;
      }
      .aft-home-buy-box{
        .aft-flex-box(row,null,flex-start);
      }
    }
  }
  .aft-home-buy-container-img{
    width: 30px;
    margin-right: 10px;
  }
  .aft-home-buy-title{
    font-size: 15px;
    height: 30px;
    line-height: 30px;
    margin-bottom: 6px;
  }
  .aft-home-reward-container{
    width: 1200px;
    margin: 0 auto;
    color: #FFFFFF;
    background: url("../assets/img/pic_home_reward.jpg") no-repeat;
    background-position: top center;
    background-size: 100% auto;
    .aft-home-reward-box{
      height: 220px;
      font-size: 30px;
      font-weight: bold;
      .aft-flex-box(column,center,center);
    }
  }
  .aft-home-rules-box{
    margin-top: 50px;
    background: #191F32;
    padding: 17px 20px;
    color: #FFFFFF;
    font-size: 14px;
    .aft-home-rules-title{
      font-size: 18px;
      margin-bottom: @aft-large-height;
    }
  }
  .dialog-content{
    text-align: center;
    font-size: 30px;
    color: #242B32;
    span{
      font-size: 14px;
      color: #120014;
    }
  }
</style>
