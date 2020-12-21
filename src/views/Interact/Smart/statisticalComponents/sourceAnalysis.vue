<template>
  <!-- 来源分析详情 -->
  <section class="interact-smart-source-analyz ">
    <section class="map" style="display:flex">
      <div class="sourceDevice">
        <p class="titleDevice">来源设备</p>
        <div>
          <div id="device" ref="device" style="height:450px"></div>
        </div>
      </div>
      <div class="geographyChart scrollbar">
        <div style="display:flex;min-width:1080px">
          <p class="titlegeography">来源地域</p>
          <div style="flex:1">
            <div id="territory" style="height:500px;"></div>
          </div>
          <div style='width:519px;height: 495px;overflow-x: hidden;overflow-y: overlay;'>
            <base-table v-bind="typeList"></base-table>
          </div>
        </div>
      </div>
    </section>
    <!-- 趋势分析 -->
    <div style="padding:30px 0 50px 0 ">
      <p class="trendAnalysis">趋势分析</p>

        <search-header
      class="search-header"
        v-bind="searchHeaders"
        :params="params"
        @handleSearch="handleSearchs"
        @handleFocus='handleFocus'
        @handleSenior="handleSenior"
      ></search-header>
      <div class="trendChart">
        <v-chart :forceFit="true" :height="lineHeight" :data="typeLineData" :scale='lineScale' :padding="[50, 50, 50, 50]">
          <v-tooltip/>
          <v-axis v-bind="axisOption({dataKey:'time'})"/>
          <v-axis v-bind="axisOption({dataKey:'参与人数'})"/>
          <v-line position="time*参与人数" :size="2" shape="smooth"
            :color="[colorOption(0)]"
          />
          <v-area position="time*参与人数" shape="smooth" :color="[colorOption(0)]"/>
        </v-chart>
      </div>
    </div>
  </section>
</template>

