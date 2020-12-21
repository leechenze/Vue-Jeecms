<template>
  <div class="jee-box">
    <el-input
    :size="size"
    :type="type"
    :style="'width:'+width+'px'"
    :maxlength="maxlength"
    :placeholder="placeholder"
    @input="handleChange($event)"
    :value="value">
    <div slot="append" v-if="icon">
      <el-button size="small" type="primary" :icon="icon"></el-button>
    </div>
      <slot></slot>
    </el-input>
  </div>
</template>
<script>
export default {
  name: 'jeeInput',
  props: {
    disabled: {
      type: Boolean, // 是否禁用
      default: false
    },
    clearable: {
      type: Boolean, // 是否可清除
      default: false
    },
    type: {
      type: String, // 输入框类型
      default: 'text'
    },
    maxlength: {
      type: String, // 最大输入长度
      default: 'default'
    },
    size: {
      type: String, // 文本框大小
      default: 'small'
    },
    placeholder: {
      type: String, // 占位符
      default: '请输入内容'
    },
    value: {
      default: () => {
        return []
      }, // 文本框内容
      type: [String, Number, Array]
    },
    width: {
      default: 300, // 占位符
      type: [Number, String]
    },
    icon: {
      default: '',
      type: String
    }
  },
  data () {
    return {}
  },
  methods: {
    handleChange (evt) {
      this.$emit('input', evt)
    }
  }
}
</script>

<style lang="scss">
/*input框*/
  .jee-box{
    display: inline-block;
    .el-input{
      &--small{
        font-size: 14px;
      }
    }
  }
</style>
