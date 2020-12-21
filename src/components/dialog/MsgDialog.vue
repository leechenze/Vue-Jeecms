<template>
  <section class="msg-dialog-container">
    <el-dialog
      :title="title"
      :width="width"
      @close="handleCancel"
      :visible.sync="msgVisible"
    >
      <span class="dialog-content">
        <i class="el-icon-warning"/>{{content}}
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" v-if="showCancel" @click="handleCancel" type='empty'>取消</el-button>
        <el-button size="small" type="primary" @click="handleConfirm">确定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '500px'
    },
    title: {
      type: String,
      default: '提示'
    },
    icon: {
      type: String,
      default: 'warning'
    },
    type: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    showCancel: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      msgVisible: this.visible
    }
  },
  watch: {
    visible (newVal) {
      this.msgVisible = newVal
    }
  },
  methods: {
    handleCancel () {
      this.msgVisible = false
      this.$emit('handleCancel')
    },
    handleConfirm () {
      this.$emit('handleConfirm', this.type)
      this.handleCancel()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
