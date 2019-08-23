<template>
  <div id="data-animation">
    <div class="number-container">
      <template v-for="(item,index) in splitNumList">
        <numberScroll :ref="(maxWeight - index)" :key="index" :numberValue="item"
                      v-if="showList[index]"></numberScroll>
      </template>
    </div>
  </div>
</template>
<script>
import numberScroll from './numberScroll.vue'
export default {
  name: 'dataAnimation',
  components: {
    numberScroll
  },
  props: {
    numberNum: {
      require: true
    },
    initialVal: {
      require: true
    },
    needHide: {
      require: false
    }

  },
  data () {
    return {
      changeValue: 0,
      number: 0,
      splitNumList: [],
      maxWeight: 0,
      showList: []
    }
  },
  watch: {
    // 监视initialVal变化
    initialVal () {
      this.changeValue = this.initialVal - this.number
      this.addNumAllWeight()
      this.number = this.initialVal
      if (this.needHide) {
        this.judgeRedundant()
      }
    }
  },
  created () {
    this.maxWeight = this.numberNum - 1// 数字最大权重为数字个数减一
    this.number = this.initialVal // 赋初值
    this.splitNumList = this.splitNum(this.number, this.maxWeight)
    this.judgeRedundant()
  },
  mounted () {

  },
  methods: {
    handleAdd () {
      // this.addNumStepByStep(num);
      this.addNumAllWeight()
    },
    addNumByWeight (weight) {
      let weightStr = weight.toString() // 权值
      let maxWeight = this.maxWeight // 数字最大权值
      let oldVal = this.splitNumList[maxWeight - weight]

      if (this.splitNumList[maxWeight - weight] === 9) {
        this.splitNumList[maxWeight - weight] = 0
        this.$refs[weightStr][0].changeNum(oldVal, this.splitNumList[maxWeight - weight])
        this.addNumByWeight(++weight)
      } else {
        this.splitNumList[maxWeight - weight]++
        this.$refs[weightStr][0].changeNum(oldVal, this.splitNumList[maxWeight - weight])
      }
      // this.$refs[weightStr][0].addNum();
    },
    // 增加1
    addOne () {
      this.addNumByWeight(0)
    },
    // 数字一位位地增长
    addNumStepByStep (num) {
      this.number = parseInt(this.number) + parseInt(num)
      this.addNumByWeight(0)
      let i = 0
      let interval = 1
      interval = parseInt(2000 / num)
      interval = (parseInt(2000 / num) < 501) ? parseInt(2000 / num) : 500
      if (num) {
        setInterval(() => {
          if (i < num - 1) {
            i++
            this.addNumByWeight(0)
          } else {

          }
        }, interval)
      }
    },
    // 所有数字一起变化
    addNumAllWeight () {
      let newNumber = parseInt(this.number) + parseInt(this.changeValue)
      let newSplitNumList = []
      let that = this

      newSplitNumList = this.splitNum(newNumber, this.maxWeight)

      this.number = newNumber

      for (let index = newSplitNumList.length - 1; index > -1; index--) {
        let item = newSplitNumList[index]
        setTimeout(() => {
          if (parseInt(item) === parseInt(that.splitNumList[index])) {

          } else {
            that.$refs[that.maxWeight - index][0].changeNum(that.splitNumList[index], item)
            that.splitNumList[index] = item
          }
        }, (0 + 100 * (newSplitNumList.length - 1 - index)))
      }
      //                newSplitNumList.forEach((item,index)=>{
      //                    setTimeout(()=>{
      //                        if(parseInt(item) === parseInt(that.splitNumList[index])){
      //
      //                        }else{
      //                            that.$refs[that.maxWeight - index][0].changeNum(that.splitNumList[index],item);
      //                            that.splitNumList[index] = item;
      //                        }
      //                    },0);
      //                })
    },
    // 计算需要增加多少次
    countAddTimes (newVal, oldVal) {
      let times = 0
      if (newVal < oldVal) {
        times = newVal + 10 - oldVal
      } else {
        times = newVal - oldVal
      }

      return times
    },
    // 划分位数
    splitNum (number, maxWeight) {
      return (Array(maxWeight + 1).join(0) + number).slice(-maxWeight - 1).split('')
    },
    // 判断多余的位数
    judgeRedundant () {
      this.showList = []
      let NumString = this.number.toString()
      let NumStringLen = NumString.length

      for (let i = 0; i < this.maxWeight + 1; i++) {
        if (this.needHide) {
          this.showList.unshift((i + 1) <= NumStringLen)
        } else {
          this.showList.unshift(true)
        }
      }
    }
  }
}
</script>
<style scoped>
  #data-animation{
    display: inline-block;
  }
  .number-container {
    display: flex;
  }
</style>
