<template>
  <div>
    <v-chart v-bind="chartOption()" :height="tendencyHeight" :data="sourceData" :scale="scale">
      <v-tooltip />
      <v-axis v-bind="axisOption({dataKey:'showTime'})"/>
      <v-axis v-bind="axisOption({dataKey:'temperature'})"/>
      <v-legend />
      <v-smooth-line position="showTime*temperature" shape="smooth"
        :color="['city', colorOption(1)]"
      />
    </v-chart>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
const DataSet = require('@antv/data-set')
export default {
  data () {
    return {
      sourceData: [],
      tendencyHeight: 350,
      scale: [{
        dataKey: 'showTime'
      }]
    }
  },
  props: {
    tendencyData: {
      type: Array,
      default: () => {
        return []
      }
    },
    tendencyFields: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    ...mapGetters('app', ['chartOption', 'axisOption', 'legendOption', 'colorOption'])
  },
  methods: {
    getTendencyData () {
      if (this.tendencyData && this.tendencyFields) {
        let dv = new DataSet.View().source(this.tendencyData)
        dv.transform({
          type: 'fold',
          fields: this.tendencyFields, // "昨日浏览量" "今日浏览量"
          key: 'city',
          value: 'temperature'
        })
        // city:"昨日浏览量"
        // date:"0:00 - 0:59:59"
        // pv:0
        // showTime:"0"
        // temperature:0
        this.sourceData = dv.rows
      }
    }
  },
  mounted () {
    this.getTendencyData()
  },
  watch: {
    tendencyData () {
      this.getTendencyData()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
