<template>
  <section class="crontab-setting-container">
    <!-- 周期类型按钮 -->
    <div class="cron-type-list-wrap">
      <template v-for="(item, index) in cronTypes.filter(d => typeBtns.includes(d.value))">
        <el-button :key="index" :type="item.value === activeCronType?'primary':'empty'" size='small' @click="handleClickType(item)">{{item.label}}</el-button>
      </template>
    </div>
    <!-- 周期设置 -->
    <div v-show="activeCronType === '3'" class='cron-period'>
      <span>从</span>
      <el-input-number size='small' v-model="cronTypes[2].minVal" :max="cronTypes[2].maxVal" :min="1"></el-input-number>
      <span>至</span>
      <el-input-number size='small' v-model="cronTypes[2].maxVal" :min="cronTypes[2].minVal"></el-input-number>
      <span>{{label}}</span>
    </div>
    <!-- 循环设置 -->
    <div v-show="activeCronType === '4'" class='cron-loop'>
      <span>从</span>
      <el-input-number size='small' v-model="cronTypes[3].minVal" :min='0'></el-input-number>
      <span>{{label}}开始，每</span>
      <el-input-number size='small' v-model="cronTypes[3].maxVal" :min='1'></el-input-number>
      <span>{{label}}执行一次</span>
    </div>
    <!-- 工作日 -->
    <div v-show="activeCronType === '5'" class='cron-period'>
      <span>本月</span>
      <el-input-number size='small' v-model="cronTypes[4].day" :max="31" :min="1"></el-input-number>
      <span>号，最近的工作日</span>
    </div>
    <!-- 指定周 -->
    <div v-show="activeCronType === '7'" class='cron-period'>
      <span>本月第</span>
      <el-input-number size='small' v-model="cronTypes[6].week" :max="4" :min="1"></el-input-number>
      <span>周，星期</span>
      <el-input-number size='small' v-model="cronTypes[6].day" :min="1" :max="7"></el-input-number>
    </div>
    <!-- 本周最后一天 -->
    <div v-show="activeCronType === '8'" class='cron-period'>
      <span>星期</span>
      <el-input-number size='small' v-model="cronTypes[7].day" :max="7" :min="1"></el-input-number>
    </div>
    <!-- 指定设置 -->
    <div v-show="activeCronType === '9'" class='cron-custom'>
      <el-checkbox-group v-model="cronTypes[8].checkList" @change="handleChangeCustom">
        <template v-for="(item, index) in getCheckData">
          <el-checkbox :key="index" :label="item"></el-checkbox>
        </template>
      </el-checkbox-group>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Second',
  props: {
    name: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    typeBtns: {
      type: Array,
      default: () => ['1', '3', '4', '9']
    },
    value: {
      type: String,
      default: ''
    },
    period: {
      type: Object,
      default: () => ({
        minVal: 1,
        maxVal: 2
      })
    },
    loop: {
      type: Object,
      default: () => ({
        minVal: 0,
        maxVal: 1
      })
    }
  },
  data () {
    return {
      activeCronType: '1',
      cronTypes: [
        {
          value: '1',
          label: '每' + this.label
        },
        {
          value: '2',
          label: '不指定'
        },
        {
          value: '3',
          label: '周期',
          minVal: this.period.minVal,
          maxVal: this.period.maxVal
        },
        {
          value: '4',
          label: '循环',
          minVal: this.loop.minVal,
          maxVal: this.loop.maxVal
        },
        {
          value: '5',
          label: '工作日',
          day: 1
        },
        {
          value: '6',
          label: '本月最后一天'
        },
        {
          value: '7',
          label: '指定周',
          week: 1,
          day: 1
        },
        {
          value: '8',
          label: '本周最后一天',
          day: 1
        },
        {
          value: '9',
          label: '指定',
          checkList: []
        }
      ]
    }
  },
  computed: {
    val: {
      get () {
        return this.value
      },
      set (val) {
        // console.log(val)
        this.$emit('input', val)
      }
    },
    getCheckData () {
      let value = []
      switch (this.name) {
        case '1':
        case '2':
          value = this.getRangNums(0, 60)
          break
        case '3':
          value = this.getRangNums(0, 24)
          break
        case '4':
          value = this.getRangNums(1, 32)
          break
        case '5':
          value = this.getRangNums(1, 13)
          break
        case '6':
          value = this.getRangNums(1, 8)
          break
        default:
          break
      }
      return value
    }
  },
  watch: {
    value (newData, oldData) {
      if (newData !== oldData) {
        if (newData === '*') {
          if (!this.typeBtns.includes('1')) return
          this.activeCronType = '1'
        } else if (newData === '?') {
          if (!this.typeBtns.includes('2')) return
          this.activeCronType = '2'
        } else if (newData.includes('-')) {
          if (!this.typeBtns.includes('3')) return
          this.activeCronType = '3'
          const d = newData.split('-')
          if (d.length) {
            let t = this.cronTypes[2]
            t.minVal = Number(d[0])
            if (d.length > 1) {
              t.maxVal = Number(d[1])
            }
            this.cronTypes.splice(2, 1, t)
          }
        } else if (newData.includes('/')) {
          if (!this.typeBtns.includes('4')) return
          this.activeCronType = '4'
          const d = newData.split('/')
          if (d.length) {
            let t = this.cronTypes[3]
            t.minVal = Number(d[0])
            if (d.length > 1) {
              t.maxVal = Number(d[1])
            }
            this.cronTypes.splice(3, 1, t)
          }
        } else if (newData.includes('W')) {
          if (!this.typeBtns.includes('5')) return
          this.activeCronType = '5'
          const d = newData.split('W')
          if (d.length) {
            let t = this.cronTypes[4]
            t.day = Number(d[0])
            this.cronTypes.splice(4, 1, t)
          }
        } else if (newData === 'L') {
          if (!this.typeBtns.includes('6')) return
          this.activeCronType = '6'
        } else if (newData.includes('#')) {
          if (!this.typeBtns.includes('7')) return
          this.activeCronType = '7'
          const d = newData.split('#')
          if (d.length) {
            let t = this.cronTypes[6]
            t.week = Number(d[0])
            if (d.length > 1) {
              t.day = Number(d[1])
            }
            this.cronTypes.splice(6, 1, t)
          }
        } else if (newData.includes('L')) {
          if (!this.typeBtns.includes('8')) return
          this.activeCronType = '8'
          const d = newData.split('L')
          if (d.length) {
            let t = this.cronTypes[7]
            t.day = Number(d[0])
            this.cronTypes.splice(7, 1, t)
          }
        } else if (newData) {
          if (!this.typeBtns.includes('9')) return
          this.activeCronType = '9'
          let t = this.cronTypes[8]
          t.checkList = newData.split(',')
          this.cronTypes.splice(8, 1, t)
        }
      }
    },
    cronTypes: {
      deep: true,
      handler (newData) {
        if (this.activeCronType !== '9') {
          const item = this.cronTypes.find(d => d.value === this.activeCronType)
          this.handleClickType(item)
        }
      }
    }
  },
  methods: {
    getRangNums (min, max) {
      let nums = []
      if (typeof min === 'number' && typeof max === 'number' && max > min) {
        for (let num = min; num < max; num++) {
          nums.push(num < 10 ? '0' + num : '' + num)
        }
      }
      return nums
    },
    handleClickType (item) {
      this.activeCronType = item.value
      let value = '*'
      switch (item.value) {
        case '2':
          value = '?'
          break
        case '3':
          value = `${item.minVal}-${item.maxVal}`
          break
        case '4':
          value = `${item.minVal}/${item.maxVal}`
          break
        case '5':
          value = `${item.day}W`
          break
        case '6':
          value = 'L'
          break
        case '7':
          value = `${item.week}#${item.day}`
          break
        case '8':
          value = `${item.day}L`
          break
        case '9':
          value = item.checkList.sort((a, b) => a - b).join(',')
          break
        default:
          break
      }
      this.$emit('input', value)
    },
    handleChangeCustom (val) {
      this.$emit('input', val.sort((a, b) => a - b).join(','))
    }
  }
}
</script>

<style lang="scss" scoped>
.crontab-setting-container{
  .cron-type-list-wrap{
    display: flex;
    flex-wrap: wrap;
    .el-button + .el-button {
      margin-left: 0;
    }
    .el-button{
      margin-right: 10px;
      margin-top: 10px;
    }
  }
  .cron-period,
  .cron-loop{
    display: flex;
    align-items: center;
    padding-top: 20px;
    .el-input-number{
      margin: 0 10px;
    }
  }
  .cron-custom{
    padding-top: 10px;
    .el-checkbox-group{
      height: auto;
      .el-checkbox{
        padding-top: 10px
      }
    }
  }
}
</style>