<script>
import baseTable from '@/components/mixins/baseTable'
import searchHeader from '@/components/mixins/searchHeader'
import '@/../node_modules/echarts/map/js/china.js' // 引入中国地图数据
import { mapActions, mapGetters } from 'vuex'
import { getData } from '@/utils'
const DataSet = require('@antv/data-set')
const echarts = require('echarts')
export default {
  name: 'sourceAnalysis',
  mixins: [baseTable, searchHeader],
  data () {
    return {
      params: {
        province: '',
        pc: '',
        times: [],
        time: 1,
        showType: 1,
        areaIds: [''],
        id: this.$route.query.id,
        day: 0,
        senior: false
      },
      pieOption: {
        legend: {
          type: 'scroll',
          orient: 'vertical',
          left: 20,
          top: 0,
          bottom: 260
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)',
          confine: true
        },
        color: ['#5DB1FF', '#59D4D4', '#68D48C', '#FBDB5A', '#F47E92', '#A97BE9', '#7072D8', '#435188'],
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '80%',
            center: [105, 285],
            hoverAnimation: false,
            label: {
              position: 'inside',
              color: '#333333',
              formatter: '{d}%'
            },
            data: []
          }
        ]
      },
      typeLineData: [],
      lineScale: [{
        dataKey: 'value',
        min: 0
      }, {
        dataKey: 'year',
        min: 0
      }],
      lineHeight: 454,
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
      mapList: [],
      searchHeaders: {
        searchItems: [
          {
            type: 'cutButton',
            value: 'time',
            label: '时间:',
            options: [
              {
                label: '今日 ',
                value: 1
              },
              {
                label: '昨天',
                value: 2
              },
              {
                label: '最近7天',
                value: 3
              },
              {
                label: '最近30天',
                value: 4
              }
            ]
          },
          {
            type: 'dataPicker',
            rangeText: '-',
            value: 'times'
          },
          {
            type: 'cutButton',
            value: 'showType',
            class: 'z-hidden-md-and-down',
            label: '显示方式:',
            options: [
              {
                label: '按时 ',
                value: 1
              },
              {
                label: '按日',
                value: 2
              },
              {
                label: '按周',
                value: 3,
                disabled: (form) => {
                  return (form.time && form.time < 4) || (!form.time && form.day < 8)
                }
              },
              {
                label: '按月',
                value: 4,
                disabled: (form) => {
                  return !!form.time || (!form.time && form.day < 32)
                }
              }
            ]
          },
          {
            type: 'cascader',
            value: 'areaIds',
            label: '地域：',
            options: [],
            class: 'z-hidden-md-and-down',
            style: {
              width: '114px'
            },
            props: {
              label: 'areaName',
              value: 'areaCode',
              checkStrictly: true
            }
          },
          {
            type: 'cutButton',
            value: 'pc',
            label: '设备:',
            options: [
              {
                label: '全部 ',
                value: ''
              },
              {
                label: '计算机',
                value: 1
              },
              {
                label: '移动设备',
                value: 0
              }
            ],
            hiddenKey: 'senior',
            hiddenValue: true
          },
          {
            type: 'senior',
            value: 'senior'
          }
        ]
      }
    }
  },
  methods: {
    ...mapActions('system', ['FetchSystemAreaTree']),
    getData,
    // 饼状图
    getTypePieData () {
      this.$request.fetchSmartFormStatisticDevice({ id: this.$route.query.id }).then(res => {
        var sourceData = []
        if (res.code === 200) {
          let arr = [{ name: '移动端', key: 'mobileCount' }, { name: 'PC端', key: 'pcCount' }]
          for (let i = 0; i < arr.length; i++) {
            var obj = {}
            obj.value = res.data[arr[i].key]
            obj.name = arr[i].name
            sourceData.push(obj)
          }
          this.pieOption.series[0].data = sourceData
          // 基于准备好的dom，初始化echarts实例
          var pieChart = echarts.init(this.$refs['device'])
          // 绘制图表
          console.log(sourceData, this.pieOption)
          pieChart.setOption(this.pieOption)
        }
      })
    },
    // 折线图
    getTypeLineData (sourceData) {
      let list = []
      sourceData.map(function (val) {
        let obj = {
          time: val.time,
          '参与人数': val.count
        }
        list.push(obj)
      })
      let dv = new DataSet.View().source(list)
      dv.transform({
        type: 'fold',
        fields: ['参与人数'],
        key: 'city',
        value: '参与人数'
      })
      this.typeLineData = dv.rows
    },
    // 来源地域图表
    territoryTable () {
      this.mapList = []
      this.$request.fetchSmartFormStatisticProvince({ id: this.$route.query.id }).then(res => {
        if (res.code === 200) {
          for (var i = 0; i < res.data.length; i++) {
            var item = {
              province: res.data[i].province,
              value: res.data[i].dataCount,
              decimal: res.data[i].ratio,
              name: res.data[i].province
            }
            this.mapList.push(item)
          }
          this.territory()
        }
      })
    },
    // 地图
    territory () {
      var myChart = echarts.init(document.getElementById('territory'))
      var max = 0
      var dataList = []
      for (var i = 0; i < this.mapList.length; i++) {
        var params = {
          name: this.mapList[i].province,
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
    // 搜索列表
    handleSearchs () {
      if (this.params.time) {
        if (this.params.time === 1) {
          this.params.beginTime = this.getData(0)
          this.params.endTime = this.getData(0)
        } else if (this.params.time === 2) {
          this.params.beginTime = this.getData(1)
          this.params.endTime = this.getData(1)
        } else if (this.params.time === 3) {
          this.params.beginTime = this.getData(6)
          this.params.endTime = this.getData(0)
        } else if (this.params.time === 4) {
          this.params.beginTime = this.getData(29)
          this.params.endTime = this.getData(0)
        }
      } else if (this.params.times === null) {
        this.params.time = 1
        this.params.times = []
        this.params.beginTime = this.getData(0)
        this.params.endTime = this.getData(0)
      }
      if (this.params.times.length === 2 && !this.params.time) {
        this.params.beginTime = this.params.times[0]
        this.params.endTime = this.params.times[1]
        this.getTimeData(this.params.times, 'day')
      } else if (this.params.beginTime) {
        this.params.times = [this.params.beginTime, this.params.endTime]
      }
      this.fetchChartTrend()
    },
    getTimeData (arr, diffType) {
      // startTime, endTime, diffType
      let startTime = arr[0]
      let endTime = arr[1]
      // 将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式
      startTime = startTime.replace(/\-/g, '/')
      endTime = endTime.replace(/\-/g, '/')
      // 将计算间隔类性字符转换为小写
      diffType = diffType.toLowerCase()
      var sTime = new Date(startTime) // 开始时间
      var eTime = new Date(endTime) // 结束时间
      // 作为除数的数字
      var divNum = 1
      switch (diffType) {
        case 'second':
          divNum = 1000
          break
        case 'minute':
          divNum = 1000 * 60
          break
        case 'hour':
          divNum = 1000 * 3600
          break
        case 'day':
          divNum = 1000 * 3600 * 24
          break
        default:
          break
      }
      let day = this.params.day = parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum))
      switch (day) {
        case 0:
          if (this.params.beginTime === this.getData(0)) {
            this.params.time = 1
          } else if (this.params.beginTime === this.getData(1)) {
            this.params.time = 2
          }
          break
        case 6:
          if (this.params.beginTime === this.getData(6)) {
            this.params.time = 3
          }
          break
        case 29:
          if (this.params.beginTime === this.getData(29)) {
            this.params.time = 4
          }
          break
        case 30:
          if (this.params.beginTime === this.getData(30)) {
            this.params.time = 4
          }
          break
        default:
          this.params.time = 0
      }
    },
    handleFocus () {
      this.params.time = 0
    },
    // 折线图
    fetchChartTrend () {
      let { areaIds, ...params } = this.params
      if (areaIds instanceof Array && areaIds.length) {
        params.province = areaIds[0]
        params.city = areaIds[1] || ''
      } else {
        params.province = ''
      }
      delete params.areaIds
      delete params.times
      this.$request.fetchSmartFormStatisticTrend(params).then(res => {
        if (res.code === 200) {
          this.getTypeLineData(res.data)
        }
      })
    }
  },
  watch: {
    areaOptions (newData) {
      this.searchHeaders.searchItems.find(d => d.value === 'areaIds').options = [
        {
          areaName: '所有',
          areaCode: ''
        },
        ...newData
      ]
    },
    'params.senior': function (newData) {
      const cls1 = newData ? '' : 'z-hidden-md-and-down'
      this.searchHeaders.searchItems.find(d => d.value === 'areaIds').class = cls1
      this.searchHeaders.searchItems.find(d => d.value === 'showType').class = cls1
    }
  },
  mounted () {
    this.params.id = this.$route.query.id
    this.FetchSystemAreaTree()
    this.searchHeaders.searchItems.find(d => d.value === 'areaIds').options = [
      {
        areaName: '所有',
        areaCode: ''
      },
      ...this.areaOptions
    ]
    this.getTypePieData()
    this.territoryTable()
    this.fetchChartTrend()
  },
  activated () {
    this.params.id = this.$route.query.id
    this.getTypePieData()
    this.territoryTable()
    this.fetchChartTrend()
  },
  computed: {
    ...mapGetters('app', ['axisOption', 'colorOption']),
    ...mapGetters(['areaOptions'])
  }
}
</script>

<style lang="scss">
.interact-smart-source-analyz{
  overflow-y: overlay;
  overflow-x: overlay;
  width: 100%;
  .map{
    padding-top: 20px;
    .sourceDevice{
      width: 212px;
      min-width: 212px;
      height: 537px;
      margin-right: 9px;
      box-sizing: border-box;
      border: 1px solid #E8E8E8;
      border-radius:4px;
      color: #333333;
      .titleDevice{
        font-size: 16px;
        min-width: 65px;
        padding: 20px 0 14px 20px;
        line-height: 1;
      }
    }
    .geographyChart{
      flex: 1;
      overflow: auto hidden;
      // width: 1338px;
      // min-width: 1080px;
      height: 537px;
      padding: 20px 20px 20px 20px;
      box-sizing: border-box;
      border: 1px solid #E8E8E8;
      border-radius:4px;
      color: #333333;
      .titlegeography{
        font-size: 16px;
        min-width: 65px;
        line-height: 1;
      }
    }
  }
  .trendAnalysis{
    color: #333333;
    font-size: 16px;
    line-height: 1;
    padding: 0 0 20px 0;
  }
  .trendChart{
    height: 454px;
    border:1px solid #E8E8E8;
    border-radius:4px;
  }
}
</style>
