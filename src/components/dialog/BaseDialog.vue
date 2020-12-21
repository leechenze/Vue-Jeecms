<template>
  <section class="base-dialog-container">
    <el-dialog
      v-loading="loading"
      :title="$t(title)"
      :width="width"
      :visible.sync="dialogVisible"
    >
      <slot name="body"></slot>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="showCancel" @click="handleCancel" size="small" plain>{{$t('global.cancel')}}</el-button>
        <el-button type="primary" size="small"
          v-for="(item, index) in buttons" :key="index"
          @click="handleConfirm(item)">{{$t(item.text)}}
        </el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
export default {
  name: 'baseDialog',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '600px'
    },
    title: {
      type: String,
      default: 'global.create'
    },
    showCancel: {
      type: Boolean,
      default: true
    },
    buttons: {
      type: Array,
      default () {
        return [
          {
            text: 'global.saveAndContinue',
            type: 'Submit',
            keepAlive: true
          },
          {
            text: 'global.save',
            type: 'Submit'
          }
        ]
      }
    }
  },
  data () {
    return {
      dialogVisible: false
    }
  },
  methods: {
    showDialog () {
      this.dialogVisible = true
    },
    handleCancel () {
      this.dialogVisible = false
    },
    handleConfirm (btn) {
      this.$emit('handleConfirm', btn)
    }
  }
}
</script>

<style lang="scss">
.base-dialog-container{
  .el-input,
  .el-textarea,
  .el-cascader,
  .el-select {
    max-width: 300px;
    width: 100%;
  }
}
</style>
