<template>
  <section class="msg-dialog-container">
    <el-dialog
      :title="title"
      :width="width"
      :visible.sync="visible"
    >
      <span class="dialog-content">
        <i class="el-icon-warning"/>{{content}}
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" v-if="showCancel" @click="handleCancel">取消</el-button>
        <el-button size="small" type="primary" @click="handleDelete">替换</el-button>
        <el-button size="small" type="primary" @click="handleConfirm">保留</el-button>
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
  methods: {
    handleCancel () {
      this.$emit('handleCancel')
    },
    handleConfirm () {
      this.$emit('handleConfirm')
    },
    handleDelete () {
      this.$emit('handleDelete')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
