<template>
  <section class="s-datetimerange-preview s-draggable-preview">
    <el-form-item
      :label="option.label"
      :prop="option.name"
      :rules="getRules"
    >
      <!-- 日期 -->
      <el-date-picker :style="(deviceTab === 2?{width: option.width+'%'}:{width: '100%'})"
      class="vaule"
        v-if="option.type === 'date'"
        v-model="val"
        type="daterange"
        :appendToBody='false'
        range-separator="至"
        start-placeholder="请选择"
        end-placeholder="请选择"
        align='right'
        placeholder="选择日期">
      </el-date-picker>
      <!-- 时间 -->
      <el-time-picker :style="(deviceTab === 2?{width: option.width+'%'}:{width: '100%'})"
        v-else-if="option.type === 'time'"
        class="vaule"
        v-model="val"
        is-range
        range-separator="至"
        start-placeholder="请选择"
        end-placeholder="请选择"
        :appendToBody='false'
        align='right'
        placeholder="选择时间范围">
      </el-time-picker>
      <!-- 日期+时间 -->
      <el-date-picker :style="(deviceTab === 2?{width: option.width+'%'}:{width: '100%'})"
        v-else-if="option.type === 'datetime'"
        v-model="val"
        class="vaule"
        range-separator="至"
        start-placeholder="请选择"
        end-placeholder="请选择"
        type="datetimerange"
        :appendToBody='false'
        align='right'
        placeholder="选择日期时间">
      </el-date-picker>
      <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
    </el-form-item>
  </section>
</template>

<script>
import moment from 'moment'
import previewMixin from '@/components/draggable/Mixin/previewMixin'

export default {
  name: 'SdatetimerangePreview',
  mixins: [previewMixin],
  computed: {
    getDateType () {
      switch (this.option.format) {
        case 'yyyy':
          return 'year'
        case 'MM':
          return 'month'
        case 'yyyy-MM':
          return 'month'
        default:
          return 'date'
      }
    },
    getFormat () {
      switch (this.option.type) {
        case 'date':
          return this.option.format
        case 'time':
          return this.option.accuracy
        case 'datetime':
        default:
          return [this.option.format, this.option.accuracy].join(' ')
      }
    },
    val: {
      get () {
        let datetime
        if (typeof (this.value) === 'string' && this.value.indexOf('-') !== -1) {
          datetime = this.value
        } else {
          datetime = typeof (this.value) === 'string' ? parseInt(this.value) : this.value
        }
        return datetime ? this.moment(datetime) : null
      },
      set (val) {
        const datetime = val ? this.moment(val).format('YYYY-MM-DD HH:mm:ss') : ''
        this.$emit('input', datetime)
      }
    }
  },
  props: {
    cssConfig: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    'cssConfig': function (newData) {
      // console.log(newData)
      this.setColor(newData)
    }
  },
  methods: {
    moment,
    setColor (item) {
      const valueStyle = document.querySelectorAll('.s-datetime-preview .el-textarea')
      // 字段值
      valueStyle.forEach(data => {
        if (data && item.fontKey) {
          data.style.color = item.fontKey.color
        }
        if (data && item.fontKey) {
          data.style.fontSize = item.fontKey.fontSize
        }
        if (data && item.fontKey) {
          data.style.fontWeight = item.fontKey.fontStyle
        }
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.setColor(this.cssConfig)
    })
  },
  created () {
  }
}
</script>

<style lang="scss">
.s-datetimerange-preview .el-form-item{
  .el-date-editor.el-input{
    width: 100%;
  }
  .el-form-item__content{
    .el-date-editor--datetimerange{
      padding: 3px 20px;

    }
  }
}
</style>
