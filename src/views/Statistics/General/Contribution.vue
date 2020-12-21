<template>
  <section class="member-Contribution-chart-wrap">
    <div class="pie-chart-title">总浏览量: <span>{{num || 0}} </span></div>
    <div style="width:100%;margin-left:2%;">
      <div class="graph" id="test" style="width: 400px; height: 280px"></div>
    </div>
  </section>
</template>
<script>
import searchHeader from '@/components/mixins/searchHeader'
import { mapGetters } from 'vuex'
var echarts = require('echarts')
export default {
  name: 'pie-chart',
  mixins: [searchHeader],
  props: {
    siteId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      num: '',
      dataInfo: [],
      tendencyHeight: 290,
      params: {
        siteId: null,
        startDate: '',
        endDate: '',
        time: []
      },
      pieOption: {
        legend: {
          show: false,
          orient: 'vertical',
          left: 'center'
        },
        // 设置canvas内部表格的内距
        grid: {
          x: 50,
          y: 50,
          x2: 50,
          y2: 60,
          borderWidth: 10
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        color: ['#6697F6', '#F5BF3D', '#667897', '#68D9AC', '#ADDE87', '#56CA77', '#86DEBF', '#47CBCA', '#8BD1E9', '#45A3FC', '#9765E2'],
        series: [
          {
            name: '',
            type: 'pie',
            radius: '65%',
            center: ['50%', '50%'],
            selectedMode: 'single',
            // roseType: 'area',
            data: [
              { value: 10, name: '其他页' },
              { value: 5, name: '栏目页' },
              { value: 15, name: '内容页' },
              { value: 25, name: '首页' }
            ],
            itemStyle: {
              normal: {
                label: {
                  textStyle: {
                    color: '#333',
                    fontSize: 14
                  }
                }
              }
            }
          }
        ]
      }
    }
  },
  watch: {
    siteId (newData) {
      if (newData) {
        this.params.siteId = newData
        this.getData()
      }
    }
  },
  computed: {
    ...mapGetters(['ownSiteOptions', 'currentSiteId'])
  },
  methods: {
    handPirButData (e, params) {
    },
    async getData () {
      const res = await this.$request.fetchstatisticsSitegeneralViews(this.params)
      console.log(res.data.sum)
      this.num = res.data.sum
      if (res.code === 200) {
        this.dataInfo = []
        let indexObj = {
          value: res.data.index,
          name: '首页'
        }
        let otherObj = {
          value: res.data.other,
          name: '其他'
        }
        let contentObj = {
          value: res.data.content,
          name: '内容页'
        }
        let channeltObj = {
          value: res.data.channel,
          name: '栏目页'
        }

        this.dataInfo.push(indexObj, otherObj, contentObj, channeltObj)
        this.showPie()
      }
    },
    initPie (pieOption) {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('test'))
      // 绘制图表
      myChart.setOption(pieOption)
    },
    showPie () {
      for (let i in this.dataInfo) {
        if (this.dataInfo[i].value === 0) {
          delete this.dataInfo[i]
        }
      }
      let pieOption = Object.assign({}, this.pieOption)
      pieOption.series[0].data = this.dataInfo
      this.initPie(pieOption)
    },
    handleSearchs () {

    },
    handleFocus () {
      this.params.time2 = ''
    }
  },
  activated () {
    this.getData()
  },
  mounted () {
    var myChart = echarts.init(document.getElementById('test'))
    let that = this
    myChart.on('click', function (params) {
      that.$emit('func', params)
    })
    this.params.siteId = this.currentSiteId
    this.$nextTick(async () => {
      await this.getData()
    })
  }
}
</script>
<style lang="scss" scoped>
  .member-Contribution-chart-wrap{
    .pie-chart-title{
      margin-top: 25px;
      font-size: 14px;
      color: #666666;
      text-align: center;
      span {
        color: #333333;
        font-size: 20px;
        font-weight: 700;
        margin-left: 5px;
      }
    }
  }
</style>
