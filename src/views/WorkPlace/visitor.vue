<template>
  <div>
    <v-chart :forceFit="true" :height="height" :data="rateData" :scale="scale">
      <v-coord type="polar" :startAngle="-202.5" :endAngle="22.5" :radius="1"></v-coord>
      <v-axis
        dataKey="value"
        :zIndex="2"
        :line="null"
        :label="axisLabel"
        :subTickCount="4"
        :subTickLine="axisSubTickLine"
        :tickLine="axisTickLine"
        :grid="null"
      ></v-axis>
      <v-axis dataKey="1" :show="false"></v-axis>
      <v-series
        gemo="point"
        position="value*1"
        shape="pointer"
        color="#1890FF"
        :active="false"
      ></v-series>
      <v-guide
        type="arc"
        :zIndex="0"
        :top="false"
        :start="arcGuide1Start"
        :end="arcGuide1End"
        :vStyle="arcGuide1Style"
      ></v-guide>
      <v-guide
        type="arc"
        :zIndex="1"
        :start="arcGuide2Start"
        :end="arcGuide2End"
        :vStyle="arcGuide2Style"
      ></v-guide>
      <v-guide
        type="html"
        :position="htmlGuidePosition"
        :html="htmlGuideHtml"
      ></v-guide>
    </v-chart>
  </div>
</template>

<script>
import { registerShape } from 'viser-vue'
import { mapGetters } from 'vuex'
import { mul } from '@/utils'

registerShape('point', 'pointer', {
  draw (cfg, container) {
    var point = cfg.points[0]
    var center = this.parsePoint({
      x: 0,
      y: 0
    })
    var target = this.parsePoint({
      x: point.x,
      y: 0.7
    })
    var dirVec = {
      x: center.x - target.x,
      y: center.y - target.y
    }
    // normalize
    var length = Math.sqrt(dirVec.x * dirVec.x + dirVec.y * dirVec.y)
    dirVec.x *= 1 / length
    dirVec.y *= 1 / length
    // rotate dir_vector by -90 and scale
    var angle1 = -Math.PI / 2
    var x1 = Math.cos(angle1) * dirVec.x - Math.sin(angle1) * dirVec.y
    var y1 = Math.sin(angle1) * dirVec.x + Math.cos(angle1) * dirVec.y
    // rotate dir_vector by 90 and scale
    var angle2 = Math.PI / 2
    var x2 = Math.cos(angle2) * dirVec.x - Math.sin(angle2) * dirVec.y
    var y2 = Math.sin(angle2) * dirVec.x + Math.cos(angle2) * dirVec.y
    // polygon vertex
    var path = [['M', target.x + x1 * 1, target.y + y1 * 1], ['L', center.x + x1 * 3, center.y + y1 * 3], ['L', center.x + x2 * 3, center.y + y2 * 3], ['L', target.x + x2 * 1, target.y + y2 * 1], ['Z']]
    var tick = container.addShape('path', {
      attrs: {
        path: path,
        fill: '#999'
      }
    })
    return tick
  }
})
export default {
  data () {
    return {
      height: 200,
      scale: [{
        dataKey: 'value',
        min: 0,
        max: 9,
        tickInterval: 1,
        nice: false
      }],
      axisLabel: {
        offset: -16,
        textStyle: {
          fontSize: 0,
          textAlign: 'center',
          textBaseline: 'middle'
        }
      },
      axisSubTickLine: {
        length: -8,
        stroke: '#fff',
        strokeOpacity: 1
      },
      axisTickLine: {
        length: -17,
        stroke: '#fff',
        strokeOpacity: 1
      },
      arcGuide1Start: [0, 1.24],
      arcGuide1End: [9, 1.24],
      arcGuide1Style: {
        stroke: '#CBCBCB',
        lineWidth: 10
      },
      arcGuide2Start: [0, 1.24],
      htmlGuidePosition: ['50%', '100%']
    }
  },
  computed: {
    ...mapGetters('app', ['chartOption', 'axisOption', 'legendOption', 'colorOption']),
    arcGuide2Style () {
      return {
        stroke: this.colorOption(0)[0],
        lineWidth: 10
      }
    },
    rateData () {
      return [{ value: this.rate > 9 ? 9 : this.rate }]
    },
    arcGuide2End () {
      return [this.rate > 9 ? 9 : this.rate, 1.24]
    },
    htmlGuideHtml () {
      const rate = mul(this.rate, 10).toFixed(2)
      return '<div style="width: 150px;text-align: center;"><p style="font-size: 18px;color: #333333;margin: 0;">' + rate + '%</p><p style="font-size: 14px;color: #999999;margin: 0;">' + this.label + '</p></div>'
    }
  },
  props: {
    rate: {
      type: Number,
      default: 0
    },
    label: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
