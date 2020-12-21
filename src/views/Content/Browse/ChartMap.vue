<template>
  <section class="member-chart-pie-wrap">
    <div style="width:100%;padding-top: 20px;">
      <!-- <div class="graph" id="test" style="width: 100%; height: 300px"></div> -->
      <div id="territory" style="height:300px;"></div>
    </div>
  </section>
</template>
<script>
import '@/../node_modules/echarts/map/js/china.js' // 引入中国地图数据
var echarts = require('echarts')
export default {
  name: 'chartPie',
  props: {
    statisticsList: {
      type: Object,
      default: () => {
        return {}
      }
    },
    showData: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    statisticsList (item) {
      console.log(item)
      this.territoryTable(item)
    }
  },
  data () {
    return {
      typeList: {
        columns: [
          {
            label: '省份',
            prop: 'province',
            width: '220px'
          },
          {
            label: '参与人次',
            prop: 'value'
          },
          {
            label: '占比',
            prop: 'decimal',
            align: 'right',
            formatter: (row, column, cellValue, index) => cellValue + '%'
          }
        ],
        showSelection: false,
        showPagination: false,
        showIndex: false,
        data: []
      },
      params: {
        contentId: 1,
        startDate: '',
        endDate: '',
        time2: 1,
        time: []
      }
    }
  },
  computed: {
  },
  methods: {
    // 来源地域图表
    territoryTable (item) {
      this.mapList = item.map
      this.territory()
    },
    // 地图
    territory () {
      var myChart = echarts.init(document.getElementById('territory'))
      var max = 0
      var dataList = []
      for (var i = 0; i < this.mapList.length; i++) {
        var params = {
          name: this.mapList[i].name,
          value: this.mapList[i].value.toString()
        }
        dataList.push(params)
        if (this.mapList[i].value > max) {
          max = this.mapList[i].value
        }
      }
      var option = {
        title: {
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            var res = ''
            if (!params.value) {
              res = params.name + ': ' + 0
            } else {
              res = params.name + ': ' + params.value
            }
            return res
          }
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
            zoom: 1.2,
            // name: this.mapName,
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
            data: dataList
          }
        ]
      }
      myChart.setOption(option)
      this.typeList.data = this.mapList
    },
    handFirstData () {
    }
  },
  activated () {
  },
  mounted () {
    this.$nextTick(() => {
    })
  }
}
</script>
<style lang="scss" scoped>
  .member-chart-pie-wrap{
  }
</style>
