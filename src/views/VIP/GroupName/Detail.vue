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

export default {
  name: 'vipGroupNameDetail',
  mixins: [baseHeader, baseForm],
  data () {
    return {
      headers: {
        buttons: [
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/memberGroup', 'DELETE')
          }
        ],
        title: '',
        showAlertIcon: true,
        content: '操作说明'
      },
      form: {
        width: '300px',
        api: 'fetchMembersGroupDetail',
        params: {
          id: ''
        },
        form: {
          groupName: '',
          remark: '',
          isDefault: '',
          isAllChannelView: true,
          isAllChannelContribute: true,
          views: [],
          contributes: []
        },
        formItems: [
          {
            prop: 'groupName',
            label: '会员组名',
            placeholder: '请输入会员组名',
            maxlength: 15
          },
          {
            type: 'textarea',
            prop: 'remark',
            label: '描述',
            placeholder: '请输入会员组描述',
            maxlength: 50,
            height: '80px'
          },
          {
            type: 'radio',
            prop: 'isDefault',
            label: '是否为默认组',
            options: [
              {
                value: true,
                label: '是'
              },
              {
                value: false,
                label: '否'
              }
            ]
          },
          {
            type: 'checkbox',
            prop: 'isAllChannelView',
            label: '栏目浏览权限',
            class: 'z-checkbox-single',
            options: [
              {
                value: true,
                label: '所有栏目'
              }
            ]
          },
          {
            type: 'checkTree',
            prop: 'views',
            hiddenKey: 'isAllChannelView',
            hiddenValue: false,
            tree: [],
            props: {
              label: 'name',
              value: 'id'
            },
            labelWidth: '110px'
          },
          {
            type: 'checkbox',
            prop: 'isAllChannelContribute',
            label: '栏目投稿权限',
            class: 'z-checkbox-single',
            options: [
              {
                value: true,
                label: '所有栏目'
              }
            ]
          },
          {
            type: 'checkTree',
            prop: 'contributes',
            hiddenKey: 'isAllChannelContribute',
            hiddenValue: false,
            tree: [],
            props: {
              label: 'name',
              value: 'id'
            },
            labelWidth: '110px'
          }
        ],
        rules: {
          groupName: [this.$rules.required()],
          isDefault: [this.$rules.required()],
          isAllChannelView: [this.$rules.required()],
          isAllChannelContribute: [this.$rules.required()],
          contributes: [
            {
              validator: this.contributesValid,
              trigger: ['blur', 'change']
            }
          ],
          views: [
            {
              validator: this.viewsValid,
              trigger: ['blur', 'change']
            }
          ]
        },
        submitBtns: [{
          text: '保存',
          subType: 'submit',
          disabled: !this._checkPermission('/memberGroup', 'PUT')
        }]
      }
    }
  },
  inject: ['removeTab'],
  methods: {
    ...mapActions('vip', ['FetchMemberGroupOptions']),
    contributesValid (rule, value, callback) {
      value = this.form.form.contributes
      if (value instanceof Array && value.length) {
        callback()
      } else {
        callback(new Error('此项必填'))
      }
    },
    viewsValid (rule, value, callback) {
      value = this.form.form.views
      if (value instanceof Array && value.length) {
        callback()
      } else {
        callback(new Error('此项必填'))
      }
    },
    // 顶部操作按钮
    handleHeaderDelete () {
      this.$confirm('是否确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fetchMembersGroupDelete([this.form.form.id])
      })
    },
    handleConfirm (data) {
      this.form.loading = true
      this.$request.fetchMembersGroupPut(data).then(res => {
        if (res.code === 200) {
          this.hideFormLoading()
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.FetchMemberGroupOptions(true)
          this.removeTab(this.$route.fullPath)
          this.$routerLink('/vip/groupName/index', 'list')
        }
      }).catch(this.hideFormLoading)
    },
    // 发送请求事件
    fetchMembersGroupDelete (ids) {
      this.$request.fetchMembersGroupDelete({ ids }).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.FetchMemberGroupOptions(true)
          this.removeTab(this.$route.fullPath)
          this.$routerLink('/vip/groupName/index', 'list')
        }
      })
    },
    // 会员组下拉
    fetchChannelGetAllTree () {
      this.$request.fetchChannelGetAllTree().then(res => {
        if (res.code === 200) {
          this.form.formItems.find(d => d.prop === 'contributes').tree = res.data
          this.form.formItems.find(d => d.prop === 'views').tree = res.data
        }
      }).catch(() => {
      })
    },
    fetchFormCallBack (res) {
      if (res.code === 200) {
        this.form.form = res.data
      }
    }
  },
  mounted () {
    this.fetchChannelGetAllTree()
    const { id } = this.$route.query
    this.form.params.id = id
    this.fetchFormApi()
  },
  activated () {
    const { id } = this.$route.query
    if (id && id !== this.form.params.id) {
      this.form.params.id = id
      this.fetchFormApi()
      this.fetchChannelGetAllTree()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
