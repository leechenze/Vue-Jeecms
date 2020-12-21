<template>
  <section class="upload-dialog-container">
    <el-dialog
      :close-on-click-modal="false"
      v-loading="loading"
      :title="title"
      :visible.sync="dialogVisible"
    >
      <el-upload
        ref="upload"
        action="https://jsonplaceholder.typicode.com/posts/"
        :on-change="beforeUpload"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :auto-upload="autoUpload"
        :on-progress="handleProgress"
        v-bind="uploadProps"
      >
        <el-input :value="fileName" size="small" >
          <div slot="append">
            <el-button
              style="width:68px"
              slot="trigger"
              size="small"
              class="jee-bg-light-important"
            >选择文件</el-button>
          </div>
        </el-input>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="showCancel" @click="handleCancel" plain>取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
export default {
  name: '',
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
      default: '新建'
    },
    showCancel: {
      type: Boolean,
      default: true
    },
    buttons: {
      type: Array,
      default: () => [
        {
          text: '保存并继续新建',
          type: 'Submit',
          keepAlive: true
        },
        {
          text: '保存',
          type: 'Submit'
        }
      ]
    },
    uploadProps: {
      type: Object,
      default: () => ({})
    },
    multiple: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: 'fileName'
    },
    showFileList: {
      type: Boolean,
      default: true
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    accept: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dialogVisible: false,
      fileList: [
        {
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        },
        {
          name: 'food2.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }
      ]
    }
  },
  computed: {
    fileName () {
      const len = this.fileList.length
      return len > 0 ? this.fileList[this.fileList.length - 1].name : ''
    }
  },
  methods: {
    showDialog () {
      this.dialogVisible = true
    },
    handleCancel () {
      this.dialogVisible = false
    },
    handleConfirm () {
      this.$emit('handleConfirm')
      this.dialogVisible = false
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    beforeUpload (file, fileList) {
      return true
    },
    handleProgress (event, file, fileList) {
      console.log(event)
    }
  }
}
</script>

<style lang="scss">
.upload-dialog-container{
  .el-upload{
    .el-progress.el-progress--line{
      .el-progress-bar{
        .el-progress-bar__outer{
          height: 10px!important;
          // .el-progress-bar__inner{}
        }
      }
    }
  }
}
</style>
