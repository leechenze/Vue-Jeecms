<template>
  <div class="t-inline ip-wrap">
      <div
        class="t-inline" style="margin-bottom:0px"
        v-for="(item,index) in data" :key="index">
        <el-input class="ip-input"
          v-bind="configs[index]"
          v-model="formData.ipArr[index]"
          @change="selIpText(formData.ipArr[index],configs[index])"></el-input>
      </div>
    <div class="ip-red t-red" v-show="errorMsg">{{errorMsg}}</div>
  </div>
</template>

<script>
export default {
  name: 'ip-input',
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    startData: {
      type: Array,
      default: () => {
        return []
      }
    },
    theType: {
      type: String,
      default: 'start'
    }
  },
  data () {
    return {
      formData: {
        ipArr: ['', '', '', '']
      },
      configs: [],
      errorMsg: ''
    }
  },
  watch: {
    theType (newVal) {
      console.log(newVal)
    },
    data: {
      deep: true,
      handler (newVal) {
        if (newVal) {
          this.formData.ipArr = newVal
          this.getConfigs(newVal)
          if (this.startData && this.theType === 'start') {
            this.rulesStartData(this.startData)
          } else if (this.startData && this.theType === 'end') {
            this.rulesEndData(this.startData)
          }
        }
      }
    },
    startData: {
      deep: true,
      handler (newVal) {
      }
    },
    errorMsg (newVal) {
      if (newVal) {
        this.$emit('errorMsg', true)
      } else {
        this.$emit('errorMsg', false)
      }
    }
  },
  methods: {
    selIpText (val, rules) {
      let s = /^[0-9]*$/
      if (s.test(val)) {
        let num = parseInt(val)
        if (rules.min > num || rules.max < num) {
          this.errorMsg = '请填写' + rules.min + '到' + rules.max + '之间的数值'
        } else {
          this.errorMsg = ''
        }
      } else {
        this.errorMsg = '请填写正确的数值'
      }
    },
    rulesStartData (data) {
      this.data.forEach((t, i) => {
        if (data[i] && t) {
          if (t > data[i]) {
            this.errorMsg = '起始ip字段不能大于结尾ip'
            return false
          }
        }
      })
    },
    rulesEndData (data) {
      this.data.forEach((t, i) => {
        if (data[i] && t) {
          if (t < data[i]) {
            this.errorMsg = '结尾ip字段不能小于起始ip'
            return false
          }
        }
      })
    },
    getConfigs (arr) {
      let configs = []
      if (arr instanceof Array) {
        configs = arr.map((v, i) => {
          let obj = {}
          if (i === 0) {
            obj = {
              readonly: true
            }
          } else if (i === 1) {
            obj = {
              readonly: v === '168',
              placeholder: this.theType === 'start' ? (arr[0] === '172' ? '16' : '0') : (arr[0] === '172' ? '31' : '255'),
              maxlength: arr[0] === '172' ? 2 : 3,
              min: arr[0] === '172' ? 16 : 0,
              max: arr[0] === '172' ? 31 : 255
            }
          } else {
            obj = {
              readonly: false,
              placeholder: this.theType === 'start' ? '0' : '255',
              maxlength: 3,
              min: 0,
              max: 255
            }
          }
          return obj
        })
        this.configs = configs
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.formData.ipArr = this.data
      this.getConfigs(this.data)
    })
  }
}
</script>

<style lang="scss">
.ip-wrap{
  position: relative;
  vertical-align: top;
  .ip-input.el-input{
    width: 40px;
    margin-right: 10px;
    .el-input__inner{
      border-top: none;
      border-left: none;
      border-right: none;
      padding: 0 5px !important;
      text-align: center;
      border-radius: 0;
    }
  }
  .ip-red{
    line-height: 32px;
  }
}

</style>
