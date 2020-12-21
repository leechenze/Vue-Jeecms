<template>
  <section class="social-WeChat-statistics-property">
    <section class="property">
      <p class="title">用户属性</p>
      <div class="annular">
        <div class="annular-box">
          <p class="smallTitle">性别分布</p>
          <v-chart :forceFit="true" :height="height" :data="attentionSexData" :scale="scale">
            <v-tooltip :showTitle="false" dataKey="name*number" />
            <v-axis />
            <v-legend dataKey="name" v-bind="legendOption"/>
            <v-pie position="number" :label="labelConfig" :select="false"
              :color="['name', ['#40ABFB', '#F07E92', '#FAD352']]"
            />
            <v-guide :type="guideOpts.type" :position="guideOpts.position"
          :content="guideOpts.content" :v-style="guideOpts.style" />
            <v-guide :type="totalGuideOpts.type" :position="totalGuideOpts.position"
          :content="totalGuideOpts.content" :v-style="totalGuideOpts.style" />
            <v-coord type="theta" :radius="1" :innerRadius="0.8" />
          </v-chart>
        </div>
        <i></i>
        <div class="annular-box">
          <p class="smallTitle">语言分布</p>
          <v-chart :forceFit="true" :height="height" :data="attentionData" :scale="scale">
            <v-tooltip :showTitle="false" dataKey="name*number" />
            <v-legend dataKey="name" v-bind="legendOption"/>
            <v-pie position="number"
              :color="['name', ['#56CA77', '#45A3FC', '#F0657D', '#FAD352']]"
              :select="false" :label="labelConfig"/>
            <v-guide :type="guideOpts.type" :position="guideOpts.position"
          :content="guideOpts.content" :v-style="guideOpts.style" />
            <v-guide :type="totalGuideOpts2.type" :position="totalGuideOpts2.position"
          :content="totalGuideOpts2.content" :v-style="totalGuideOpts2.style" />
            <v-coord type="theta" :radius="1" :innerRadius="0.8" />
          </v-chart>
        </div>
      </div>
      <div class="map">
        <p style="padding-left:30px;">省份分布</p>
        <div class="map-table">
          <territory class="china-box" :territoryList="territoryList"></territory>
          <base-table class="table-box"
            v-bind="list"
            @handleSizeChange="handleSizeChange"
            @handleCurrentChange="handleCurrentChange"
            @sortChange="handleSortChangeProvince"
          >
            <template #progress="scope">
              <div class='progress-wrap jee-bg-light' :style="{width: getProvinceNumberWidth(scope.scope.row.number)}"></div>
            </template>
          </base-table>
        </div>
      </div>
      <div class="map-city">
        <div class='title-wrap'>
          <p>城市分布</p>
          <el-select
            v-model="cityList.params.provinceName"
            popper-class="jee-border"
            placeholder="请选择"
            @change="handleChangeProvince"
          >
            <el-option v-for="(item, index) in provinceOptions"
              :key="index"
              :label="item.label"
              :value="item.label"/>
          </el-select>
        </div>
        <base-table class="table-box" v-bind="cityList"
          @sortChange="handleSortChangeCity"
        >
          <template #progress="scope">
            <div class='progress-wrap jee-bg-light' :style="{width: getCityNumberWidth(scope.scope.row.number)}"></div>
          </template>
        </base-table>
      </div>
    </section>
    <section class="bottom">
      <ul class="bottom-change" style="display:flex">
        <li>属性分布表</li>
        <li :class="{'jee-bg-light':property===1}" @click="property=1">性别</li>
        <li :class="{'jee-bg-light':property===2}" @click="property=2">语言</li>
        <li :class="{'jee-bg-light':property===3}" @click="property=3">城市</li>
        <li :class="{'jee-bg-light':property===4}" @click="property=4">省份</li>
      </ul>
      <div class="bottom-table">
        <p>详细数据</p>
        <base-table class="table-box" v-bind="detailedList1"
          v-if="property===1"
          :columns="detailColumns"
          @sortChange="handleSortChangeDetail1"
        ></base-table>
        <base-table class="table-box" v-bind="detailedList2"
          v-else-if="property===2"
          :columns="detailColumns"
          @sortChange="handleSortChangeDetail2"
        ></base-table>
        <base-table class="table-box" v-bind="detailedList3"
          v-else-if="property===3"
          :columns="detailColumns"
          @handleSizeChange="handleSizeChange3"
          @handleCurrentChange="handleCurrentChange3"
          @sortChange="handleSortChangeDetail3"
        ></base-table>
        <base-table class="table-box" v-bind="detailedList4"
          v-else-if="property===4"
          :columns="detailColumns"
          @handleSizeChange="handleSizeChange4"
          @handleCurrentChange="handleCurrentChange4"
          @sortChange="handleSortChangeDetail4"
        ></base-table>
      </div>
    </section>
  </section>
