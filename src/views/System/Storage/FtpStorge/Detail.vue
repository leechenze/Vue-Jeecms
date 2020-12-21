<template>
  <section class="security-user-detail-container">
    <base-header v-bind="headers"
      v-on:handleBack="handleHeaderBack"
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
import { loginType, deepClone } from '@/utils'
import { mapActions } from 'vuex'

export default {
  name: 'storageFtpDetail',
  mixins: [baseHeader, baseForm],
  data () {
    return {
      headers: {
        buttons: [
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/ftp', 'DELETE')
          }
        ],
        title: '',
        showAlertIcon: false,
        paddingBottom: '10px'
        // content: '操作说明'
      },
      form: {
        labelWidth: 'auto',
        api: 'fetchFtpStorageDetail',
        params: {
          id: ''
        },
        form: {
        },
        formItems: [
          {
            prop: 'ftpName',
            label: 'FTP名称：',
            placeholder: '请输入FTP名称',
            maxlength: 50
          },
          {
            prop: 'ip',
            label: '服务IP：',
            placeholder: '请输入服务IP',
            maxlength: 40
          },
          {
            prop: 'port',
            label: '端口号：',
            placeholder: '请输入端口号',
            maxlength: 5
          },
          {
            prop: 'ftpPath',
            label: '远程目录：',
            placeholder: '请输入远程目录',
            maxlength: 204
          },
          {
            prop: 'username',
            label: '登录名：',
            placeholder: '请输入登录名',
            maxlength: 50
          },
          {
            prop: 'password',
            label: '密码：',
            'show-password': true,
            placeholder: '请输入密码',
            maxlength: 40
          },
          {
            prop: 'encoding',
            label: '编码：',
            placeholder: '请输入编码',
            maxlength: 16
          },
          {
            prop: 'url',
            label: '资源访问域名：',
            placeholder: '域名必须是http或https协议',
            maxlength: 204
          }
        ],
        rules: {
          ftpName: [this.$rules.required()],
          ip: [this.$rules.required(), this.$rules.ip()],
          port: [this.$rules.required(), this.$rules.number(), this.$rules.rangeNum(1, 65535)],
          username: [this.$rules.required()],
          encoding: [this.$rules.required()],
          ftpPath: [this.$rules.required()],
          url: [this.$rules.required()]
        },
        submitBtns: [{
          text: '保存',
          subType: 'submit',
          disabled: !this._checkPermission('/ftp', 'PUT')
        }]
      }
    }
  },
  inject: ['removeTab'],
  methods: {
    ...mapActions('system', ['FetchFTPOptions']),
    // 顶部操作按钮
    handleHeaderDelete () {
      this.$confirm('是否确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fetchFtpStorageDelete([this.form.form.id])
      })
    },
    async handleConfirm (data) {
      this.form.loading = true
      /* hyt-link s */
      let params = deepClone(data)
      if (params.password) {
        params.password = await loginType(data.password)
      }
      params.ftpPath = this.$encode(params.ftpPath)
      params.url = this.$encode(params.url)
      /* hyt-link e */

      await this.$request.fetchFtpStorageUpdate(params).then(res => {
        if (res.code === 200) {
          this.hideFormLoading()
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.FetchFTPOptions(true)
          this.removeTab(this.$route.fullPath)
          this.$routerLink('/system/storage/ftpStorge/index', 'list')
        }
      }).catch(this.hideFormLoading)
    },
    // 发送请求事件
    fetchFtpStorageDelete (ids) {
      this.$request.fetchFtpStorageDelete(ids).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.FetchFTPOptions(true)
          this.removeTab(this.$route.fullPath)
          this.$routerLink('/system/storage/ftpStorge/index', 'list')
        }
      })
    },
    fetchFormCallBack (res) {
      if (res.code === 200) {
        this.form.form = res.data
        this.form.form.password = ''
        console.log(this.form)
      }
    }
  },
  mounted () {
    const { id } = this.$route.query
    this.form.params.id = id
    this.fetchFormApi()
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      if (newRoute.name === 'storageFtpDetail') {
        const { id } = newRoute.query
        if (id && id !== this.form.params.id) {
          this.form.params.id = id
          this.fetchFormApi()
        }
      }
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
