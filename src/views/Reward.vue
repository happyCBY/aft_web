<template>
  <div class="reward">
    <div class="aft-breadcrumb-header">
      <div class="aft-breadcrumb-container">
        <div class="aft-breadcrumb-box">
          <div>
            <span style="cursor: pointer" @click="back">活动</span>
            <span> > </span>
            <span>邀请奖励</span>
          </div>

          <span class="aft-breadcrumb-rule-btn" @click="showRules">查看活动规则</span>
        </div>
        <div class="aft-reward-container">
          <div class="aft-reward-box">
            <img src="~$images/ic_reward_period.png" class="aft-reward-container-img">
            <div>
              <div class="aft-reward-title">本期获得奖励</div>
              <div class="aft-reward-price">{{inviteObj.now||0}} <span>USDT</span></div>
            </div>
          </div>
          <div class="aft-reward-box">
            <img src="~$images/ic_reward_total.png" class="aft-reward-container-img">
            <div>
              <div class="aft-reward-title">累积获得奖励</div>
              <div class="aft-reward-price">{{inviteObj.sum||0}} <span>USDT</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <img src="~$images/ic_reward_arrow.png" class="aft-reward-arrow-img">
    <el-tabs v-model="activeName" @tab-click="changeType" style="margin-bottom: 90px">
      <el-tab-pane label="奖励记录" name="record">
        <el-table
          v-loading="loading"
          element-loading-background="#424C6D"
          height="450"
          :data="recordData"
          style="width: 100%">
          <el-table-column width="60">
          </el-table-column>
          <el-table-column
            prop="issue"
            label="期数">
            <template slot-scope="scope">
              第{{scope.row.issue}}期
            </template>
          </el-table-column>
          <el-table-column
            prop="direct_rake_back"
            align="right"
            width="200"
            label="直接奖励/USDT">
            <template slot-scope="scope">
              {{scope.row.direct_rake_back|noDataFormat}}
            </template>
          </el-table-column>
          <el-table-column
            prop="indirect_rake_back"
            align="right"
            label="间接奖励/USDT">
            <template slot-scope="scope">
              {{scope.row.indirect_rake_back|noDataFormat}}
            </template>
          </el-table-column>
          <el-table-column
            width="80">
          </el-table-column>
          <div slot="append" class="aft-more-btn" @click="getMore" v-if="isShowMore">加载更多</div>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="奖励排名" name="rank">
        <el-table
          v-loading="loading"
          element-loading-background="#424C6D"
          height="450"
          :data="rankData">
          <el-table-column width="60">
          </el-table-column>
          <el-table-column
            prop="user_name"
            label="用户账号">
          </el-table-column>
          <el-table-column
            prop="invite_num"
            label="邀请人数/人">
          </el-table-column>
          <el-table-column
            prop="sum_rake_back"
            align="right"
            label="累计奖励/USDT">
          </el-table-column>
          <el-table-column>
          </el-table-column>
          <el-table-column
            prop="address"
            label="排名">
            <template slot-scope="scope">
              <div class="aft-ranking-tr">
                <span>第{{scope.row.rank}}名</span>
                <img src="~$images/ic_ranking_first.png" class="aft-ranking-icon" v-if="scope.row.rank==1">
                <img src="~$images/ic_ranking_second.png" class="aft-ranking-icon" v-else-if="scope.row.rank==2">
                <img src="~$images/ic_ranking_third.png" class="aft-ranking-icon" v-else-if="scope.row.rank==3">
                <img src="~$images/ic_ranking_topten.png" class="aft-ranking-icon" v-else-if="scope.row.rank>=4&&scope.row.rank<=10">
              </div>
            </template>
          </el-table-column>
          <div slot="append" class="aft-more-btn" @click="getMore" v-if="isShowMore">加载更多</div>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      title="邀请规则"
      :visible.sync="centerDialogVisible"
      width="800px"
      center>
      <div v-html="rules" class="aft-dialog"></div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'home',
  data () {
    return {
      activeName: 'record',
      recordData: [],
      rankData: [],
      centerDialogVisible: false,
      rules: '',
      loading: false,
      pageIndex: 1,
      pageSize: 10,
      inviteObj: {},
      isShowMore: true
    }
  },
  created () {
    this.getNowInviteInfo()
    this.getInviteInfo()
    this.getRakeBackRecord()
  },
  mounted () {
    this.setTabTransform()
  },
  methods: {
    setTabTransform () {
      var root = document.getElementsByClassName('el-tabs__active-bar')[0]
      root.style.transform = 'translateX(20px)'
    },
    //  邀请奖励规则
    getRakeBackRule () {
      window.$common.post('/api/common/rake-back-rule', {}, res => {
        if (res.retcode === 1) {
          this.rules = res.obj.rake_back_rule
        }
      })
    },
    // 获取本期奖励信息
    getNowInviteInfo () {
      let args = {
        user_id: this.$route.query.user_id || '',
        user_name: this.$route.query.user_name || '',
        is_current_issue: 1
      }
      window.$common.post('/api/user/invite-info', args, res => {
        if (res.retcode === 1) {
          this.inviteObj = Object.assign(this.inviteObj, {
            now: res.obj.get_usdt
          })
        } else {
          this.$message.error(res.msg.prompt)
        }
      })
    },
    // 获取累计奖励信息
    getInviteInfo () {
      let args = {
        user_id: this.$route.query.user_id || '',
        user_name: this.$route.query.user_name || '',
        is_current_issue: -1
      }
      window.$common.post('/api/user/invite-info', args, res => {
        if (res.retcode === 1) {
          this.inviteObj = Object.assign(this.inviteObj, {
            sum: res.obj.get_usdt
          })
        } else {
          this.$message.error(res.msg.prompt)
        }
      })
    },
    //  切换tab类型
    changeType () {
      this.pageIndex = 1
      if (this.activeName === 'record') {
        this.recordData = []
        this.getRakeBackRecord()
        this.$nextTick(() => {
          this.setTabTransform()
        })
      } else {
        this.rankData = []
        this.getRakeBackRank()
      }
    },
    //  加载更多
    getMore () {
      this.pageIndex++
      if (this.activeName === 'record') {
        this.getRakeBackRecord()
      } else {
        this.getRakeBackRank()
      }
    },
    //  显示规则弹窗
    showRules () {
      this.getRakeBackRule()
      this.centerDialogVisible = true
    },
    // 获取奖励排名
    getRakeBackRank () {
      this.loading = true
      let args = {
        is_current_issue: 1,
        page_index: this.pageIndex,
        page_size: this.pageSize
      }
      window.$common.post('/api/user/rake-back-rank', args, res => {
        this.loading = false
        if (res.retcode === 1) {
          if (res.obj.rank_list.length < this.pageSize) {
            this.isShowMore = false
          } else {
            this.isShowMore = true
          }
          this.rankData = this.rankData.concat(res.obj.rank_list)
        } else {
          this.$message.error(res.msg.prompt)
        }
      })
    },
    // 获取返佣记录
    getRakeBackRecord () {
      this.loading = true
      let args = {
        user_id: this.$route.query.user_id || '',
        user_name: this.$route.query.user_name || '',
        page_index: this.pageIndex,
        page_size: this.pageSize
      }
      window.$common.post('/api/user/rake-back-record', args, res => {
        this.loading = false
        if (res.retcode === 1) {
          if (res.obj.record_list.length < this.pageSize) {
            this.isShowMore = false
          } else {
            this.isShowMore = true
          }
          this.recordData = this.recordData.concat(res.obj.record_list)
        } else {
          this.$message.error(res.msg.prompt)
        }
      })
    },
    back () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less" scoped>
  .aft-ranking-icon{
    width: 25px;
    margin-left: 20px;
  }
  .el-tabs{
    width: 1200px;
    margin: 0 auto;
    margin-top: 40px;
  }
  .aft-reward-container-img{
    width: 40px;
    margin-right: 20px;
  }
  .aft-breadcrumb-header{
    width: 100%;
    height: 400px;
    background:url("../assets/img/pic_reward_banner.jpg") no-repeat;
    background-size: cover;
    background-position: center center;
  }
  .aft-breadcrumb-container{
    width: 1200px;
    margin: 0 auto;
    height: 100%;
    font-size: 15px;
    color: #FFFFFF;
    .aft-flex-box(column,space-around,center);
    .aft-breadcrumb-box{
      width: 100%;
      .aft-flex-box(row,space-between,center);
    }
    .aft-breadcrumb-rule-btn{
      color: #06AF7F;
      text-decoration: underline;
      cursor: pointer;
    }
  }
  .aft-ranking-tr{
    .aft-flex-box(row,null,center);
  }
  .aft-reward-container{
    width: 100%;
    .aft-flex-box(row,space-between,center);
    .aft-reward-box{
      width: 35%;
      padding: 48px 54px;
      border-radius: 10px;
      .aft-flex-box(row,null,flex-start);
      &:first-child{
        background:url("../assets/img/pic_reward_period_bg.jpg") no-repeat;
        background-position: center center;
        background-size: 100%;
      }
      &:last-child{
        background:url("../assets/img/pic_reward_total_bg.jpg") no-repeat;
        background-position: center center;
        background-size: 100%;
      }
      .aft-reward-title{
        height: 40px;
        line-height: 40px;
        font-size: 30px;
      }
      .aft-reward-price{
        margin-top: 40px;
        font-size: 50px;
        span{
          font-size: 35px;
        }
      }
    }
  }
  .aft-reward-arrow-img{
    width: 60px;
    display: block;
    margin: 0 auto;
    margin-top: -40px;
  }
  .aft-dialog{
    max-height: 400px;
    overflow: scroll;
  }
</style>
