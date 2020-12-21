<template>
    <el-dialog
      class="jee-log"
      :title="title"
      :visible.sync="showLog"
      :width="width"
      :before-close="dialogClose">
      <slot></slot>
    </el-dialog>
</template>
<script>
export default {
  name: 'jeeDialog',
  props: {
    width: {
      type: String, // 弹窗宽度
      default: '600px'
    },
    title: {
      type: String, // 弹框标题
      default: '提示'
    },
    showLog: {
      type: Boolean, // 是否显示弹框
      default: false
    }
  },
  data () {
    return {}
  },
  methods: {
    dialogClose () {
      // this.showLog = false
      this.$emit('hide', false)
    }
  }
}
</script>
<style lang="scss">
  .jee-log{
    padding-top: 72px;
    text-align: left;
    line-height: 1;
    .el-dialog{
      .el-dialog__headerbtn{
        top:30px;
      }
      .el-dialog__body{
        padding: 0 30px 30px;
      }
      .el-dialog__title{
        font-size: 18px;
        color: #333;
        font-family:MicrosoftYaHeiSemilight;
        font-weight:normal;
      }
      .el-dialog__header{
        padding: 30px;
        padding-bottom: 20px;
      }
      .el-input.el-input--small{
       width: 300px;
       height: 32px;
     }
      .el-input--small .el-textarea__inner{
        width: 300px;
        height: 32px;
        box-sizing: border-box;
      }
    }
     .el-select-dropdown.el-popper,.el-input--small .el-input__inner{
        width: 300px;
        font-size: 14px;
      }
      .jee-select,.jee-box,.jee-button{
        margin: 0;
      }
  }
</style>
