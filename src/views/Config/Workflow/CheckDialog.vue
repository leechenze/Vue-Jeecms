<template>
  <el-dialog
    title="流程检查"
    width="494px"
    :visible.sync="dialogVisible"
    class="check-dialog-container"
    :class="type"
  >
    <div class="title-wrap">
      <jee-icon :iconClass="getIcon"/>
      <span>{{getTitle}}</span>
    </div>
    <ul class="message-wrap">
      <li v-for="(item, index) in messages" :key="index">{{item}}</li>
    </ul>
    <div class="footer-wrap" v-if="tooltips.length">
      <jee-icon iconClass="tishixinxi"/>
      <ul>
        <li v-for="(item, index) in tooltips" :key="index">{{item}}</li>
      </ul>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'CheckDialog',
  props: {
    messages: {
      type: Array,
      default: () => []
    },
    tooltips: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      dialogVisible: false,
      type: 'success'
    }
  },
  computed: {
    getTitle () {
      return this.type === 'success' ? '流程检查通过' : '工作流规则错误'
    },
    getIcon () {
      return this.type === 'success' ? 'chenggong1' : 'cuowu'
    }
  },
  methods: {
    showDialog (type) {
      this.type = type
      this.dialogVisible = true
    },
    handleCancel () {
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.check-dialog-container{
  .el-dialog{
    .title-wrap{
      display: flex;
      align-items: center;
      .jee-svg-icon{
        fill: red;
        font-size: 40px;
        padding-right: 20px;
        padding-left: 133px;
      }
      span{
        color: red;
        font-size: 18px;
        // font-weight: bold;
      }
    }
    ul.message-wrap{
      padding-top: 14px;
      padding-left: 193px;
      li{
        color: red;
        font-size: 14px;
        line-height: 26px;
      }
    }
    .footer-wrap{
      display: flex;
      padding-top: 37px;
      .jee-svg-icon{
        fill: #FF9300;
        font-size: 20px;
        padding: 3px 10px 0 12px;
      }
      li{
        color: #666666;
        line-height: 26px;
      }
    }
  }

  &.success{
    .title-wrap{
      .jee-svg-icon{
        fill: #6AC043;
      }
      span{
        color: #6AC043;
      }
    }
    .message-wrap span,
    li{
      color: #6AC043;
    }
  }
}
</style>
