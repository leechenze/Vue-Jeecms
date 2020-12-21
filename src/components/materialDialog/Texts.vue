<template>
  <el-dialog
    class="material-dialog-index"
    title="输入文本"
    :visible.sync="innerVisible"
    width="600px"
    ref="texts"
    :close-on-click-modal="false"
     append-to-body
    :before-close="handleClose">
    <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="0px"
      >
      <el-form-item prop="content">
        <el-input
          style="width:510px"
          v-model="form.content"
          type="textarea"
          :maxlength="200"
          show-word-limit
          :autosize="{ minRows: 4 }"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="innerVisible = false">取 消</el-button>
      <el-button size="small" type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>

</template>

<script>
export default {
  name: 'texts',
  data () {
    return {
      innerVisible: false,
      form: {
        content: '',
        msgType: 'text'
      },
      rules: {
        content: [
          this.$rules.required('此项必填', '', 'blur')
        ]
      }
    }
  },
  methods: {
    showDialog () {
      this.innerVisible = true
      this.form.content = ''
      if (this.$refs.form) {
        this.$refs.form.resetFields()
      }
    },
    handleClose () {
      this.innerVisible = false
    },
    handleConfirm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.innerVisible = false
          this.form.msgType = 'text'
          this.$emit('handleConfirm', this.form)
        } else {
          return false
        }
      })
    }
  }
}
</script>
