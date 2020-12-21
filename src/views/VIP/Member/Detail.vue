<template>
  <section class="vip-member-detail-container">
    <base-header v-bind="headers3"
     v-if="form.status === '2'|| form.status === '0'"
     v-on:handleAudit="handleHeaderAudit"
     v-on:handleAuditNo="handleHeaderAuditNo"
     v-on:handleDeletes="handleHeaderDeletes"
    />
    <base-header v-bind="headers"
      v-else-if="$route.query.id"
      v-on:handleDelete="handleHeaderDelete"
    />
    <base-header v-else v-bind="headers2"/>
    <el-form
      label-suffix="："
      ref="form"
      v-loading="loading"
      label-width="auto"
      :model="form"
      @validate="onValidate"
    >
      <template v-for="(item, index) in formItems">
        <component :key="index" :is="item.preview"
        :index="index" :option="item.value"
        :form="form" v-model="form[item.value.name]"
        />
      </template>
      <el-form-item prop="regSite" label="注册站点" v-if="siteName" class="form-item sm-height">
        <span>{{siteName}}</span>
      </el-form-item>
      <el-form-item prop="regTime" label="注册时间" v-if="registerTime" class="form-item sm-height">
        <span>{{registerTime}}</span>
      </el-form-item>
      <el-form-item class="form-item">
        <el-button  v-show="form.status !== '2'&& form.status !== '0'"
          type="primary"
          size="small"
          @click="handleSubmit"
          :disabled="!_checkPermission('/members', id ? 'POST' : 'PUT')"
        >{{$t('global.save')}}</el-button>
      </el-form-item>
    </el-form>
    <form-dialog
      title="审核原因"
      ref="causeDialog"
      :form="causeForm"
      :rules="causeRules"
      :formItems="causeFormItems"
      v-on:handleConfirm="handleConfirmCause"
      :buttons="causeButtons"
      class="cause-dialog"
    ></form-dialog>
  </section>
</template>
<script>
import PreviewComponents from '@/components/draggable/Preview/components'
import baseHeader from '@/components/mixins/baseHeader'
import formDialog from '@/components/mixins/formDialog'
import { loginType, deepClone } from '@/utils'

