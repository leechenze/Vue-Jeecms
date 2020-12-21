<template>
  <section class="check-group-container">
    <div class="check-group-box">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <div style="margin: 15px 0;"></div>
      <el-checkbox-group v-model="checks" @change="handleCheckedCitiesChange">
        <el-checkbox v-for="item in group[type]" :label="item.value" :key="item.value">{{item.label}}</el-checkbox>
      </el-checkbox-group>
    </div>
  </section>
</template>

<script>
export default {
  name: 'checkGroup',
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    type: {
      type: String,
      default: 'week'
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      checkAll: false,
      isIndeterminate: false,
      checks: this.value,
      group: {
        week: [
          { label: '星期一', value: '1' },
          { label: '星期二', value: '2' },
          { label: '星期三', value: '3' },
          { label: '星期四', value: '4' },
          { label: '星期五', value: '5' },
          { label: '星期六', value: '6' },
          { label: '星期日', value: '7' }
        ],
        hour: [
          { label: '0点', value: '0' },
          { label: '1点', value: '1' },
          { label: '2点', value: '2' },
          { label: '3点', value: '3' },
          { label: '4点', value: '4' },
          { label: '5点', value: '5' },
          { label: '6点', value: '6' },
          { label: '7点', value: '7' },
          { label: '8点', value: '8' },
          { label: '9点', value: '9' },
          { label: '10点', value: '10' },
          { label: '11点', value: '11' },
          { label: '12点', value: '12' },
          { label: '13点', value: '13' },
          { label: '14点', value: '14' },
          { label: '15点', value: '15' },
          { label: '16点', value: '16' },
          { label: '17点', value: '17' },
          { label: '18点', value: '18' },
          { label: '19点', value: '19' },
          { label: '20点', value: '20' },
          { label: '21点', value: '21' },
          { label: '22点', value: '22' },
          { label: '23点', value: '23' }
        ]
      }
    }
  },
  methods: {
    handleCheckAllChange (val) {
      var value = val ? this.group[this.type].map(v => { return v.value }) : []
      this.checks = value
      this.isIndeterminate = false
      this.$emit('input', this.checks)
    },
    handleCheckedCitiesChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.group[this.type].length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.group[this.type].length
      this.$emit('input', value)
    }
  },
  watch: {
    value (newVal, oldVal) { // 监控单个变量
      if (newVal !== oldVal) {
        this.checks = this.value
        this.handleCheckedCitiesChange(newVal)
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.handleCheckedCitiesChange(this.value)
    })
  }
}
</script>

<style lang="scss">
.check-group-container{
  .el-checkbox-group{
    height: inherit !important;
    max-width: 765px;
     .el-checkbox{
       display: inline-block;
       min-width: 65px;
       min-height: 28px;
     }
  }
  .el-checkbox .el-checkbox__inner{
      border-radius: 50% !important;
    }
}
</style>
