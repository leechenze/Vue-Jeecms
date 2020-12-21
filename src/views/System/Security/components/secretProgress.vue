<template >
  <section class="secret-progress">
    <el-dialog
      title="密级变更提醒"
      :visible.sync="secretdig"
      width="30%"
      :before-close="handleSecretClose">
      <span>{{titleDig}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleSecretClose">取 消</el-button>
        <el-button type="primary" @click="handDeleteBut">仅删除</el-button>
        <el-button type="primary" @click="handResetbut">删除并重置</el-button>
      </span>
    </el-dialog>
      <el-dialog
        title="重置密级"
        :show-close="false"
        :close-on-click-modal="false"
        :visible.sync="secretProgress"
        width="25%"
        :before-close="handleClose">
        <el-progress :percentage="percentage"></el-progress>
        <div class="dig-pro-text">注: 内容数量越多重置所需的时间越长,建议使用后台运行,后台运行不影响其他操作</div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleClose">后台运行</el-button>
        </span>
      </el-dialog>
    </section>
</template>
<script>
export default {
  data () {
    return {
      secretdig: false,
      secretProgress: false,
      percentage: 0,
      timer: 1,
      tiems: ''
    }
  },
  props: {
    allType: {
      type: Boolean,
      default: false
    },
    titleDig: {
      type: String,
      default: ''
    },
    secretData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    secretType: {
      type: Boolean,
      default: false
    },
    secretCode: {
      type: String,
      default: ''
    },
    predictionTimeConsuming: {
      type: Number,
      default: 0
    }
  },
  methods: {
    handleSecretOpen () {
      this.secretdig = true
    },
    handleSecretClose () {
      this.secretdig = false
    },
    // 仅删除密级
    handDeleteBut () {
      this.requestStatus = 1
      if (this.secretType) {
        this.$parent.handDeleteIndexData()
      } else if (this.allType) {
        this.$parent.handAllDeleteData(this.requestStatus)
      } else {
        this.$parent.fetchSysSecretDelete([ this.secretData.id ], this.requestStatus)
      }
    },
    // 删除加重置
    handResetbut () {
      this.requestStatus = 2
      if (this.secretType) {
        this.$parent.handDeleteFormListData()
      } else if (this.allType) {
        this.$parent.handAllDeleteData(this.requestStatus)
      } else {
        this.$parent.fetchSysSecretDelete([ this.secretData.id ], this.requestStatus)
      }
    },
    handProgressItem () {
      this.$request.fetchReinsResult({ code: this.secretCode }).then(res => {
        if (res.code === 200) {
          if (res.data === true) {
            this.percentage = 100
            this.secretProgress = false
            this.secretdig = false
            clearInterval(this.timer)
          }
        } else {
          this.secretProgress = false
          clearInterval(this.timer)
        }
      })
    },
    handProgressData () {
      let that = this
      this.secretdig = false
      this.percentage = 0
      that.secretProgress = true
      that.timer = setInterval(() => {
        that.percentage++
        that.handProgressItem()
        if (that.percentage > 99) {
          clearInterval(that.timer)
        } else if (that.percentage === 99) {
          clearInterval(that.timer)
        }
      }, 500)
    },
    handleClose () {
      this.secretProgress = false
    }
  },
  mounted () {}
}
</script>
<style lang="scss" scoped>
  .secret-progress{
    .dig-pro-text{
      margin-top: 20px;
    }
  }
</style>
