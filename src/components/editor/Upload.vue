<template>
  <section class="upload-dialog-container">
    <el-dialog
      v-loading="loading"
      :title="title"
      :visible.sync="dialogVisible"
      :width="getWidth"
      :modal-append-to-body="false"
    >
      <el-tabs v-model="activeTab" @tab-click="handleClickTab">
        <template v-for="(item, index) in tabs">
          <el-tab-pane :key="index" :label="item.label" :name="item.component">
            <component
              :key="item.component"
              :is="item.component"
              :ref="item.component"
              :resourceType="resourceType"
              :uploadOption="uploadOption"
              @handleInsertHtml="handleInsertHtml"
              @handleLoading="handleLoading"
            />
          </el-tab-pane>
        </template>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleCancel" plain>取消</el-button>
        <el-button size="small" type="primary" @click="handleConfirm">确定</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import ResourceUpload from './ResourceUpload'
import ResourceLib from './ResourceLib'
export default {
  name: 'Upload',
  components: {
    ResourceUpload,
    ResourceLib
  },
  props: ['resourceType', 'isWechatUpload', 'uploadOption'],
  provide () {
    return {
      uploadOption: this.uploadOption
    }
  },
  data () {
    return {
      loading: false,
      title: '上传',
      dialogVisible: false,
      activeTab: 'ResourceUpload',
      tabs: [
        {
          label: '资源上传',
          component: 'ResourceUpload'
        },
        {
          label: '资源库',
          component: 'ResourceLib'
        }
      ]
    }
  },
  computed: {
    getWidth () {
      return this.activeTab === 'ResourceUpload' ? '750px' : '813px'
    }
  },
  methods: {
    handleClickTab (tab) {
      this.activeTab = tab.name
    },
    resetFields () {
      if (this.activeTab === 'ResourceUpload') {
        try {
          this.$refs.ResourceUpload[0].$refs.form.$refs.form.resetFields()
        } catch (error) { }
      }
    },
    showDialog () {
      this.resetFields()
      this.dialogVisible = true
    },
    handleCancel () {
      this.dialogVisible = false
    },
    handleConfirm () {
      this.$refs[this.activeTab][0].handleConfirm()
    },
    handleLoading (val) {
      this.loading = val
    },
    handleInsertHtml (html, data, file) {
      // 微信素材上传
      if (this.isWechatUpload && this.activeTab === 'ResourceUpload' && file) {
        let { uploadFile } = file
        if (!uploadFile.get('appId') && (this.$route.query.appId || this.$route.query.appid)) {
          uploadFile.append('appId', this.$route.query.appId || this.$route.query.appid)
          uploadFile.append('type', 'image')
          this.$request.fetchWechatMaterialUploadImg(uploadFile).then(res => {
            if (res.code === 200) {
              let url = `<img src='${res.data}'  style='max-width:750px'/>`
              this.$emit('handleConfirm', url, data, file)
            }
          })
        }
      } else if (this.isWechatUpload && this.activeTab === 'ResourceLib') {
        let params = {
          appId: this.$route.query.appId || this.$route.query.appid,
          id: data.id
        }
        this.$request.fetchWechatMaterialSynchImg(params).then(res => {
          if (res.code === 200) {
            let url = `<img src='${res.data.request.url}'  style='max-width:750px'/>`
            this.$emit('handleConfirm', url, data, file)
          }
        })
      } else {
        this.$emit('handleConfirm', html, data, file)
      }
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss">
.upload-dialog-container{
  .el-tabs.el-tabs--top{
    .el-tab-pane{
      border: 0!important;
    }
  }
  .el-dialog__wrapper{
    .el-dialog__body{
      .el-tabs{
        .el-tabs__content{
          .dialog-form-container.resource-upload-container{
            .form-item-wrap{
              .el-form-item{
                .el-form-item__content{
                  // margin-top: -23px;
                  .el-radio-group{
                    display: flex;
                    .el-radio{
                      width: auto;
                    }
                    label{
                      margin-left: 20px;
                    }
                    :first-child{
                      margin-left: 0;
                    }
                  }
                  .jee-multi-image-upload-container .drag-wrap{
                    margin-left: -220px;
                  }
                }
              }
            }
          }
          .resource-select-container .resource-list-wrap .resource-list .resource-item-wrap .el-radio{
            width: 108px !important;
          }
        }
      }
    }
  }
}
</style>
