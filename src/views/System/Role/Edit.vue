<template>
  <section class="role-detail-container left-container">
    <el-container>
      <el-aside>
        <div class="left-head">
          <base-header v-bind="asideHeaders"
            v-on:handleAdd="handleHeaderAdd"
          />
        </div>
          <ul class="box-items">
            <li class="box-item jee-hover-color" @click="getRoleDetail(item)"
            :class="item.id == form.params.id?'jee-color':''"
             v-for="(item,index) in roleOptions" :key="index">{{item.roleName}}</li>
          </ul>
      </el-aside>
      <el-main style="padding:10px">
        <base-header v-bind="headers"
          v-on:handleBack="handleBack"
          v-on:handleLink="handleHeaderLink"
          v-on:handleDelete="handleHeaderDelete"
        />
        <base-form
          v-bind="form"
          v-on:handleConfirm="handleConfirm"
        ></base-form>
        <form-dialog
          ref="addDialog"
          :buttons="addButtons"
          :loading="addFormLoading"
          :form="addForm"
          :rules="addRules"
          :formItems="addFormItems"
          v-on:handleConfirm="handleConfirmAdd"
          v-on:handleConfirmRole="handleConfirmRole"
        ></form-dialog>
        <msg-dialog
          v-bind="msgDialog"
          v-on:handleConfirm="fetchSystemRoleDelete"
          v-on:handleCancel="hideMsgDialog"
        />
      </el-main>
    </el-container>
  </section>
</template>
<script>
import role from './role'

export default {
  name: 'roleEdit',
  mixins: [role],
  data () {
    return {
      backUrl: '/system/role/index',
      headers: {
        buttons: [
          {
            type: 'Link',
            text: '权限分配',
            icon: 'kaiqiquanxian',
            href: '/system/role/permission',
            prim: true,
            disabled: false
          },
          {
            type: 'Link',
            text: '成员管理',
            icon: 'chengyuanguanli',
            href: '/system/role/member',
            disabled: false
          },
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/roles', 'DELETE')
          }
        ],
        showAlertIcon: false
      },
      form: {
        api: 'fetchSystemRoleGet',
        params: {
          id: ''
        },
        form: {
          'id': '',
          'roleName': '',
          'description': '',
          'orgid': '',
          'orgids': []
        },
        formItems: [
          {
            prop: 'roleName',
            label: '角色名称：',
            maxlength: 50,
            placeholder: '请输入角色名称'
          },
          {
            type: 'cascader',
            prop: 'orgids',
            props: {
              label: 'name',
              value: 'id',
              checkStrictly: true
            },
            label: '所属组织：',
            placeholder: '请选择上级组织',
            options: []
          },
          {
            prop: 'description',
            label: '角色描述：',
            maxlength: 50,
            type: 'textarea'
          },
          {
            type: 'text',
            prop: 'createUser',
            label: '创建人：'
          },
          {
            type: 'time',
            prop: 'createTime',
            label: '创建时间：'
          }
        ],
        rules: {
          roleName: [
            this.$rules.required()
          ],
          orgids: [
            this.$rules.required()
          ]
        },
        submitBtns: [{
          text: '保存',
          subType: 'submit',
          disabled: !this._checkPermission('/roles', 'PUT')
        }]
      }
    }
  },
  inject: ['removeTab'],
  methods: {
    getRoleDetail (item) {
      this.activeName = item.roleName
      this.form.params.id = item.id
      this.fetchFormApi()
    },
    handleHeaderAdd () {
      this.$refs.addDialog.showDialog()
    },
    // 顶部操作按钮
    handleHeaderDelete () {
      this.msgDialog.type = 'DeleteOne'
      this.msgDialog.content = '删除角色时会影响与其关联的用户权限，是否确定删除？'
      this.msgDialog.data = [this.form.form.id]
      this.showMsgDialog()
    },
    fetchSystemRoleDelete () {
      var params = {
        ids: this.msgDialog.data,
        type: this.type
      }
      this.$request.fetchSystemRoleDelete(params).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.type = 1
          setTimeout(() => {
            this.$routerLink(this.backUrl, 'list')
          }, 500)
        } else if (res.code === 14023) {
          this.type = 2
        }
        this.hideMsgDialog()
      })
    },
    handleConfirm (data) {
      this.form.loading = true
      delete data.org
      data.orgid = data.orgids[data.orgids.length - 1]
      this.$request.fetchSystemRoleUpdate(data).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          // this.getRoleData()
          // this.fetchFormApi()
          setTimeout(() => {
            this.$routerLink(this.backUrl, 'list')
          }, 500)
          this.hideFormLoading()
        } else if (res.code === 812) {
          this.getRoleData()
          this.fetchFormApi()
          setTimeout(() => {
            this.$routerLink(this.backUrl, 'list')
          }, 500)
          this.hideFormLoading()
        }
      }).catch(this.hideFormLoading)
    },
    fetchFormCallBack (res) {
      if (res.code === 200) {
        this.form.form = Object.assign({}, this.form.form, res.data)
        this.form.form.orgids = res.data.org.nodeIds
        this.form.formItems.find(d => d.prop === 'orgids').disabled = !res.data.notCurrUserRole
        this.headers.buttons.find(d => d.type === 'Delete').disabled = !res.data.deleteAble
        this.form.submitBtns.find(d => d.subType === 'submit').disabled = !res.data.managerAble
        this.getTreeList()
      }
    },
    getTreeList () {
      if (!this.form.form.orgids.length) {
        var options = [{
          name: '无',
          id: 'parent'
        }]
        this.form.formItems.find(d => d.prop === 'orgids').options = options
        this.form.form.orgids = ['parent']
      } else {
        this.form.formItems.find(d => d.prop === 'orgids').options = this.organizeOptions
      }
      if (this.organizeOptions instanceof Array) {
        this.addFormItems.find(d => d.prop === 'orgids').options = this.organizeOptions
      }
    },
    getRoleData () {
      const { id } = this.$route.query
      if (id) {
        this.form.params.id = id
        this.fetchFormApi()
        this.FetchRoleOptions(true)
      }
      if (this.organizeOptions.length < 1) {
        this.FetchOrganizeOptions()
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getRoleData()
    })
  },
  watch: {
    organizeOptions (newVal, oldVal) {
      if (newVal) {
        this.getTreeList()
      }
    }
  },
  activated () {
    this.getRoleData()
  }
}
</script>
<style lang="scss" scoped>
.box-items{
    padding: 0 9px;
  }
</style>