export default {
  name: 'vipMemberDetail',
  mixins: [baseHeader, formDialog],
  components: {
    ...PreviewComponents
  },
  inject: ['removeTab'],
  data () {
    return {
      loading: false,
      headers: {
        buttons: [
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/members', 'DELETE')
          }
        ],
        title: '',
        showAlertIcon: true,
        content: '操作说明'
      },
      headers2: {
        title: '操作说明',
        content: '这里是会员新增'
      },
      // 当会员未审核时显示
      headers3: {
        buttons: [
          {
            type: 'Audit',
            text: '审核通过',
            icon: 'shenghetongguo',
            disabled: !this._checkPermission('/members/on', 'POST')
          },
          {
            type: 'AuditNo',
            text: '审核不通过',
            icon: 'shenghebutongguo',
            disabled: !this._checkPermission('/members/off', 'POST')
          },
          {
            type: 'Deletes',
            text: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/members', 'DELETE')
          }
        ],
        title: '',
        showAlertIcon: true,
        content: '操作说明'
      },
      formListKey: 'formListBase',
      form: {},
      detail: {},
      id: '',
      causeForm: {
      },
      causeRules: {
        reason: [this.$rules.required()]
      },
      causeFormItems: [
        {
          prop: 'reason',
          type: 'textarea',
          autosize: { minRows: 3 },
          maxlength: 250
        }
      ],
      causeButtons: [
        {
          text: '确定',
          type: 'Submit'
        }
      ]
    }
  },
  computed: {
    siteName () {
      return this.detail.siteName
    },
    registerTime () {
      return this.detail.registerTime
    },
    formItems () {
      let formItems = []
      if (this.detail && this.detail.renderingField) {
        formItems = this.detail.renderingField[this.formListKey] || []
        // 禁用用户名字段
        if (formItems instanceof Array && formItems.length) {
          formItems = formItems.map(d => {
            if (d.type === 'username') {
              d.value.disabled = true
            }
            return d
          })
        }
        // 密码设为不必填，置空
        const pwIndex = formItems.findIndex(d => d.type === 'password')
        if (pwIndex >= 0) {
          formItems[pwIndex].value.isRequired = false
          let rpwItem = deepClone(formItems[pwIndex])
          rpwItem.index = rpwItem.index + 0.5
          rpwItem.value.name = 'repassword'
          rpwItem.value.label = '重复密码'
          formItems.splice(pwIndex, 0, rpwItem)
        }
      }
      return formItems.sort((a, b) => a.index - b.index)
    },
    getFormData () {
      let data = {
        json: {}
      }
      Object.keys(this.form).forEach(d => {
        const item = this.formItems.find(f => f.value.name === d)
        if (item) {
          if (!item.isCustom) data[d] = this.form[d]
          else data.json[d] = this.form[d]
        } else {
          data[d] = this.form[d]
        }
      })
      let password = data.password
      if (data.password) {
        data.password = password
      }
      delete data.repassword
      return data
    }
  },
  watch: {
    detail (newData) {
      if (newData) {
        const { id, dataField, renderingField } = newData
        let detailForm = Object.assign({}, dataField || {}, {
          id
        })
        if (dataField.password) {
          detailForm.password = ''
          detailForm.repassword = ''
        }
        const fieldKeys = Object.keys(renderingField || {})
        if (fieldKeys.length) {
          fieldKeys.forEach(field => {
            const items = renderingField[field]
            if (items instanceof Array && items.length) {
              items.forEach(item => {
                if (!(item.value.name in detailForm)) {
                  detailForm[item.value.name] = item.value.defaultValue
                }
              })
            }
          })
        }
        this.form = detailForm
      }
    }
  },
  methods: {
    // 表单校验时
    onValidate (val) {
      if (val === 'password') {
        this.$refs.form.validateField('repassword')
      }
    },
    // 审核通过
    handleHeaderAudit () {
      this.$confirm('是否确定通过审核？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fetchMembersOn([this.id])
      })
    },
    // 审核不通过
    handleHeaderAuditNo () {
      this.$refs.causeDialog.showDialog()
    },
    // 审核不通过原因
    handleConfirmCause (data) {
      data.ids = []
      data.ids.push(this.id)
      this.fetchMembersOff(data)
    },
    // 删除
    handleHeaderDeletes () {
      this.$confirm('是否确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fetchMembersDelete([this.id])
      })
    },
    handleHeaderDelete () {
      this.$confirm('是否确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fetchMembersDelete([this.id])
      })
    },
    fetchMembersDelete (ids) {
      this.$request.fetchMembersDelete({ ids }).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.removeTab(this.$route.fullPath)
          if (this.form.status === '2' || this.form.status === '0') {
            this.$routerLink('/vip/checkPending/index', 'list')
          } else {
            this.$routerLink('/vip/member/index', 'list')
          }
        }
      })
    },
    fetchMembersOn (ids) {
      this.$request.fetchMembersOn({ ids }).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '审核通过成功',
            type: 'success'
          })
          this.removeTab(this.$route.fullPath)
          this.$routerLink('/vip/checkPending/index', 'list')
        }
      })
    },
    fetchMembersOff (data) {
      this.$request.fetchMembersOff(data).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '审核不通过成功',
            type: 'success'
          })
          this.removeTab(this.$route.fullPath)
          this.$routerLink('/vip/checkPending/index', 'list')
        }
      })
    },
    fetchMembersDetail () {
      this.loading = true
      this.$request.fetchMembersDetail({ id: this.id }).then(res => {
        if (res.code === 200) {
          this.detail = res.data
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    async handleSubmit (e, btn) {
      let params = this.getFormData
      if (params.password) {
        params.password = await loginType(params.password)
      }
      await this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          this.$request.fetchMembersPut(params).then(res => {
            if (res.code === 200) {
              this._messageSuccess('save')
              this.removeTab(this.$route.fullPath)
              this.$routerLink('/vip/member/index', 'list')
            }
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  mounted () {
    const { id } = this.$route.query
    if (id) {
      this.id = id
      this.fetchMembersDetail()
    }
  },
  activated () {
    const { id } = this.$route.query
    if (id !== this.id) {
      this.id = id
      this.fetchMembersDetail()
    }
  }
}
</script>
<style lang="scss">
.vip-member-detail-container{
  >.el-form{
    margin-top: -15px;
  }
  .el-form-item.form-item{
    padding: 15px 20px;
    margin-bottom: 0 !important;
  }
  .cause-dialog .el-dialog__body .el-form {
    .el-form-item__content{
      margin-left: 0 !important;
      .el-textarea{
        max-width: 540px;
        width: 540px;
      }
   }
  }
}
</style>
