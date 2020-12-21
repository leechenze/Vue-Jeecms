<template>
  <section class="member-chart-pie-wrap">
    <div style="width:100%;padding-top: 20px;">
      <div class="graph" id="test" style="width: 100%; height: 300px"></div>
    </div>
  </section>
</template>
<script>
var echarts = require('echarts')
export default {
  name: 'chartPie',
  props: {
    statisticsList: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    statisticsList (item) {
      this.showPie(item)
    }
  },
  data () {
    return {
      params: {
        contentId: 1,
        startDate: '',
        endDate: '',
        time2: 1,
        time: []
      },
      pieOption: {
        legend: {
          show: true,
          orient: 'vertical',
          left: -5
        },
        grid: {
          left: '0%',
          right: '30%',
          top: '52px',
          bottom: '0%',
          containLabel: true
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        color: ['#45A3FC', '#47CBCA'],
        series: [
          {
            name: '访问量',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [],
            label: {
              show: false
              // position: 'center'
            }
          }
        ]
      }
    }
  },
  computed: {
  },
  methods: {
    initPie (pieOption) {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('test'))
      // 绘制图表
      myChart.setOption(pieOption)
    },
    showPie (item) {
      let pieOption = Object.assign({}, this.pieOption)
      let data = []
      if (!item.pc) {
        item.pc = 0
      }
      if (!item.mobile) {
        item.mobile = 0
      }
      let a = {
        name: '计算机',
        value: item.pc
      }
      let b = {
        name: '移动设备',
        value: item.mobile
      }
      data.push(a, b)
      console.log(data)
      pieOption.series[0].data = data
      this.initPie(pieOption)
    },
    handFirstData () {
    }
  },
  activated () {
  },
  mounted () {
    this.$nextTick(async () => {
    })
  }
}
</script>
<style lang="scss" scoped>
  .member-chart-pie-wrap{
  }
</style>
