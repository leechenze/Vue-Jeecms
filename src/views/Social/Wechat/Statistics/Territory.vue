<template>
  <div >
    <div id="territory" style="width:600px;height:480px;"></div>
  </div>
</template>

<script>
import '@/../node_modules/echarts/map/js/china.js'
const echarts = require('echarts') // 引入中国地图数据
export default {
  data () {
    return {
    }
  },
  props: {
    territoryList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    territory () {
      var myChart = echarts.init(document.getElementById('territory'))
      var max = 0
      for (var i = 0; i < this.territoryList.length; i++) {
        if (this.territoryList[i].number > max) {
          max = this.territoryList[i].number
        }
      }
      var option = {
        title: {
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        visualMap: {
          min: 0,
          max: max,
          left: 'left',
          top: 'bottom',
          text: ['高', '低'], // 文本，默认为数值文本
          inRange: {
            color: ['#f0ffff', '#2993fc']
          },
          calculable: true
        },
        series: [
          {
            name: '浏览量',
            type: 'map',
            map: 'china',
            mapType: 'china',
            roam: false,
            itemStyle: {
              normal: {
                label: {
                  show: false
                },
                areaColor: '#cdcdcd',
                borderColor: '#ffffff',
                borderWidth: 1
              },
              emphasis: {
                label: {
                  show: true
                }
              }
            },
            data: []
          }
        ]
      }
      for (var t = 0; t < this.territoryList.length; t++) {
        this.territoryList[t].value = this.territoryList[t].number
      }
      option.series[0].data = this.territoryList
      myChart.setOption(option)
    }
  },
  mounted () {
    this.territory()
  },
  watch: {
    territoryList () {
      this.territory()
    }
  }
}
</script>

<style lang="scss">
</style>
