<template>
  <div id="numberScroll" style="width: 40px;margin: 0 5px;">
    <div class="nwwest-roll number-back" id="nwwest-roll">
      <ul id="roll-ul" class="roll-ul">
        <li v-for="(item,index) in list" ref="rollul" :class="{anim:animate==true}" :key="index">
          <span class="name lcd-font">{{item}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'numberScroll',
  components: {},
  props: {
    numberValue: {
      require: true
    }
  },
  data () {
    return {
      animate: true,
      list: [0, 0],
      num: 0

    }
  },
  watch: {
    numberValue () {
      this.num = parseInt(this.numberValue)
      this.list = [this.num, this.num]
    }
  },
  created () {

  },
  mounted () {
    this.num = parseInt(this.numberValue)
    this.list = [this.num, this.num]
  },
  methods: {
    // 增加一位
    addNum () {
      // this.num++;
      this.scroll(this.num)
    },
    // 改变数字
    changeNum (from, to) {
      let con1 = this.$refs.rollul
      con1[0].style.marginTop = '-60px'
      this.animate = !this.animate

      this.num = to
      if (to > 10) {
        to = 0
      }
      this.list = [to, from]

      let timer = setTimeout(() => {
        con1[0].style.marginTop = '0px'
        this.animate = !this.animate
        clearTimeout(timer)
      }, 100)
    },
    formatter (num) {
      return num.toFixed(0)
    },

    startAnimate () {
      this.$refs.myNum.start()
    },

    scroll () {
      let con1 = this.$refs.rollul
      con1[0].style.marginTop = '-0.7px'
      this.animate = !this.animate

      let that = this

      let timer = setTimeout(() => {
        this.num++
        let num = this.num
        con1[0].style.marginTop = '0px'
        that.animate = !that.animate
        if (num === 10) {
          that.list = [0, num]
          that.num = 0
          num = 0
        } else {
          that.list = [num, num]
        }
        clearTimeout(timer)
      }, 15)
    }
  }
}
</script>
<style scoped>
  .nwwest-roll {
    height: 60px;
    overflow: hidden;
  }

  .roll-ul {
    text-align: center;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .nwwest-roll li {
    height: 60px;
    line-height: 60px;
  }

  .anim {
    transition: all 0.5s;
  }

  .lcd-font {
    font-size: 50px;
    color: #D8D8D8;
  }

  .number-back {
    background: url("../../assets/img/pic_time_bg.png");
    background-repeat: no-repeat;
    background-position-y: 50%;
  }
</style>
