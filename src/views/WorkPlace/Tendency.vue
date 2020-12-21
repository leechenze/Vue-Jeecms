<template>
  <div class="workplace-tendency-container">
    <v-chart v-bind="chartOption()" :height="tendencyHeight" :data="Data" :scale="scale">
      <v-tooltip />
      <v-axis v-bind="axisOption({dataKey:'showTime'})"/>
      <v-axis v-bind="axisOption({dataKey:'temperature'})"/>
      <v-legend v-bind="legendOption()"/>
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
      Data: [],
      tendencyHeight: 400,
      scale: [{
        dataKey: 'showTime',
        min: 0,
        max: 1
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
        let sourceData = this.tendencyData
        let dv = new DataSet.View().source(sourceData)
        let obj = {}
        obj.type = 'fold'
        obj.fields = this.tendencyFields
        obj.key = 'city'
        obj.value = 'temperature'
        dv.transform(obj)
        this.Data = dv.rows
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

<style lang="scss">
.workplace-tendency-container{
  .g2-legend{
    left: auto!important;
    right: -24px!important;
    top: -65px!important;
    .g2-legend-list-item{
      i{
        position: relative;
      }
    }
  }
}
</style>
