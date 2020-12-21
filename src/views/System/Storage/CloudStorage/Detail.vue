<template>
  <section class="security-user-detail-container">
    <base-header v-bind="headers"
      v-on:handleDelete="handleHeaderDelete"
    />
    <base-form
      v-bind="form"
      v-on:handleConfirm="handleConfirm"
    ></base-form>
  </section>
</template>
<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseForm from '@/components/mixins/baseForm'
import { mapActions } from 'vuex'
import { deepClone } from '../../../../utils'

export default {
  name: 'storageCloudDetail',
  mixins: [baseHeader, baseForm],
  data () {
    return {
      headers: {
        buttons: [
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/sysOss', 'DELETE')
          }
        ],
        title: '',
        showAlertIcon: false,
        paddingBottom: '10px'
        // content: '操作说明'
      },
      form: {
        width: '190px',
        api: 'fetchOssStorageDetail',
        params: {
          id: ''
        },
        form: {
          id: '',
          ossName: '',
          ossType: '',
          bucketName: '',
          bucketArea: '',
          appId: '',
          secretId: '',
          endPoint: '', //
          accessDomain: '',
          appKey: '',
          contentSecretIds: [],
          annexSecretIds: []
        },
        formItems: [
          {
            prop: 'ossName',
            label: 'OSS名称:',
            placeholder: '请输入OSS名称',
            maxlength: 87
          },
          {
            type: 'select',
            prop: 'ossType',
            label: '存储类型:',
            placeholder: '请选择存储类型',
            options: [
              {
                label: '腾讯云',
                value: 1
              },
              {
                label: '阿里云',
                value: 2
              },
              {
                label: '七牛云',
                value: 3
              }
            ]
          },
          {
            prop: 'bucketName',
            label: 'Bucket名:',
            placeholder: '请输入Bucket名',
            maxlength: 87
          },
          {
            prop: 'appId',
            label: 'AppId:',
            placeholder: '请输入AppId',
            hiddenKey: 'ossType',
            hiddenValue: 1,
            maxlength: 255
          },
          {
            prop: 'secretId',
            label: 'secretId:',
            placeholder: '请输入secretId',
            maxlength: 255
          },
          {
            prop: 'bucketArea',
            label: '地区码:',
            placeholder: '请输入地区码',
            hiddenFunc: (item) => {
              return item.ossType === 1 || item.ossType === 3
            },
            maxlength: 87
          },
          {
            prop: 'endPoint',
            label: 'endPoint:',
            placeholder: '请输入endPoint',
            hiddenKey: 'ossType',
            hiddenValue: 2,
            maxlength: 87
          },
          {
            prop: 'accessDomain',
            label: '访问域名:',
            placeholder: '请输入访问域名',
            maxlength: 204
          },
          {
            prop: 'appKey',
            label: 'appKey:',
            placeholder: '请输入appKey',
            maxlength: 255
          }
        ],
        rules: {
          ossName: [this.$rules.required()],
          secretId: [this.$rules.required()],
          ossType: [this.$rules.required()],
          bucketName: [this.$rules.required()],
          appKey: [this.$rules.required()],
          appId: [this.$rules.required()],
          bucketArea: [this.$rules.required()],
          endPoint: [this.$rules.required()],
          accessDomain: [this.$rules.required()]
        },
        submitBtns: [{
          text: '保存',
          subType: 'submit',
          disabled: !this._checkPermission('/sysOss', 'PUT')
        }]
      }
    }
  },
  inject: ['removeTab'],
  methods: {
    ...mapActions('system', ['FetchOSSOptions']),
    // 顶部操作按钮
    handleHeaderDelete () {
      this.$confirm('是否确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fetchOsspStorageDelete([this.form.form.id])
      })
    },
    handleConfirm (data) {
      /* hyt-link */
      let params = deepClone(data)
      params.endPoint = this.$encode(params.endPoint)
      params.accessDomain = this.$encode(params.accessDomain)
      this.form.loading = true
      this.$request.fetchOssStorageUpdate(params).then(res => {
        if (res.code === 200) {
          this.hideFormLoading()
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.FetchOSSOptions(true)
          this.removeTab(this.$route.fullPath)
          this.$routerLink('/system/storage/cloudStorage/index', 'list')
        }
      }).catch(this.hideFormLoading)
    },
    // 发送请求事件
    fetchOsspStorageDelete (ids) {
      this.$request.fetchOsspStorageDelete(ids).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.FetchOSSOptions(true)
          this.removeTab(this.$route.fullPath)
          this.$routerLink('/system/storage/cloudStorage/index', 'list')
        }
      })
    },
    fetchFormCallBack (res) {
      if (res.code === 200) {
        this.form.form = res.data
      }
    }
  },
  mounted () {
    const { id } = this.$route.query
    this.form.params.id = id
    this.fetchFormApi()
  },
  activated () {
    const { id } = this.$route.query
    if (id && id !== this.form.params.id) {
      this.form.params.id = id
      this.fetchFormApi()
    }
  }
}
</script>
<style lang="scss" scoped>
.security-user-detail-container{
  height: 100%;
  .el-container,
  .el-aside{
    height: 100%;
  }
  .el-aside{
    border: 1px solid #e8e8e8;
  }
}
</style>