</template>

<script>
import territory from './Territory'
import baseTable from '@/components/mixins/baseTable'
import { mapGetters } from 'vuex'
const DataSet = require('@antv/data-set')
export default {
  mixins: [baseTable],
  components: {
    territory
  },
  data () {
    const guideOpts = {
      type: 'text',
      position: [ '50%', '50%' ],
      content: '0',
      style: {
        lineHeight: '24px',
        fontSize: '32',
        fill: '#333333',
        textAlign: 'center'
      }
    }
    return {
      legendOption: {
        useHtml: true,
        itemTpl: '<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}" style="cursor: pointer;font-size: 14px;padding-right: 6px">' + '<i class="g2-legend-marker" style="width:8px;height:8px;border-radius:50%;display:inline-block;background-color: {color};"></i>' + '<span class="g2-legend-text" style="padding-left:6px;color:#999999">{value}</span>' + '</li>'
      },
      guideOpts: {
        type: 'text',
        position: [ '50%', '64%' ],
        content: '总数',
        style: {
          lineHeight: '14px',
          fontSize: '14',
          fill: '#999999',
          textAlign: 'center'
        }
      },
      totalGuideOpts: guideOpts,
      totalGuideOpts2: guideOpts,
      territoryList: [],
      attentionData: [],
      attentionSexData: [],
      sourceData: [
      ],
      height: 350,
      pieStyle: {
        stroke: '#fff',
        lineWidth: 1
      },
      labelConfig: ['percent', {
        formatter: (val, item) => {
          return item.point.name + ': ' + val
        },
        textStyle: {
          fill: '#333333',
          fontSize: 14,
          fontWeight: 100
        }
      }],
      scale: [{
        dataKey: 'percent',
        min: 0,
        formatter: '.0%'
      }],
      provinceOptions: [
        {
          label: '北京',
          value: '北京'
        }
      ],
      cityList: {
        loading: false,
        params: {
          order: false,
          provinceName: '北京'
        },
        tableProps: {
          defaultSort: {
            prop: 'number',
            order: 'descending'
          }
        },
        columns: [
          {
            label: '城市',
            prop: 'name'
          },
          {
            label: '用户数',
            prop: 'number',
            sortable: 'custom',
            width: '100px'
          },
          {
            label: '',
            prop: 'progress',
            scopeType: 'slot'
          }
        ],
        showSelection: false,
        showPagination: false,
        showIndex: false
      },
      list: {
        tableProps: {
          defaultSort: {
            prop: 'number',
            order: 'descending'
          }
        },
        columns: [
          {
            label: '省份',
            prop: 'name',
            width: '150px'
          },
          {
            label: '用户数',
            prop: 'number',
            sortable: 'custom',
            width: '100px'
          },
          {
            label: '',
            prop: 'progress',
            scopeType: 'slot'
          }
        ],
        showSelection: false,
        showPagination: false,
        showIndex: false,
        showPaginationSimple: true
      },
      property: 1,
      detailedList1: {
        tableProps: {
          defaultSort: {
            prop: 'number',
            order: 'descending'
          }
        },
        loading: false,
        showSelection: false,
        showPagination: false,
        showIndex: false,
        data: [],
        params: {
          order: false
        }
      },
      detailedList2: {
        tableProps: {
          defaultSort: {
            prop: 'number',
            order: 'descending'
          }
        },
        loading: false,
        showSelection: false,
        showPagination: false,
        showIndex: false,
        data: [],
        params: {
          order: false
        }
      },
      detailedList3: {
        tableProps: {
          defaultSort: {
            prop: 'number',
            order: 'descending'
          }
        },
        loading: false,
        showSelection: false,
        showIndex: false,
        data: [],
        params: {
          order: false
        },
        pageNo: 1,
        pageSize: 10
      },
      detailedList4: {
        tableProps: {
          defaultSort: {
            prop: 'number',
            order: 'descending'
          }
        },
        loading: false,
        showSelection: false,
        showIndex: false,
        params: {
          order: false
        },
        data: [],
        pageNo: 1,
        pageSize: 10
      }
    }
  },
  computed: {
    ...mapGetters('app', ['chartOption', 'axisOption', 'legendOption', 'colorOption']),
    detailColumns () {
      let label = '名称'
      switch (this.property) {
        case 1:
          label = '性别'
          break
        case 2:
          label = '语言'
          break
        case 3:
          label = '城市'
          break
        case 4:
          label = '省份'
          break
        default:
          break
      }
      return [
        {
          label,
          prop: 'name'
        },
        {
          label: '用户数',
          prop: 'number',
          sortable: 'custom'
        },
        {
          label: '占比',
          prop: 'proportion',
          formatter: (row, column, cellValue, index) => cellValue + '%'
        }
      ]
    },
    getProvinceTotal () {
      let total = 0
      this.list.data.forEach(d => {
        total += d.number
      })
      return total
    },
    getCityTotal () {
      let total = 0
      this.cityList.data.forEach(d => {
        total += d.number
      })
      return total
    }
  },
  methods: {
    propertySearchs () {
      this.fetchwechatStatisticsSexCollect()// 性别
      this.fetchwechatStatisticsProvinceCollect()// 省份
      this.fetchwechatStatisticsCityCollect()// 城市
      this.fetchwechatStatisticsLgaCollect()// 语言
      this.fetchwechatStatisticsProvinceList()
      this.fetchwechatStatisticsProvinceAll()
      this.fetchwechatStatisticsCityAll()
    },
    // 性别分布
    fetchwechatStatisticsSexCollect () {
      this.detailedList1.loading = true
      this.$request.fetchwechatStatisticsSexCollect(this.detailedList1.params).then(res => {
        if (res.code === 200) {
          this.detailedList1.data = res.data
          let total = 0
          res.data.forEach(d => { total += d.number })
          this.totalGuideOpts.content = total + ''
          let dv = new DataSet.View().source(res.data)
          dv.transform({
            type: 'percent',
            field: 'number',
            dimension: 'name',
            as: 'percent'
          })
          this.attentionSexData = dv.rows
        }
        this.detailedList1.loading = false
      }).catch(() => {
        this.detailedList1.loading = false
      })
    },
    // 语言分布
    fetchwechatStatisticsLgaCollect () {
      this.detailedList2.loading = true
      this.$request.fetchwechatStatisticsLgaCollect(this.detailedList2.params).then(res => {
        if (res.code === 200) {
          this.detailedList2.data = res.data
          let total = 0
          res.data.forEach(d => { total += d.number })
          this.totalGuideOpts2.content = total + ''
          let dv = new DataSet.View().source(res.data)
          dv.transform({
            type: 'percent',
            field: 'number',
            dimension: 'name',
            as: 'percent'
          })
          this.attentionData = dv.rows
        }
        this.detailedList2.loading = false
      }).catch(() => {
        this.detailedList2.loading = false
      })
    },
    // 省份分布
    fetchwechatStatisticsProvinceCollect () {
      let params = {
        page: this.list.pageNo,
        size: this.list.pageSize,
        ...this.list.params
      }
      this.list.loading = true
      this.$request.fetchwechatStatisticsProvinceCollect(params).then(res => {
        if (res.code === 200) {
          this.territoryList = res.data.content
          this.list.data = res.data.content
          this.list.totalCount = res.data.totalElements
        }
        this.list.loading = false
      }).catch(() => {
        this.list.loading = false
      })
    },
    // 获取省份下拉
    fetchwechatStatisticsProvinceList () {
      this.$request.fetchwechatStatisticsProvinceList().then(res => {
        if (res.code === 200) {
          this.provinceOptions = res.data.map(d => {
            d.label = d.name
            d.value = d.name
            return d
          })
        }
      })
    },
    // 获取省份详细数据
    fetchwechatStatisticsProvinceAll () {
      let params = {
        page: this.detailedList4.pageNo,
        size: this.detailedList4.pageSize,
        ...this.detailedList4.params
      }
      this.detailedList4.loading = true
      this.$request.fetchwechatStatisticsProvinceCollect(params).then(res => {
        if (res.code === 200) {
          this.detailedList4.data = res.data.content
          this.detailedList4.totalCount = res.data.totalElements
        }
        this.detailedList4.loading = false
      }).catch(() => {
        this.detailedList4.loading = false
      })
    },
    // 城市汇总
    fetchwechatStatisticsCityCollect () {
      let params = {
        page: 1,
        size: 100,
        ...this.cityList.params
      }
      this.cityList.loading = true
      this.$request.fetchwechatStatisticsCityCollect(params).then(res => {
        if (res.code === 200) {
          this.cityList.data = res.data.content
        }
        this.cityList.loading = false
      }).catch(() => {
        this.cityList.loading = false
      })
    },
    // 获取城市详细数据
    fetchwechatStatisticsCityAll () {
      let params = {
        page: this.detailedList3.pageNo,
        size: this.detailedList3.pageSize,
        ...this.detailedList3.params
      }
      this.detailedList3.loading = true
      this.$request.fetchwechatStatisticsCityCollect(params).then(res => {
        if (res.code === 200) {
          this.detailedList3.data = res.data.content
          this.detailedList3.totalCount = res.data.totalElements
        }
        this.detailedList3.loading = false
      }).catch(() => {
        this.detailedList3.loading = false
      })
    },
    // 切换省
    handleChangeProvince () {
      this.fetchwechatStatisticsCityCollect()
    },
    // 省用户数宽度条
    getProvinceNumberWidth (number) {
      if (number && this.getProvinceTotal) {
        return 100 * number / this.getProvinceTotal + '%'
      }
      return 0
    },
    // 城市用户数宽度条
    getCityNumberWidth (number) {
      if (number && this.getCityTotal) {
        return 100 * number / this.getCityTotal + '%'
      }
      return 0
    },
    // 省排序
    handleSortChangeProvince  (column, prop, order) {
      this.list.params.order = order === 'ascending'
      this.fetchwechatStatisticsProvinceCollect()
    },
    // 城市排序
    handleSortChangeCity  (column, prop, order) {
      this.cityList.params.order = order === 'ascending'
      this.fetchwechatStatisticsCityCollect()
    },
    // 详细表排序
    handleSortChangeDetail1 (column, prop, order) {
      this.detailedList1.params.order = order === 'ascending'
      this.fetchwechatStatisticsSexCollect()
    },
    handleSortChangeDetail2 (column, prop, order) {
      this.detailedList2.params.order = order === 'ascending'
      this.fetchwechatStatisticsLgaCollect()
    },
    handleSortChangeDetail3 (column, prop, order) {
      this.detailedList3.params.order = order === 'ascending'
      this.fetchwechatStatisticsCityAll()
    },
    handleSortChangeDetail4 (column, prop, order) {
      this.detailedList4.params.order = order === 'ascending'
      this.fetchwechatStatisticsProvinceAll()
    },
    handleSizeChange (val) {
      this.list.pageSize = val
      this.fetchwechatStatisticsProvinceCollect()
    },
    handleCurrentChange (val) {
      this.list.pageNo = val
      this.fetchwechatStatisticsProvinceCollect()
    },
    handleSizeChange3 (val) {
      this.detailedList3.pageSize = val
      this.fetchwechatStatisticsCityAll()
    },
    handleCurrentChange3 (val) {
      this.detailedList3.pageNo = val
      this.fetchwechatStatisticsCityAll()
    },
    handleSizeChange4 (val) {
      this.detailedList4.pageSize = val
      this.fetchwechatStatisticsProvinceAll()
    },
    handleCurrentChange4 (val) {
      this.detailedList4.pageNo = val
      this.fetchwechatStatisticsProvinceAll()
    }
  },
  mounted () {
    this.propertySearchs()
    this.property = 1
  },
  watch: {
    property () {
      if (this.property === 1) {
        this.detailedList.data = this.genderList
      } else if (this.property === 2) {
        this.detailedList.data = this.languageList
      } else if (this.property === 3) {
        this.detailedList.data = this.territoryList
      } else if (this.property === 4) {
        this.detailedList.data = this.cityList.data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .social-WeChat-statistics-property{
    .bottom-table{
      p{
        color: #333333;
        margin-bottom: 19px;
      }
    }
    .bottom-change{
      background-color: #E8E8E8;
      li{
        line-height: 46px;
        color: #666666;
        padding: 0 20px;
        font-size: 14px;
        cursor: pointer;
      }
      .jee-bg-light{
        color: #FFFFFF;
      }
    }
    .bottom{
      border:1px solid rgba(232,232,232,1);
      border-radius:4px;
      margin-top: 30px;
      .bottom-table{
        padding: 20px;
      }
    }
    .map{
      .map-table{
        display: flex;
        .china-box{
          width: 50%;
          padding: 30px;
        }
        .table-box{
          width: 50%;
          padding: 30px;
        }
      }
    }
    .map-city{
      padding: 30px;
      .title-wrap{
        margin-bottom: 30px;
        display: flex;
        align-items: center;
        p{
          font-size: 18px;
          color: #333333;
          padding-right: 20px;
        }
      }
    }
    .map,
    .map-city{
      .progress-wrap{
        height: 15px;
      }
    }
    .property{
      border:1px solid rgba(232,232,232,1);
      border-radius:4px;
      .title{
        height:46px;
        background:rgba(250,250,250,1);
        border-bottom:1px solid rgba(232,232,232,1);
        color: #666;
        font-size: 16px;
        line-height: 50px;
        padding-left: 20px;
      }
      .annular{
        display: flex;
        .annular-box{
          width: 536px;
          .smallTitle{
            padding: 20px 30px;
            color: #333333;
            font-size: 18px;
          }
        }
        i{
          width:2px;
          height:243px;
          background:rgba(232,232,232,1);
          margin: 77px 0 66px 0;
        }
      }
    }
  }
</style>
