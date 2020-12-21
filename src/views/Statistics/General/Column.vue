<template>
  <section class="member-columnTem-chart-wrap">
    <div style="width: 100%; height: 320px" v-show="dataInfoShowHide">
      <div class="graph" id="test2" style="width: 100%; height: 280px"></div>
    </div>
  </section>
</template>
<script>
import { mapGetters } from 'vuex'
var echarts = require('echarts')
export default {
  name: 'column',
  props: {
    siteId: {
      type: Number,
      default: null
    },
    funName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      funNameShow: '内容页',
      dataInfoShowHide: 'true',
      dataInfo: [],
      tendencyHeight: 290,
      params: {
        siteId: null,
        startDate: '',
        endDate: '',
        time: []
      },
      pieOption: {
        xAxis: {
          type: 'category',
          data: [],
          axisTick: {
            show: false,
            lineStyle: {
              color: '#000'
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#eee',
              fontWeight: 'normal'
            }
          },
          axisLabel: {
            show: true,
            interval: 0,
            textStyle: {
              fontSize: 14,
              color: '#333' // 坐标值得具体的颜色
            },
            formatter: function (value) {
              return (value.length > 4 ? (value.slice(0, 4) + '...') : value)
            }
            // triggerEvent: true // 设置为true后具有x轴文字过长，显示省略号，hover上去显示全部的功能
          }
        },
        grid: {
          x: 50,
          y: 10,
          x2: 0,
          y2: 10,
          containLabel: true
        },
        yAxis: {
          boundaryGap: [ 0.2, 0.2 ],
          type: 'value',
          splitLine: { // gird 区域中的分割线
            show: true, // 是否显示
            lineStyle: {
              color: '#E8E8E8',
              width: 1,
              type: 'dashed'
            }
          },
          axisTick: {
            show: false,
            alignWithLabel: true
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            show: true,
            interval: 0,
            textStyle: {
              fontSize: 14,
              color: '#999' // 坐标值得具体的颜色
            }
          }
        },
        // ---  提示框 ----
        tooltip: {
          show: true, // 是否显示提示框，默认为true
          trigger: 'axis', // 数据项图形触发
          axisPointer: { // 指示样式
            type: 'shadow',
            axis: 'auto',
            shadowStyle: { // 阴影指示器样式设置
              color: 'rgba(229, 235, 247, 0.7)' // 阴影颜色
            }
          },
          backgroundColor: '#FFFFFF', // 通过设置rgba调节背景颜色与透明度
          extraCssText: 'box-shadow: 0px 0px 20px 1px rgba(0,0,0,0.2);',
          padding: 10,
          borderRadius: 4, // 边框圆角
          formatter: function (value) {
            var htmlStr = '<div>'
            var color = value[0].color
            htmlStr += `<p style="font-size: 12px"> ${value[0].name}</p>`// 获取纵坐标的值
            htmlStr += '<span min-height: 16pt; font-size: 12pt; font-family: Consolas; ' + color + '></span>'
            htmlStr += `
              <div style="display: flex; align-items: center; font-size: 12px;">
                <div style="width: 6px; height: 6px; background: ${color}; border-radius: 50%"></div>
                <div style="margin-left: 4px; color: #666666; font-size: 12px;">
                  浏览量  <span  style="margin-left: 15px; color: #333"></span>${value[0].value}
                </div>
              </div>
            `
            return htmlStr
          },
          triggerEvent: true, // 设置为true后具有x轴文字过长，显示省略号，hover上去显示全部的功能
          textStyle: { // 提示框内容的样式
            color: '#666666'
          }
        },
        series: [{
          name: '内容发布',
          width: 'auto',
          legendHoverLink: true, // 是否启用图列 hover 时的联动高亮
          itemStyle: { // 图形的形状
            color: '#1DC4DE',
            normal: {
              color: '#1DC4DE',
              show: true,
              barBorderRadius: [2, 2, 0, 0],
              label: {
                show: true,
                position: 'top',
                textStyle: {
                  color: '#333333',
                  fontSize: 14
                }
              }
            }
          },
          emphasis: {
            itemStyle: {
            }
          },
          barWidth: 40, // 柱形的宽度
          data: [],
          type: 'bar',
          showBackground: false,
          backgroundStyle: {
            color: 'rgba(220, 220, 220, 0.8)'
          }
        }]
      }
    }
  },
  watch: {
    siteId (newData) {
      if (newData) {
        this.params.siteId = newData
        this.getData()
      }
    },
    'funName': function (newData) {
      if (newData) {
        this.funNameShow = newData
        this.getData()
      }
    }
  },
  computed: {
    ...mapGetters('app', ['chartOption', 'axisOption', 'legendOption', 'colorOption'])
  },
  methods: {
    async getData () {
      const res = await this.$request.fetchstatisticsSitegeneralViews(this.params)
      if (res.code === 200) {
        this.dataInfo = res.data
        this.showPie()
      }
    },
    initPie (pieOption) {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('test2'))
      myChart.resize({
        width: 1050
      })
      // 绘制图表
      myChart.setOption(pieOption)
    },
    showPie () {
      let arr = []
      let pieOption = Object.assign({}, this.pieOption)
      if (this.funNameShow === '内容页') {
        if (this.dataInfo.contentList.length) {
          this.dataInfoShowHide = true
        } else {
          this.dataInfoShowHide = false
        }
        pieOption.series[0].data = this.dataInfo.contentList
        arr = this.dataInfo.contentList
        pieOption.xAxis.data = []
        for (let i in arr) {
          pieOption.xAxis.data.push(arr[i].name)
        }
      } else if (this.funNameShow === '栏目页') {
        if (this.dataInfo.channelList.length) {
          this.dataInfoShowHide = true
        } else {
          this.dataInfoShowHide = false
        }
        this.dataInfoShowHide = true
        pieOption.series[0].data = this.dataInfo.channelList
        arr = this.dataInfo.channelList
        pieOption.xAxis.data = []
        for (let i in arr) {
          pieOption.xAxis.data.push(arr[i].name)
        }
      } else {
        this.dataInfoShowHide = false
      }
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
    this.$nextTick(async () => {
      await this.getData()
    })
  }
}
</script>
<style lang="scss" scoped>
  .member-columnTem-chart-wrap{
    .pie-chart-title{
      margin-top: 10px;
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
